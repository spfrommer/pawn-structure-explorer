<script>
import { chessboard } from 'vue-chessboard';

const Chess = require('chess.js');

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
            console.log('Trying to compute game...');
            console.log(this.structure);

            if (this.pgn == null) return new Chess();

            const pgnMoves = this.pgn.split('\n').filter(l => l[0] !== '[').join(' ').replace('\n', '');
            const chess = new Chess();
            chess.load_pgn(pgnMoves);
            console.log(chess);

            const chessPlay = new Chess();

            for (const move of chess.history({ verbose: true })) {
                chessPlay.move(move);
                console.log('-----------');
                console.log(this.structure);
                console.log(this.getStructure(chessPlay));
                if (this.structure === this.getStructure(chessPlay)) {
                    console.log('Found chess!');
                    return chessPlay;
                }
            }

            return new Chess();
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
.snapshot.blue .cg-board-wrap {
    background-size: 320px 320px;
    background-image: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) ), url($metal);
}
</style>
