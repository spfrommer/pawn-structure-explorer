<template>
    <div id="app">
        <SpareBank ref="upperBank" :id="'upperBank'" :vertical="false" :selectable="true" :pieces="piecesUpper" @spareClick="upperBankClick"/>
        <div id="boardEditor">
            <Board ref="board" :highlights="{colormap: highlightColormap, intensities: highlightIntensities}" :free="true" @boardChange="boardChange"/>
            <Editor :id="'editor'"/>
        </div>
        <SpareBank ref="lowerBank" :id="'lowerBank'" :vertical="false" :selectable="true" :pieces="piecesLower" @spareClick="lowerBankClick"/>
    </div>
</template>


<script>
const interpolate = require('color-interpolate');
const Color = require('color');

import Board from './Board.vue';
import Editor from './Editor.vue';
import SpareBank from './SpareBank.vue';
import variables from './styles/_variables.scss';

export default {
    name: 'App',
    components: {
        Board,
        SpareBank,
        Editor
    },
    methods: {
        upperBankClick(event, i) {
            this.$refs.lowerBank.clearSelection();
            let unselect = this.selectedColor === 'black' && this.selectedPiece === i;
            this.selectedColor = unselect ? '' : 'black';
            this.selectedPiece = unselect ? -1 : i;
        },
        lowerBankClick(event, i) {
            this.$refs.upperBank.clearSelection();
            let unselect = this.selectedColor === 'white' && this.selectedPiece === i;
            this.selectedColor = unselect ? '' : 'white';
            this.selectedPiece = unselect ? -1 : i;
        },
        boardChange() {
            let self = this;

            let endpoint = `/api/pieceLocs?pawnfen=${this.$refs.board.pawnFen()}`;
            this.$http.get(endpoint).then(response => {
                response = JSON.parse(response.bodyText);
                this.pieceLocs = (response === null) ? {} : response;
            }, err => { console.error(err); });
        }
    },
    computed: {
        highlightIntensities: function() {
            if (Object.keys(this.pieceLocs).length === 0) {
                return this.$utils.zeros(8, 8);
            }
            if (this.selectedColor !== '' && this.selectedPiece !== -1) {
                return this.pieceLocs[this.selectedColor][this.selectedPiece];
            }

            return this.$utils.zeros(8, 8);
            /*
            console.log(this.pieceLocs);
            console.log("getting ints");
            return this.$utils.random(8, 8);
            */
        }
    },
    data: function() {
        return {
            piecesUpper: ['rook-black', 'knight-black', 'bishop-black', 'queen-black', 'king-black', 'bishop-black', 'knight-black', 'rook-black'],
            piecesLower: ['rook-white', 'knight-white', 'bishop-white', 'queen-white', 'king-white', 'bishop-white', 'knight-white', 'rook-white'],
            pieceLocs: {},
            highlightColormap: interpolate([Color(variables.accent1).alpha(0.0).string(), Color(variables.accent1).alpha(0.5).string()]),
            selectedColor: '',
            selectedPiece: -1
        }
    },
    mounted() {
        this.boardChange();
    }
}
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
