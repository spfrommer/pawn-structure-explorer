const { Chess } = require('chess.js');
const utils = require('./utils');

class GameIndexer {
    constructor(pgn) {
        const pgnMoves = pgn.split('\n').filter(l => l[0] !== '[').join(' ').replace('\n', '');
        this.chess = new Chess();
        this.chess.load_pgn(pgnMoves);

        this.tags = this.constructor.getGameTags(pgn);
    }

    static getGameTags(pgn) {
        const tags = {};

        let tagLines = pgn.split('\n').filter(l => l[0] === '[');
        tagLines = tagLines.map(l => l.replace('[', '').replace('"]', ''));
        for (const tagLine of tagLines) {
            const parts = tagLine.split(' "');
            console.assert(parts.length === 2);
            tags[parts[0]] = parts[1];
        }

        return tags;
    }

    index(onPosition) {
        const chessPlay = new Chess();
        const pieceLocs = this.constructor.initialPieceLocs();
        function movePiece(from, to) {
            pieceLocs[to] = pieceLocs[from];
            delete pieceLocs[from];
        }

        onPosition(this.constructor.getStructure(chessPlay), pieceLocs, this.tags);

        for (const move of this.chess.history({ verbose: true })) {
            const movedOriginal = move.from in pieceLocs; // move non promoted piece
            chessPlay.move(move);

            if (movedOriginal || move.piece === 'p') {
                if (move.piece !== 'p') {
                    movePiece(move.from, move.to);

                    // Move rook if castle
                    const homeRank = move.color === 'w' ? 1 : 8;
                    if (move.flags === 'k') {
                        movePiece(`h${homeRank}`, `f${homeRank}`);
                    } else if (move.flags === 'q') {
                        movePiece(`a${homeRank}`, `d${homeRank}`);
                    }
                } else if (move.captured !== 'p') {
                    delete pieceLocs[move.to];
                }
            }

            onPosition(this.constructor.getStructure(chessPlay), pieceLocs, this.tags);
        }
    }

    coordinates(square) {
        const squareNum = this.chess.SQUARES[square];
        return { rank: this.chess.rank(squareNum), file: this.chess.file(squareNum) };
    }

    static getStructure(chess) {
        const pawnChess = new Chess(chess.fen());
        for (const square of pawnChess.SQUARES) {
            const piece = pawnChess.get(square);
            if (piece !== null && piece.type !== 'p') {
                pawnChess.remove(square);
            }
        }

        return pawnChess.fen().split(' ')[0];
    }

    static initialPieceLocs() {
        const pieceLocs = {};
        for (let i = 0; i < 8; i++) {
            pieceLocs[utils.toSquare(i, 1)] = { color: 'white', piece: i };
            pieceLocs[utils.toSquare(i, 8)] = { color: 'black', piece: i };
        }
        return pieceLocs;
    }
}

module.exports = GameIndexer;
