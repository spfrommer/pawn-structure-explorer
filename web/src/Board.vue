<script>
import { chessboard } from 'vue-chessboard';
import $ from 'jquery';

import { EventBus } from './event-bus';
import variables from './styles/_variables.scss';

const Color = require('color');

const HUE_SCALE = 10;
const INTENSITY_CAP = 0.5;

export default {
    name: 'CustomBoard',
    extends: chessboard,
    props: ['highlights', 'flipped'],
    watch: {
        highlights: {
            handler: function (highlights) {
                const { intensities, hues } = highlights;

                let maxIntensity = this.$utils.maxArray(intensities);
                if (maxIntensity === 0) maxIntensity = 1;

                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j < 8; j++) {
                        const intensity = INTENSITY_CAP * (intensities[7 - j][i] / maxIntensity);
                        const hue = HUE_SCALE * (hues[7 - j][i] / maxIntensity) + 0.5;

                        const color = Color(highlights.colormap(hue)).alpha(intensity).string();
                        $(`#highlight-board square:nth-child(${i * 8 + j + 1}`).css('background-color', color);
                    }
                }
            },
            deep: true,
        },
        flipped: {
            handler: function (boardFlipped) {
                this.board.toggleOrientation();
                this.addHighlightOverlays(boardFlipped);
            },
        },
    },
    methods: {
        editorMouseDownHandler: function (mouseEvent, color) {
            this.board.dragNewPiece({ role: 'pawn', color, promoted: false }, mouseEvent, true);
        },
        structure: function () {
            return this.board.getFen();
        },
        addHighlightOverlays: function (boardFlipped) {
            $('#highlight-board').remove();

            const highlightBoard = $('<div></div>').addClass('cg-board').attr('id', 'highlight-board');
            $('.cg-board-wrap').append(highlightBoard);

            const squareSize = variables.squareSizeInt;
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    const jFlip = boardFlipped ? 7 - j : j;
                    let square = $('<square></square>').addClass('highlight');
                    square = square.css('transform', `translate(${i * squareSize}px, ${jFlip * squareSize}px)`);
                    square = square.css('background-color', 'rgba(0, 0, 0, 0.0)');
                    $('#highlight-board').append(square);
                }
            }
        },
    },
    mounted() {
        // Add overlay highlight squares
        this.addHighlightOverlays();

        this.board.set({
            // Only pawn starting position
            fen: '8/pppppppp/8/8/8/8/PPPPPPPP/8 w KQkq - 0 1',
            // Free moves allowed
            movable: {
                color: 'both',
                free: true,
                events: { after: undefined },
            },
            // Drag pieces off board to delete
            draggable: {
                deleteOnDropOff: true,
            },
        });

        EventBus.$on('editorMouseDown', this.editorMouseDownHandler);

        this.board.set({
            events: { change: () => { this.$emit('boardChange'); } },
        });
    },
};
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
</style>
