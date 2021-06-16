<template>
    <div id="app">
        <SpareBank ref="upperBank" :id="'upperBank'"
            :vertical="false"
            :selectable="true"
            :pieces="piecesUpper"
            @spareClick="upperBankClick"/>
        <div id="boardEditor">
            <GameStats id="stats" :games="games"/>
            <Editor :id="'editor'"/>
            <Board ref="board"
                :highlights="highlights"
                :free="true"
                @boardChange="boardChange"/>
            <Openings id="openings" :games="games"/>
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
import GameStats from './GameStats.vue';
import Openings from './Openings.vue';

import variables from './styles/_variables.scss';

const interpolate = require('color-interpolate');
const Color = require('color');

export default {
    name: 'App',
    components: {
        Board,
        Editor,
        SpareBank,
        GameStats,
        Openings,
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
            const pieceLocsEndpoint = `/api/pieceLocs?structure=${this.$refs.board.structure()}`;
            this.$http.get(pieceLocsEndpoint).then(response => {
                const responseJson = JSON.parse(response.bodyText);
                this.pieceLocs = (responseJson === null) ? {} : responseJson;
            }, err => { console.error(err); });

            const gamesEndpoint = `/api/games?structure=${this.$refs.board.structure()}`;
            this.$http.get(gamesEndpoint).then(response => {
                const responseJson = JSON.parse(response.bodyText);
                this.games = (responseJson === null) ? {} : responseJson;
                console.log(this.games);
            }, err => { console.error(err); });
        },
        combinePieceLocs(color, piece, weighResult) {
            if (!this.hasPieceLocs) {
                return this.$utils.zeros(8, 8);
            }

            const isWhite = color === 'white';
            let wWin = this.pieceLocs['1-0'][color][piece];
            let bWin = this.pieceLocs['0-1'][color][piece];
            let draw = this.pieceLocs['1/2-1/2'][color][piece];

            if (weighResult) {
                wWin = this.$utils.scalarMultiplyArray(isWhite ? 1 : -1, wWin);
                bWin = this.$utils.scalarMultiplyArray(isWhite ? -1 : 1, bWin);
                draw = this.$utils.scalarMultiplyArray(0, draw);
            }

            return [wWin, bWin, draw].reduce(this.$utils.sumArrays);
        },
    },
    computed: {
        hasPieceLocs: function () {
            return Object.keys(this.pieceLocs).length !== 0;
        },
        highlights: function () {
            return {
                colormap: this.highlightColormap,
                hues: this.highlightHues,
                intensities: this.highlightIntensities,
            };
        },
        highlightHues: function () {
            if (this.hasPieceLocs && this.selectedColor !== '' && this.selectedPiece !== -1) {
                return this.combinePieceLocs(this.selectedColor, this.selectedPiece, true);
            }

            return this.$utils.zeros(8, 8);
        },
        highlightIntensities: function () {
            if (this.hasPieceLocs && this.selectedColor !== '' && this.selectedPiece !== -1) {
                return this.combinePieceLocs(this.selectedColor, this.selectedPiece, false);
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
            games: {},

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
    color: $text-primary;
    display: inline-block;
    position: absolute;
    transform: translate(100px, 40px);
}
#upperBank {
    margin-bottom: 15px;
}
#editor {
    position: absolute;
    transform: translate(-55px, 116px);
}
#stats {
    position: absolute;
    right: 340px;
    width: 200px;
}
#openings {
    position: absolute;
    transform: translate(340px, 116px);
    text-align: left;
}
</style>
