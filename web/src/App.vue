<template>
    <div id="app">
        <Board ref="board" :highlights="highlights" :free="true"/>
        <Editor :keyPrefix="'editor'" id="editor"/>
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
            pieces: ['pawn-black', 'pawn-white'],
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
#app {
    font-family: 'Roboto', Sans-Serif;
    font-weight: 600;
    text-align: left;
    display: inline;
}
body {
    background-color: $primary;
}
#editor {
    transform: translate(20px, 116px);
}
</style>
