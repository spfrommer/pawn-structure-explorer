const { Chess } = require('chess.js');

class GameIndexer {
    constructor(pgn) {
        let pgnMoves = pgn.split('\n').filter(l => l[0] !== '[').join(' ').replace('\n', '');

        this.chess = new Chess();
        this.chess.load_pgn(pgnMoves);
    }

    index() {
        let chessPlay = new Chess();
        for (const move of this.chess.history({'verbose': true})) {
            chessPlay.move(move);
            console.log(move);
        }
    }
}

module.exports = GameIndexer;