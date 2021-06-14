<template>
    <div id="app">
        <SpareBank ref="upperBank" :id="'upperBank'" :vertical="false" :selectable="true" :pieces="piecesUpper" @spareClick="upperBankClick"/>
        <div id="boardEditor">
            <Board ref="board" :highlights="highlights" :free="true"/>
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
        upperBankClick(i) {
            this.highlights.intensities = this.$utils.random(8, 8);
            this.$refs.lowerBank.clearSelection();
        },
        lowerBankClick(i) {
            this.highlights.intensities = this.$utils.random(8, 8);
            this.$refs.upperBank.clearSelection();
        }
    },
    data: function() {
        return {
            piecesUpper: ['rook-black', 'knight-black', 'bishop-black', 'queen-black', 'king-black', 'bishop-black', 'knight-black', 'rook-black'],
            piecesLower: ['rook-white', 'knight-white', 'bishop-white', 'queen-white', 'king-white', 'bishop-white', 'knight-white', 'rook-white'],
            highlights: {
                // colormap: interpolate(['rgba(2,0,36,0.0)', 'rgba(193,103,255,0.0)', 'rgba(0,212,255,0.0)']),
                // colormap: interpolate(['rgba(193,103,255,0.2)', 'rgba(0,212,255,0.2)']),
                // colormap: interpolate(['rgba(0, 255, 254, 0.2)', 'rgba(222, 0, 255, 0.2)']),
                // colormap: interpolate(['rgba(0, 255, 254, 0.0)', 'rgba(0, 255, 254, 0.3)']),
                colormap: interpolate([Color(variables.accent1).alpha(0.0).string(), Color(variables.accent1).alpha(0.5).string()]),
                intensities: this.$utils.random(8, 8)
            }
        }
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
