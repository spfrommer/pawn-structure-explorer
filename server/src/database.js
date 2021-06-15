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

    // ================================================================================
    // Indexing
    // ================================================================================

    buildIndex() {
        const indexAll = async () => {
            const pgnFiles = fs.readdirSync(this.pgnsDir).filter(f => f.endsWith('.pgn'));
            for (const pgnFile of pgnFiles) {
                const startTime = process.hrtime();
                const pgnCount = await this.indexPgnFile(pgnFile);
                const elapsedSeconds = utils.hrtimeToSeconds(process.hrtime(startTime));

                const pgnCountPadded = pgnCount.toString().padStart(7, '0');
                const elapsedSecondsPadded = elapsedSeconds.toFixed(2).padStart(7, '0');
                const ratePadded = (pgnCount / elapsedSeconds).toFixed(2).padStart(6, '0');

                console.log(`${pgnFile}; ${pgnCountPadded} pgns in ${elapsedSecondsPadded} (${ratePadded}/s)`);
            }
        };

        return indexAll();
    }

    indexPgnFile(pgnFile) {
        this.bulkPieceInits = this.db.structurePieceLocs.initializeUnorderedBulkOp();
        this.bulkPieceUpdates = this.db.structurePieceLocs.initializeUnorderedBulkOp();

        const self = this;

        const pgns = utils.readSplit(path.join(this.pgnsDir, pgnFile), '[Event');
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

    indexOnPosition(structure, pieceLocs, result) {
        if (!this.seenStructures.has(structure)) {
            this.bulkPieceInits.find({ _id: structure }).upsert().updateOne({
                $setOnInsert: this.constructor.defaultPieceLocs(),
            });

            this.seenStructures.add(structure);
        }

        for (const [square, piece] of Object.entries(pieceLocs)) {
            const loc = utils.toFileRank(square);
            const updateKey = `${result}.${piece.color}.${piece.piece}.${loc.rank}.${loc.file}`;
            // console.log(updateKey);

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
