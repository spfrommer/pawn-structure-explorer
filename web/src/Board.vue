<script>
import { chessboard }  from 'vue-chessboard'
import $ from 'jquery'

export default {
    name: 'board',
    extends: chessboard,
    props: ['highlights'],
    methods: {
        drawHighlights() {
            console.log('Drawing highlights!');
            console.log(this.highlights);

            let highlightBoard = $('<div></div>').addClass('cg-board').attr('id', 'highlight-board');
            $('.cg-board-wrap').append(highlightBoard);

            let square = $('<square></square>').addClass('highlight');
            square = square.css('transform', 'translate(240px, 40px)');
            square = square.css('background-color', 'green');

            $('#highlight-board').append(square); 
        },
        userPlay() {
            return (orig, dest) => {
                if (this.isPromotion(orig, dest)) {
                    this.promoteTo = this.onPromotion()
                }
                this.game.move({from: orig, to: dest, promotion: this.promoteTo}) // promote to queen for simplicity
                this.board.set({
                    fen: this.game.fen()
                })
                this.calculatePromotions()
                this.aiNextMove()
            };
        }
    },
    mounted() {


        this.board.set({
            movable: { events: { after: this.userPlay()} },
        })
    }
}
  </script>