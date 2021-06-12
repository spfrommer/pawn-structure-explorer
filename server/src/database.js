const fs = require('fs');
const path = require('path');

const { MongoClient } = require('mongodb');
const { Chess } = require('chess.js');

const utils = require('./utils.js');

class Database {
    constructor(mongoUri, pgnsDir) {
        this.client = this.connectToMongo(mongoUri);
        this.pgnsDir = pgnsDir;
    }

    connectToMongo(uri) {
        const client = new MongoClient(uri);
        async function run() {
            try {
                await client.connect();
                await client.db('admin').command({ ping: 1 });
                console.log('Connected successfully to server');
            } finally {
                await client.close();
            }
        }
        run().catch(console.dir);

        return client;
    }

    pgnFiles() {
        return fs.readdirSync(this.pgnsDir).filter(f => f.endsWith('.pgn'));
    }

    indexPgnFile(pgnFile) {
        console.log('Indexing: ' + pgnFile);
        const pgnGenerator = utils.readSplit(path.join(this.pgnsDir, pgnFile), '[Event');
        for (const pgn of pgnGenerator) {
            let pgnMoves = pgn.split('\n').filter(l => l[0] !== '[').join(' ').replace('\n', '');

            let pgnChess = new Chess();
            pgnChess.load_pgn(pgnMoves);
            // console.log(pgnChess.fen());

            let chess = new Chess();
            for (const move of pgnChess.history()) {
                chess.move(move);
                let fen = chess.fen();
                console.log(fen);
            }
        }
    }
}

module.exports = Database;