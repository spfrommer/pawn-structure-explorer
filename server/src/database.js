const fs = require('fs');
const path = require('path');
const mongojs = require('mongojs');

const GameParser = require('./gameParser');
const utils = require('./utils');

class Database {
    constructor(mongoUri, pgnsDir) {
        this.db = mongojs(`${mongoUri}/db`, ['structurePieceLocs', 'structureGames', 'gamePgn']);
        this.pgnsDir = pgnsDir;

        this.pieceLocsIndexing = {
            seenStructures: new Set(),
            bulkInits: null,
            bulkUpdates: null,
        };

        this.gamesIndexing = {
            seenStructures: new Set(),
            seenGames: new Set(),
            bulkInits: null,
            bulkUpdates: null,
        };

        this.gamePgnIndexing = {
            seenGames: new Set(),
            bulkInits: null,
        };
    }

    drop() {
        return utils.promiseBind(this.db.structurePieceLocs, 'drop')()
            .then(utils.promiseBind(this.db.structureGames, 'drop')())
            .then(utils.promiseBind(this.db.gamePgn, 'drop')());
    }

    getPieceLocs(structure) {
        return utils.promiseBind(this.db.structurePieceLocs, 'findOne')({ _id: structure });
    }

    getGames(structure) {
        return utils.promiseBind(this.db.structureGames, 'findOne')({ _id: structure });
    }

    getPgn(gameId) {
        return utils.promiseBind(this.db.gamePgn, 'findOne')({ _id: gameId });
    }

    findAllPieceLocs() {
        return utils.promiseBind(this.db.structurePieceLocs, 'find')({});
    }

    findAllGames() {
        return utils.promiseBind(this.db.structureGames, 'find')({});
    }

    findAllGamePgn() {
        return utils.promiseBind(this.db.gamePgn, 'find')({});
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

                    const groupPadded = group.toString().padStart(5, '0');
                    const pgnCountPadded = pgnCount.toString().padStart(2, '0');
                    const elapsedSecondsPadded = elapsedSeconds.toFixed(2).padStart(4, '0');
                    const ratePadded = (pgnCount / elapsedSeconds).toFixed(2).padStart(5, '0');

                    console.log(`Indexed: ${pgnFile} (${groupPadded}): ${pgnCountPadded} pgns in ${elapsedSecondsPadded} (${ratePadded}/s)`);

                    nextGroup = utils.takeList(pgnsAll, GROUP_SIZE);
                    group++;
                }
            }
        };

        return indexAll();
    }

    indexPgns(pgns) {
        this.initializeBulkOps();

        let pgnsCount = 0;
        for (const pgn of pgns) {
            new GameParser(pgn).parse(this.indexOnPosition.bind(this));
            pgnsCount++;
        }

        const self = this;

        async function runBulkIndex() {
            await utils.promiseBind(self.pieceLocsIndexing.bulkInits, 'execute')();
            await utils.promiseBind(self.pieceLocsIndexing.bulkUpdates, 'execute')();
            await utils.promiseBind(self.gamesIndexing.bulkInits, 'execute')();
            await utils.promiseBind(self.gamesIndexing.bulkUpdates, 'execute')();
            await utils.promiseBind(self.gamePgnIndexing.bulkInits, 'execute')();

            return pgnsCount;
        }
        return runBulkIndex();
    }

    initializeBulkOps() {
        this.pieceLocsIndexing.bulkInits = this.db.structurePieceLocs.initializeUnorderedBulkOp();
        this.pieceLocsIndexing.bulkUpdates = this.db.structurePieceLocs.initializeUnorderedBulkOp();
        this.gamesIndexing.bulkInits = this.db.structureGames.initializeUnorderedBulkOp();
        this.gamesIndexing.bulkUpdates = this.db.structureGames.initializeUnorderedBulkOp();
        this.gamePgnIndexing.bulkInits = this.db.gamePgn.initializeUnorderedBulkOp();
    }

    indexOnPosition(structure, pieceLocs, tags) {
        // TODO: only one bad pgn each doc, maybe pgn parsing is bad...
        if (tags.Result == null) return; // Sometimes don't have result data

        this.indexPieceLocsOnPosition(structure, pieceLocs, tags);
        this.indexGamesOnPosition(structure, pieceLocs, tags);
        this.indexGamePgnOnPosition(structure, pieceLocs, tags);
    }

    indexPieceLocsOnPosition(structure, pieceLocs, tags) {
        const indexingState = this.pieceLocsIndexing;
        const newStructure = !indexingState.seenStructures.has(structure);

        if (newStructure) {
            indexingState.bulkInits.find({ _id: structure }).upsert().updateOne({
                $setOnInsert: this.constructor.defaultPieceLocs(),
            });

            indexingState.seenStructures.add(structure);
        }

        for (const [square, piece] of Object.entries(pieceLocs)) {
            const loc = utils.toFileRank(square);
            const updateKey = `${tags.Result}.${piece.color}.${piece.piece}.${loc.rank}.${loc.file}`;

            indexingState.bulkUpdates.find({ _id: structure }).update({
                $inc: { [updateKey]: 1 },
            });
        }
    }

    indexGamesOnPosition(structure, pieceLocs, tags) {
        const indexingState = this.gamesIndexing;
        const newStructure = !indexingState.seenStructures.has(structure);
        const newGame = !indexingState.seenGames.has(structure);

        if (newStructure) {
            indexingState.bulkInits.find({ _id: structure }).upsert().updateOne({
                $setOnInsert: this.constructor.defaultGames(),
            });

            indexingState.seenStructures.add(structure);
        }

        if (newGame) indexingState.seenGames.add(tags.GameId);

        if (newStructure || newGame) {
            const countUpdateKey = `${tags.Result}.gameCount`;

            indexingState.bulkUpdates.find({ _id: structure }).update({
                $inc: { [countUpdateKey]: 1 },
            });

            const openingUpdateKey = `${tags.Result}.openings.${tags.OpeningMain}.${tags.OpeningVariations}`;
            indexingState.bulkUpdates.find({ _id: structure }).update({
                $push: { [openingUpdateKey]: tags.GameId },
            });
        }
    }

    indexGamePgnOnPosition(structure, pieceLocs, tags) {
        const indexingState = this.gamePgnIndexing;
        const newGame = !indexingState.seenGames.has(structure);

        if (newGame) {
            indexingState.bulkInits.find({ _id: tags.GameId }).upsert().updateOne({
                $setOnInsert: tags.pgn,
            });

            indexingState.seenGames.add(tags.GameId);
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
