<script>
import { chessboard } from 'vue-chessboard';

const Chess = require('chess.js');

export default {
    name: 'CustomBoard',
    extends: chessboard,
    props: ['pgn', 'structure', 'flipped'],
    computed: {
        chess: function () {
            if (this.pgn == null) return new Chess();

            const pgnMoves = this.pgn.split('\n').filter(l => l[0] !== '[').join(' ').replace('\n', '');
            const chess = new Chess();
            chess.load_pgn(pgnMoves);

            const chessPlay = new Chess();

            for (const move of chess.history({ verbose: true })) {
                chessPlay.move(move);
                if (this.structure === this.getStructure(chessPlay)) {
                    return chessPlay;
                }
            }

            return new Chess();
        },
    },
    methods: {
        getStructure: function (chess) {
            const pawnChess = new Chess(chess.fen());
            for (const square of pawnChess.SQUARES) {
                const piece = pawnChess.get(square);
                if (piece !== null && piece.type !== 'p') {
                    pawnChess.remove(square);
                }
            }

            return pawnChess.fen().split(' ')[0];
        },
        updateBoard: function (newChess) {
            this.board.set({
                fen: newChess.fen(),
            });

            const history = newChess.history({ verbose: true });
            const lastMove = history[history.length - 1];
            if (lastMove != null) {
                this.board.state.lastMove = [lastMove.from, lastMove.to];
            }
        },
    },
    watch: {
        chess: function (newChess) {
            this.updateBoard(newChess);
        },
        flipped: {
            handler: function () {
                this.board.toggleOrientation();
            },
        },
    },
    mounted() {
        this.board.set({
            // Free moves allowed
            animation: {
                enabled: true,
            },
            viewOnly: true,
        });

        if (this.chess.history().length > 0) {
            this.updateBoard(this.chess);
        }

        if (this.flipped) {
            this.board.toggleOrientation();
        }
    },
};
</script>

<style lang="scss">
.snapshot.blue .cg-board-wrap {
    background-size: 320px 320px;
    background-image: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) ), url($metal);
    zoom: 0.355;
}
// Disabling coordinates attribute doesn't work
.snapshot.blue {
    color: rgba(0, 0, 0, 0);
}
</style>
