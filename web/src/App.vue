<template>
    <div id="app">
        <SpareBank :id="'upperBank'" :vertical="false" :selectable="true" :pieces="piecesUpper"/>
        <div id="boardEditor">
            <Board ref="board" :highlights="highlights" :free="true"/>
            <Editor :id="'editor'"/>
        </div>
        <SpareBank :id="'lowerBank'" :vertical="false" :selectable="true" :pieces="piecesLower"/>
    </div>
</template>


<script>
const interpolate = require('color-interpolate');

import Board from './Board.vue';
import Editor from './Editor.vue';
import SpareBank from './SpareBank.vue';

export default {
    name: 'App',
    components: {
        Board,
        SpareBank,
        Editor
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
                colormap: interpolate(['rgba(222, 0, 255, 0.0)', 'rgba(222, 0, 255, 0.3)']),
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
