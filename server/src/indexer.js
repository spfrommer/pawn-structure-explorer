const { Chess } = require('chess.js');

class GameIndexer {
    constructor(pgn) {
        let pgnMoves = pgn.split('\n').filter(l => l[0] !== '[').join(' ').replace('\n', '');

        this.chess = new Chess();
        this.chess.load_pgn(pgnMoves);
    }

    index(onPosition) {
        let chessPlay = new Chess();
        let pieceLocs = this.initialPieceLocs();
        function movePiece(from, to) {
            pieceLocs[to] = pieceLocs[from];
            delete pieceLocs[from];
        }

        onPosition(this.getPawnFen(chessPlay), pieceLocs);

        for (const move of this.chess.history({'verbose': true})) {
            chessPlay.move(move);

            if (move.piece !== 'p') {
                movePiece(move.from, move.to);
                
                // Move rook if castle
                let homeRank = move.color === 'w' ? 1 : 8;
                if (move.flags === 'k') {
                    movePiece('h' + homeRank, 'f' + homeRank);
                } else if (move.flags === 'q') {
                    movePiece('a' + homeRank, 'd' + homeRank);
                }
            } else if (move.captured !== 'p') {
                delete pieceLocs[move.to];
            }

            onPosition(this.getPawnFen(chessPlay), pieceLocs);
        }
    }

    initialPieceLocs() {
        let pieceLocs = {};
        for (let i = 0; i < 8; i++) {
            let files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            pieceLocs[files[i] + '1'] = { color: 'white', piece: i };
            pieceLocs[files[i] + '8'] = { color: 'black', piece: i };
        }
        return pieceLocs;
    }

    coordinates(square) {
        let squareNum = this.chess.SQUARES[square];
        return { 'rank': this.chess.rank(squareNum), 'file': this.chess.file(squareNum) }
    }

    getPawnFen(chess) {
        let pawnChess = new Chess(chess.fen());
        for (const square of pawnChess.SQUARES) {
            let piece = pawnChess.get(square);
            if (piece !== null && piece['type'] !== 'p') {
                pawnChess.remove(square);
            }
        }

        return pawnChess.fen();
    }
}

module.exports = GameIndexer;