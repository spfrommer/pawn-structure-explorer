const fs = require('fs');
const path = require('path');
const mongojs = require('mongojs')

const { MongoClient } = require('mongodb');
const { Chess } = require('chess.js');

const GameIndexer = require('./indexer.js');
const utils = require('./utils.js');

class Database {
    constructor(mongoUri, pgnsDir) {
        this.db = mongojs(mongoUri + '/db', ['pieceLocs'])
        this.pgnsDir = pgnsDir;

        this.bulkPieceInitialize = null;
        this.bulkPieceUpdates = null;
    }

    pgnFiles() {
        return fs.readdirSync(this.pgnsDir).filter(f => f.endsWith('.pgn'));
    }

    indexPgnFile(pgnFile) {
        console.log('Indexing: ' + pgnFile);

        this.bulkPieceInitialize = this.db.pieceLocs.initializeUnorderedBulkOp();
        this.bulkPieceUpdates = this.db.pieceLocs.initializeUnorderedBulkOp();

        let db = this.db;

        let seenPawnFens = new Set();
        const pgns = utils.readSplit(path.join(this.pgnsDir, pgnFile), '[Event');
        for (const pgn of pgns) {
            const indexer = new GameIndexer(pgn);
            indexer.index(this.indexOnPosition.bind(this, seenPawnFens));
        }

        /*
        initializeBulk.findAndModify({
            query: { _id: pawnFen },
            update: {
                $setOnInsert: this.defaultPieceLocs(),
            },
            upsert: true
        });
        */

        this.bulkPieceInitialize.execute(function (err, res) {
            console.log('Done initializing pawn fens!')
            // let ids = db.pieceLocs.find().project( {_id: 1} ).map(x => x._id).toArray();
            // let ids = db.runCommand ( { distinct: "distinct", key: "_id" } )
            /*
            let ids = db.pieceLocs.distinct('_id', {}, {}, (err, result) => {
                console.log('Distinct: ');
                console.log(result);
            });
            */
            db.pieceLocs.find((err, docs) => {
                console.log('Got docs: ');
                console.log(docs);
            });
        })
    }

    defaultPieceLocs() {
        let pieceLocs = { black: {}, white: {} };
        for (let i = 0; i < 8; i++) {
            pieceLocs.black[i] = utils.zeros(8, 8);
            pieceLocs.white[i] = utils.zeros(8, 8);
        }
        return pieceLocs;
    }

    indexOnPosition(seenPawnFens, pawnFen, pieceLocs) {
        if (!seenPawnFens.has(pawnFen)) {
            pawnFen = pawnFen.split(" ")[0];

            this.bulkPieceInitialize.find({ _id: pawnFen }).upsert().updateOne({
                $setOnInsert: { 'black': this.defaultPieceLocs().black, 'white': this.defaultPieceLocs().white },
            });

            seenPawnFens.add(pawnFen);
        }
    }
}

module.exports = Database;