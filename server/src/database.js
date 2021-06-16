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

        this.bulkPieceLocsInits = null;
        this.bulkPieceLocsUpdates = null;

        this.bulkGamesInits = null;
        this.bulkGamesUpdates = null;
    }

    drop() {
        return utils.promiseBind(this.db.structurePieceLocs, 'drop')();
    }

    getPieceLocs(structure) {
        return utils.promiseBind(this.db.structurePieceLocs, 'findOne')({ _id: structure });
    }

    findAll() {
        return utils.promiseBind(this.db.structurePieceLocs, 'find')({});
    }

    stats() {
        return utils.promiseBind(this.db.structurePieceLocs, 'stats')();
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
        this.bulkPieceLocsInits = this.db.structurePieceLocs.initializeUnorderedBulkOp();
        this.bulkPieceLocsUpdates = this.db.structurePieceLocs.initializeUnorderedBulkOp();

        const self = this;

        let pgnsCount = 0;
        for (const pgn of pgns) {
            const indexer = new GameIndexer(pgn);
            indexer.index(this.indexOnPosition.bind(this));
            pgnsCount++;
        }

        // nodeUtil.promisify(self.bulkPieceLocsInits.execute);

        /*
        async function runBulkIndexing() {
            try {
                await self.bulkPieceLocsInits.execute(); // need to promisify
            } catch(err) {
                console.log(err);
            }
        }
        */

        return new Promise((resolve, reject) => {
            self.bulkPieceLocsInits.execute(err => {
                if (err !== null) reject(err);

                self.bulkPieceLocsUpdates.execute(err => {
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
            this.bulkPieceLocsInits.find({ _id: structure }).upsert().updateOne({
                $setOnInsert: this.constructor.defaultPieceLocs(),
            });

            this.seenStructures.add(structure);
        }

        for (const [square, piece] of Object.entries(pieceLocs)) {
            const loc = utils.toFileRank(square);
            const updateKey = `${tags.Result}.${piece.color}.${piece.piece}.${loc.rank}.${loc.file}`;

            this.bulkPieceLocsUpdates.find({ _id: structure }).update({
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

    static defaultGames() {
        function createGames() {
            return { gameCount: 0, openings: {} };
        }
        return { '1-0': createGames(), '1/2-1/2': createGames(), '0-1': createGames() };
    }

}

module.exports = Database;
