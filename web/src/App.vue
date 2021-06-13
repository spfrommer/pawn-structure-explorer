<template>
    <div id="app">
        <Board ref="board" :highlights="highlights" :free="true"/>
        <Editor/>
    </div>
</template>


<script>
const interpolate = require('color-interpolate');

import Board from './Board.vue';
import Editor from './Editor.vue';

export default {
    name: 'App',
    components: {
        Board,
        Editor
    },
    data: function() {
        return {
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
}
body {
    background-color: $primary;
}
</style>
