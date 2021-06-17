<script>
import { chessboard } from 'vue-chessboard';

const { Chess } = require('chess.js');

export default {
    name: 'CustomBoard',
    extends: chessboard,
    props: ['pgn', 'structure'],
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
    },
    computed: {
        chess: function () {
            const chess = new Chess();
            chess.load_pgn(this.pgn);

            const chessPlay = new Chess();

            for (const move of chess.history({ verbose: true })) {
                chessPlay.move(move);
                if (this.structure === this.getStructure(chessPlay)) {
                    return chessPlay;
                }
            }

            throw Error('Could not find position for structure');
        },
    },
    watch: {
        chess: function (newChess) {
            this.board.set({
                fen: newChess.fen(),
            });
        },
    },
    mounted() {
        this.board.set({
            // Free moves allowed
            animation: {
                enabled: true,
            },
        });
    },
};
</script>

<style lang="scss">
.blue .cg-board-wrap {
    background-size: 80px 80px;
    background-image: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) ), url($metal);
}
</style>
