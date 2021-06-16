const fs = require('fs');
const path = require('path');
const mongojs = require('mongojs');

const GameIndexer = require('./indexer');
const utils = require('./utils');

class Database {
    constructor(mongoUri, pgnsDir) {
        this.db = mongojs(`${mongoUri}/db`, ['structurePieceLocs', 'structureGames']);
        this.pgnsDir = pgnsDir;

        this.seenStructures = new Set();

        this.bulkPieceInits = null;
        this.bulkPieceUpdates = null;
    }

    drop() {
        return new Promise((resolve, reject) => {
            this.db.structurePieceLocs.drop((err, doc) => {
                if (err !== null) reject();
                resolve(doc);
            });
        });
    }

    getPieceLocs(structure) {
        return new Promise((resolve, reject) => {
            this.db.structurePieceLocs.findOne({ _id: structure }, (err, pieceLocs) => {
                if (err !== null) reject();
                resolve(pieceLocs);
            });
        });
    }

    findAll() {
        return new Promise((resolve, reject) => {
            this.db.structurePieceLocs.find({ }, (err, docs) => {
                if (err !== null) reject();
                resolve(docs);
            });
        });
    }

    stats() {
        return new Promise((resolve, reject) => {
            this.db.stats((err, stats) => {
                if (err !== null) reject();
                resolve(stats);
            });
        });
    }

    // ================================================================================
    // Indexing
    // ================================================================================

    buildIndex() {
        const indexAll = async () => {
            const pgnFiles = fs.readdirSync(this.pgnsDir).filter(f => f.endsWith('.pgn'));

            for (const pgnFile of pgnFiles) {
                const pgnsAll = utils.readSplit(path.join(this.pgnsDir, pgnFile), '[Event');

                // Group pgn updates into x games at a time; addresses mongodb bug
                // where it hallucinates big docs if you do one big bulk write
                const GROUP_SIZE = 10;
                let nextGroup = utils.takeList(pgnsAll, GROUP_SIZE);
                let group = 0;
                
                while (nextGroup.length > 0) {
                    const startTime = process.hrtime();
                    const pgnCount = await this.indexPgns(nextGroup);
                    const elapsedSeconds = utils.hrtimeToSeconds(process.hrtime(startTime));

                    const pgnCountPadded = pgnCount.toString().padStart(7, '0');
                    const elapsedSecondsPadded = elapsedSeconds.toFixed(2).padStart(7, '0');
                    const ratePadded = (pgnCount / elapsedSeconds).toFixed(2).padStart(6, '0');

                    console.log(`${pgnFile} (${group}): ${pgnCountPadded} pgns in ${elapsedSecondsPadded} (${ratePadded}/s)`);

                    nextGroup = utils.takeList(pgnsAll, GROUP_SIZE);
                    group++;
                }
            }
        };

        return indexAll();
    }

    indexPgns(pgns) {
        this.bulkPieceInits = this.db.structurePieceLocs.initializeUnorderedBulkOp();
        this.bulkPieceUpdates = this.db.structurePieceLocs.initializeUnorderedBulkOp();

        const self = this;

        let pgnsCount = 0;
        for (const pgn of pgns) {
            const indexer = new GameIndexer(pgn);
            indexer.index(this.indexOnPosition.bind(this));
            pgnsCount++;
        }

        return new Promise((resolve, reject) => {
            self.bulkPieceInits.execute(err => {
                if (err !== null) reject(err);

                self.bulkPieceUpdates.execute(err => {
                    if (err !== null) reject(err);

                    resolve(pgnsCount);
                });
            });
        });
    }

    indexOnPosition(structure, pieceLocs, tags) {
        // TODO: only one bad pgn each doc, maybe pgn parsing is bad...
        if (tags.Result == null) return; // Sometimes don't have result data

        if (!this.seenStructures.has(structure)) {
            // upsert.updateOne bombs out with doc size errors...
            // this.bulkPieceInits.find({ _id: structure }).upsert({
            this.bulkPieceInits.find({ _id: structure }).upsert().updateOne({
                $setOnInsert: this.constructor.defaultPieceLocs(),
            });

            this.seenStructures.add(structure);
        }

        for (const [square, piece] of Object.entries(pieceLocs)) {
            const loc = utils.toFileRank(square);
            const updateKey = `${tags.Result}.${piece.color}.${piece.piece}.${loc.rank}.${loc.file}`;

            this.bulkPieceUpdates.find({ _id: structure }).update({
                $inc: { [updateKey]: 1 },
            });
        }
    }

    static defaultPieceLocs() {
        function createPieceLocs() {
            const pieceLocs = { black: {}, white: {} };
            for (let i = 0; i < 8; i++) {
                pieceLocs.black[i] = utils.zeros(8, 8);
                pieceLocs.white[i] = utils.zeros(8, 8);
            }
            return pieceLocs;
        }
        return { '1-0': createPieceLocs(), '1/2-1/2': createPieceLocs(), '0-1': createPieceLocs() };
    }
}

module.exports = Database;
