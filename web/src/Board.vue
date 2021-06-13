<script>
import { chessboard }  from 'vue-chessboard'
import $ from 'jquery'

export default {
    name: 'board',
    extends: chessboard,
    props: ['highlights'],
    methods: {
        drawHighlights() {
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
        }
    },
    mounted() {
        // Add overlay highlight squares
        let highlightBoard = $('<div></div>').addClass('cg-board').attr('id', 'highlight-board');
        $('.cg-board-wrap').append(highlightBoard);

        // Free moves allowed
        this.board.set({
            movable: {
                color: 'both',
                free: true,
                events: { after: undefined }
            }
        })
    }
}
</script>

<style>
.blue .cg-board-wrap {
    background-size: 320px 320px;
    background-image: url("../assets/metal.jpg");
}
.cg-board:not(#highlight-board) square {
    opacity: 0.0;
}
</style>