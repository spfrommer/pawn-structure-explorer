<template>
    <div id="app">
        <Board ref="board" :highlights="highlights" :free="true" @click.native="boardClick"/>
        <button @click="onClick">Click Here</button>
    </div>
</template>


<script>
const interpolate = require('color-interpolate');

import Board from './Board.vue';

export default {
    name: 'App',
    components: {
        Board
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
    },
    methods: {
        onClick: function() {
            this.highlights.intensities = this.$utils.random(8, 8);
        },
        boardClick: function(event) {
            console.log('Board clicked!');
            console.log(event);
        }
    },
    mounted: function() {
        // this.$refs.board.board.dragNewPiece({role: 'king', color: 'white', promotoed: false});
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
