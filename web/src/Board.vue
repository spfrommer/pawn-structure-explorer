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
            let intensities = this.highlights.intensities;

            for (var i = 0; i < intensities.length; i++) {
                for (var j = 0; j < intensities[i].length; j++) {
                    let intensity = intensities[i][j];

                    let square = $('<square></square>').addClass('highlight');
                    square = square.css('transform', `translate(${i*40}px, ${j*40}px)`);
                    square = square.css('background-color', this.highlights.colormap(intensity));

                    $('#highlight-board').append(square); 
                }
            }
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
        let highlightBoard = $('<div></div>').addClass('cg-board').attr('id', 'highlight-board');
        $('.cg-board-wrap').append(highlightBoard);

        this.board.set({
            movable: { events: { after: this.userPlay()} },
        })
    }
}
  </script>