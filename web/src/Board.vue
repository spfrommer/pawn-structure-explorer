<script>
import { EventBus } from './event-bus';
import { chessboard }  from 'vue-chessboard';
import $ from 'jquery';

export default {
    name: 'CustomBoard',
    extends: chessboard,
    props: ['highlights'],
    watch: {
        'highlights': {
            handler: function(highlights) {
                $('#highlight-board').empty();

                let intensities = highlights.intensities;

                for (var i = 0; i < intensities.length; i++) {
                    for (var j = 0; j < intensities[i].length; j++) {
                        let intensity = intensities[i][j];

                        let square = $('<square></square>').addClass('highlight');
                        square = square.css('transform', `translate(${i*40}px, ${j*40}px)`);
                        square = square.css('background-color', highlights.colormap(intensity));

                        $('#highlight-board').append(square); 
                    }
                }
            },
            deep: true
        }
    },
    methods: {
        editorMouseDownHandler: function(mouseEvent, color) {
            this.board.dragNewPiece({role: 'pawn', color: color, promoted: false}, mouseEvent, true);
        }
    },
    mounted() {
        // Add overlay highlight squares
        let highlightBoard = $('<div></div>').addClass('cg-board').attr('id', 'highlight-board');
        $('.cg-board-wrap').append(highlightBoard);

        this.board.set({
            // Only pawn starting position
            fen: '8/pppppppp/8/8/8/8/PPPPPPPP/8 w KQkq - 0 1',
            // Free moves allowed
            movable: {
                color: 'both',
                free: true,
                events: { after: undefined }
            },
            // Drag pieces off board to delete
            draggable: {
                deleteOnDropOff: true
            }
        });

        EventBus.$on('editorMouseDown', this.editorMouseDownHandler);

        this.board.set({
            events: { change: () => { EventBus.$emit('boardChange'); } },
        }) 
    }
}
</script>

<style lang="scss">
.blue {
    float: left;
}
.blue .cg-board-wrap {
    background-size: 320px 320px;
    background-image: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url($metal);
}
.cg-board:not(#highlight-board) square {
    opacity: 0.0;
}
#highlight-board square {
    top: 1%;
    left: 1%;
    width: 10.5%;
    height: 10.5%;
}

coord {
    color: $secondary;
}
</style>