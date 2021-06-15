<template>
    <div id="app">
        <SpareBank ref="upperBank" :id="'upperBank'"
            :vertical="false"
            :selectable="true"
            :pieces="piecesUpper"
            @spareClick="upperBankClick"/>
        <div id="boardEditor">
            <Board ref="board"
                :highlights="{colormap: highlightColormap, intensities: highlightIntensities}"
                :free="true"
                @boardChange="boardChange"/>
            <Editor :id="'editor'"/>
        </div>
        <SpareBank ref="lowerBank" :id="'lowerBank'"
            :vertical="false"
            :selectable="true"
            :pieces="piecesLower"
            @spareClick="lowerBankClick"/>
    </div>
</template>

<script>
import Board from './Board.vue';
import Editor from './Editor.vue';
import SpareBank from './SpareBank.vue';
import variables from './styles/_variables.scss';

const interpolate = require('color-interpolate');
const Color = require('color');

export default {
    name: 'App',
    components: {
        Board,
        SpareBank,
        Editor,
    },
    methods: {
        upperBankClick(event, i) {
            this.$refs.lowerBank.clearSelection();
            const unselect = this.selectedColor === 'black' && this.selectedPiece === i;
            this.selectedColor = unselect ? '' : 'black';
            this.selectedPiece = unselect ? -1 : i;
        },
        lowerBankClick(event, i) {
            this.$refs.upperBank.clearSelection();
            const unselect = this.selectedColor === 'white' && this.selectedPiece === i;
            this.selectedColor = unselect ? '' : 'white';
            this.selectedPiece = unselect ? -1 : i;
        },
        boardChange() {
            const endpoint = `/api/pieceLocs?structure=${this.$refs.board.structure()}`;
            this.$http.get(endpoint).then(response => {
                const responseJson = JSON.parse(response.bodyText);
                this.pieceLocs = (responseJson === null) ? {} : responseJson;
            }, err => { console.error(err); });
        },
    },
    computed: {
        hasPieceLocs: function () {
            return Object.keys(this.pieceLocs).length !== 0;
        },
        highlightIntensities: function () {
            console.log(this.pieceLocs);

            if (this.hasPieceLocs && this.selectedColor !== '' && this.selectedPiece !== -1) {
                // return this.pieceLocs[this.selectedColor][this.selectedPiece];
                return this.combinedPieceLocs[this.selectedColor][this.selectedPiece];
            }

            return this.$utils.zeros(8, 8);
        },
        combinedPieceLocs: function () {
            const combined = {};

            for (const color of ['black', 'white']) {
                combined[color] = {};

                for (const piece of Array.from(Array(8).keys())) {
                    if (this.hasPieceLocs) {
                        const whiteWin = this.pieceLocs['1-0'][color][piece];
                        const blackWin = this.pieceLocs['0-1'][color][piece];
                        const draw = this.pieceLocs['1/2-1/2'][color][piece];

                        combined[color][piece] = this.$utils.sumArrays(draw,
                            this.$utils.sumArrays(whiteWin, blackWin));
                    } else {
                        combined[color][piece] = this.$utils.zeros(8, 8);
                    }
                }
            }

            return combined;
        },
    },
    data: function () {
        const startColor = Color(variables.accent1).alpha(0.0);
        const endColor = Color(variables.accent1).alpha(0.5);
        return {
            piecesUpper: ['rook-black', 'knight-black', 'bishop-black', 'queen-black', 'king-black', 'bishop-black', 'knight-black', 'rook-black'],
            piecesLower: ['rook-white', 'knight-white', 'bishop-white', 'queen-white', 'king-white', 'bishop-white', 'knight-white', 'rook-white'],
            pieceLocs: {},
            highlightColormap: interpolate([startColor.string(), endColor.string()]),
            selectedColor: '',
            selectedPiece: -1,
        };
    },
    mounted() {
        this.boardChange();
    },
};
</script>

<style lang="scss">
body {
    background-color: $primary;
}
#app {
    font-family: 'Roboto', Sans-Serif;
    font-weight: 600;
    display: inline-block;
}
#upperBank {
    margin-bottom: 15px;
}
#editor {
    transform: translate(20px, 116px);
}
</style>
