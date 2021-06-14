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
                let intensities = highlights.intensities;

                for (var i = 0; i < 8; i++) {
                    for (var j = 0; j < 8; j++) {
                        let intensity = intensities[i][j];
                        $(`#highlight-board square:nth-child(${i * 8 + j + 1}`).css('background-color', highlights.colormap(intensity)); 
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
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                let square = $('<square></square>').addClass('highlight');
                square = square.css('transform', `translate(${i*40}px, ${j*40}px)`);
                square = square.css('background-color', 'rgba(0, 0, 0, 0.0)');
                $('#highlight-board').append(square); 
            }
        }


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
    background-image: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) ), url($metal);
}
.cg-board:not(#highlight-board) square {
    opacity: 0.0;
}
#highlight-board square {
    top: 1%;
    left: 1%;
    width: 10.5%;
    height: 10.5%;
    transition: background-color 0.4s ease;
}

coord {
    color: scale-color($secondary, $lightness: 50%);
}
</style>