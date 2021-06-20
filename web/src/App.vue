<template>
    <div id="App">
        <SpareBank ref="UpperBank" :id="'UpperBank'"
            :vertical="false"
            :selectable="true"
            :pieces="piecesUpper"
            @spareClick="upperBankClick"/>
        <div id="BoardEditor">
            <Board ref="board" id="Board"
                :highlights="highlights"
                :flipped="boardFlipped"
                @boardChange="boardChange" data-v-step="0"/>
            <Controls id="Controls" @flip="flipBoard" @reset="resetBoard" @tour="doTour"/>
            <GameStats id="GameStats" :games="games"/>
            <Editor :id="'Editor'" :flipped="boardFlipped" :pieces="piecesEditor" data-v-step="1"/>
            <!-- TODO: openings can't be first otherwise highlights get messed up on flip... -->
            <Openings id="Openings" :games="games" :flipped="boardFlipped" data-v-step="3"/>
        </div>
        <SpareBank ref="LowerBank" :id="'LowerBank'"
            :vertical="false"
            :selectable="true"
            :pieces="piecesLower"
            @spareClick="lowerBankClick"
            data-v-step="2"/>
        <v-tour name="appTour" :steps="tourSteps">
        </v-tour>
    </div>
</template>

<script>
import Board from './Board.vue';
import Editor from './Editor.vue';
import SpareBank from './SpareBank.vue';
import GameStats from './GameStats.vue';
import Openings from './Openings.vue';
import Controls from './Controls.vue';

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
        Controls,
    },
    methods: {
        upperBankClick(event, i) {
            this.$refs.LowerBank.clearSelection();
            this.bankClick(i, this.colorUpper);
        },
        lowerBankClick(event, i) {
            this.$refs.UpperBank.clearSelection();
            this.bankClick(i, this.colorLower);
        },
        bankClick(i, color) {
            const iFlip = this.boardFlipped ? 7 - i : i;
            const unselect = this.selectedColor === color && this.selectedPiece === iFlip;
            this.selectedColor = unselect ? '' : color;
            this.selectedPiece = unselect ? -1 : iFlip;
        },
        flipBoard() {
            this.boardFlipped = !this.boardFlipped;
        },
        resetBoard() {
            this.$refs.board.board.set({ fen: '8/pppppppp/8/8/8/8/PPPPPPPP/8 w KQkq - 0 1' });
            this.boardChange();
        },
        doTour() {
            this.$tours.appTour.start();
        },
        boardChange() {
            const pieceLocsEndpoint = `/api/pieceLocs?structure=${this.$refs.board.structure()}`;
            this.$http.get(pieceLocsEndpoint).then(response => {
                let responseJson = null;
                try {
                    responseJson = JSON.parse(response.bodyText);
                } catch { }
                this.pieceLocs = (responseJson === null) ? {} : responseJson;
            }, err => { console.error(err); });

            const gamesEndpoint = `/api/games?structure=${this.$refs.board.structure()}`;
            this.$http.get(gamesEndpoint).then(response => {
                let responseJson = null;
                try {
                    responseJson = JSON.parse(response.bodyText);
                } catch { }
                this.games = (responseJson === null) ? {} : responseJson;
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
        pieces: function () {
            const pieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
            if (this.boardFlipped) pieces.reverse();
            return pieces;
        },
        piecesUpper: function () {
            return this.pieces.map(piece => `${piece}-${this.colorUpper}`);
        },
        piecesLower: function () {
            return this.pieces.map(piece => `${piece}-${this.colorLower}`);
        },
        colorUpper: function () {
            return this.boardFlipped ? 'white' : 'black';
        },
        colorLower: function () {
            return this.boardFlipped ? 'black' : 'white';
        },
        piecesEditor: function () {
            const pieces = ['pawn-black', 'pawn-white'];
            if (this.boardFlipped) pieces.reverse();
            return pieces;
        },
    },
    data: function () {
        const startColor = Color(variables.accent3).string();
        const midColor = Color(variables.accent1).string();
        const endColor = Color(variables.accent2).string();

        return {
            boardFlipped: false,

            pieceLocs: {},
            games: {},

            highlightColormap: interpolate([startColor, midColor, endColor]),
            selectedColor: '',
            selectedPiece: -1,

            tourSteps: [
                {
                    target: '[data-v-step="0"]',
                    content: 'Move around pawns to adjust the pawn structure. No pieces allowed!',
                    params: {
                        placement: 'bottom',
                    },
                },
                {
                    target: '[data-v-step="1"]',
                    params: {
                        placement: 'right',
                    },
                    content: 'Drag new pawns to the board from here.',
                },
                {
                    target: '[data-v-step="2"]',
                    content: `Click on a piece too see placement likelihoods (transparency)
                    and outcome likelihoods <br>
                    (<span class="red-text">red → loss</span>,
                    <span class="blue-text">blue → draw</span>, 
                    <span class="green-text">green → win</span>)<br> 
                    from positions with this pawn structure.`,
                    params: {
                        placement: 'top',
                    },
                },
                {
                    target: '[data-v-step="3"]',
                    content: `See games with this pawn structure, grouped by result.
                    The last previous game move is highlighted. Click to open game.`,
                    params: {
                        placement: 'left',
                    },
                },
            ],
        };
    },
    mounted: function () {
        this.boardChange();
    },
};
</script>

<style lang="scss">
body {
    background-color: $primary;
}
#app {
    display: flex;
    align-items: center;
    justify-content: center;
}
#App {
    font-size: 13.33px;
    font-family: Arial;

    color: $text-primary;
    transform: translate(-40px, 60px);
}
#App .v-step .blue-text {
    color: $accent1;
}
#App .v-step .green-text {
    color: $accent2;
}
#App .v-step .red-text {
    color: $accent3;
}
#App .v-step {
    background: scale-color($primary, $alpha: -25%);
    border-radius: 3px;
}
#App .v-step__content {
    color: $text-primary;
}
#App .v-step__button {
    color: $text-primary;
    border-radius: 3px;
}
#App .v-step__button:hover {
    background: $secondary;
}
#App .v-step__arrow {
    background: scale-color($primary, $lightness: 60%);
}

#UpperBank {
    margin-bottom: 10px;
}
#BoardEditor {
    position: relative;
    top: 0px;
    left: 0px;
}
#Editor {
    position: absolute;
    transform: translate(-370px, 118px);
}
#GameStats {
    position: absolute;
    text-align: right;
    right: 330px;
    width: 200px;
}
#Controls {
    position: absolute;
    text-align: right;
    right: 324px;
    top: 252px;
    width: 200px;
}
#Openings {
    position: absolute;
    transform: translate(340px, -51px);
    text-align: left;
}
</style>
