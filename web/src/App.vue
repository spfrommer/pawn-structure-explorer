<template>
    <div id="app">
        <SpareBank ref="upperBank" :id="'upperBank'"
            :vertical="false"
            :selectable="true"
            :pieces="piecesUpper"
            @spareClick="upperBankClick"/>
        <div id="boardEditor">
            <Board ref="board"
                :highlights="highlights"
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
        combinePieceLocs: function (weighResult) {
            const combined = {};

            for (const color of ['black', 'white']) {
                combined[color] = {};

                const isWhite = color === 'white';
                for (const piece of Array.from(Array(8).keys())) {
                    if (this.hasPieceLocs) {
                        let wWin = this.pieceLocs['1-0'][color][piece];
                        let bWin = this.pieceLocs['0-1'][color][piece];
                        let draw = this.pieceLocs['1/2-1/2'][color][piece];

                        if (weighResult) {
                            wWin = this.$utils.scalarMultiplyArray(isWhite ? 1 : -1, wWin);
                            bWin = this.$utils.scalarMultiplyArray(isWhite ? -1 : 1, bWin);
                            draw = this.$utils.scalarMultiplyArray(0, draw);
                        }

                        combined[color][piece] = [wWin, bWin, draw].reduce(this.$utils.sumArrays);
                    } else {
                        combined[color][piece] = this.$utils.zeros(8, 8);
                    }
                }
            }

            return combined;
        },
    },
    computed: {
        hasPieceLocs: function () {
            return Object.keys(this.pieceLocs).length !== 0;
        },
        highlights: function () {
            console.log(this.pieceLocs);
            return {
                colormap: this.highlightColormap,
                hues: this.highlightHues,
                intensities: this.highlightIntensities,
            };
        },
        highlightHues: function () {
            if (this.hasPieceLocs && this.selectedColor !== '' && this.selectedPiece !== -1) {
                return this.combinePieceLocs(true)[this.selectedColor][this.selectedPiece];
            }

            return this.$utils.zeros(8, 8);
        },
        highlightIntensities: function () {
            if (this.hasPieceLocs && this.selectedColor !== '' && this.selectedPiece !== -1) {
                return this.combinePieceLocs(false)[this.selectedColor][this.selectedPiece];
            }

            return this.$utils.zeros(8, 8);
        },
    },
    data: function () {
        const startColor = Color(variables.accent3).string();
        const midColor = Color(variables.accent1).string();
        const endColor = Color(variables.accent2).string();
        return {
            piecesUpper: ['rook-black', 'knight-black', 'bishop-black', 'queen-black', 'king-black', 'bishop-black', 'knight-black', 'rook-black'],
            piecesLower: ['rook-white', 'knight-white', 'bishop-white', 'queen-white', 'king-white', 'bishop-white', 'knight-white', 'rook-white'],
            pieceLocs: {},
            highlightColormap: interpolate([startColor, midColor, endColor]),
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
