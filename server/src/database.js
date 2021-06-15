const fs = require('fs');
const path = require('path');
const mongojs = require('mongojs')
const async = require('async');

const GameIndexer = require('./indexer.js');
const utils = require('./utils.js');

class Database {
    constructor(mongoUri, pgnsDir) {
        this.db = mongojs(mongoUri + '/db', ['pieceLocs'])
        this.pgnsDir = pgnsDir;

        this.seenPawnFens = new Set();

        this.bulkPieceInits = null;
        this.bulkPieceUpdates = null;
    }

    drop() {
        return new Promise((resolve, reject) => {
            this.db.pieceLocs.drop((err, doc) => {
                if (err !== null) reject();
                resolve(doc);
            });
        });
    }

    //================================================================================
    // Querying 
    //================================================================================

    getPieceLocs(pawnFen) {
        return new Promise((resolve, reject) => {
            this.db.pieceLocs.findOne({ _id: pawnFen }, (err, doc) => {
                if (err !== null) reject();
                resolve(doc);
            });
        });
    }

    //================================================================================
    // Indexing
    //================================================================================

    buildIndex() {
        let self = this;

        const indexAll = async () => {
            let pgnFiles = fs.readdirSync(this.pgnsDir).filter(f => f.endsWith('.pgn')); 
            for (const pgnFile of pgnFiles) {
                console.log("Indexing: " + pgnFile);
                await self.indexPgnFile(pgnFile);
            }
        }
        return indexAll();
    }

    indexPgnFile(pgnFile) {
        this.bulkPieceInits = this.db.pieceLocs.initializeUnorderedBulkOp();
        this.bulkPieceUpdates = this.db.pieceLocs.initializeUnorderedBulkOp();

        let self = this;

        const pgns = utils.readSplit(path.join(this.pgnsDir, pgnFile), '[Event');
        for (const pgn of pgns) {
            const indexer = new GameIndexer(pgn);
            indexer.index(this.indexOnPosition.bind(this));
        }

        return new Promise((resolve, reject) => {
            self.bulkPieceInits.execute((err, res) => {
                if (err !== null) reject(err);

                self.bulkPieceUpdates.execute((err, res) => {
                    if (err !== null) reject(err);

                    resolve();
                });
            });
        });
    }

    indexOnPosition(pawnFen, pieceLocs) {
        if (!this.seenPawnFens.has(pawnFen)) {
            this.bulkPieceInits.find({ _id: pawnFen }).upsert().updateOne({
                $setOnInsert: this.defaultPieceLocs(),
            });

            this.seenPawnFens.add(pawnFen);
        }

        for (let [loc, piece] of Object.entries(pieceLocs)) {
            loc = utils.toFileRank(loc);
            let updateKey = `${piece.color}.${piece.piece}.${loc.rank}.${loc.file}`;

            this.bulkPieceUpdates.find({ _id: pawnFen }).update({
                $inc: { [updateKey]: 1 }
            });
        }
    }

    defaultPieceLocs() {
        let pieceLocs = { black: {}, white: {} };
        for (let i = 0; i < 8; i++) {
            pieceLocs.black[i] = utils.zeros(8, 8);
            pieceLocs.white[i] = utils.zeros(8, 8);
        }
        return pieceLocs;
    }
}

module.exports = Database;