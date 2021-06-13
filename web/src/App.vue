<template>
    <Board ref="board" :highlights="highlights"/>
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
                colormap: interpolate(['rgba(0, 255, 254, 0.0)', 'rgba(0, 255, 254, 0.3)']),
                // colormap: interpolate(['rgba(222, 0, 255, 0.0)', 'rgba(222, 0, 255, 0.3)']),
                intensities: this.$utils.random(8, 8)
            }
        }
    },
    methods: {
    },
    mounted: function() {
        this.$refs.board.drawHighlights();
    }
}
</script>


<style>
:root {
    --main-color:#06c;
    --text-main:#222;
    --text-second:#444;
    --text-third:#aaa;
    --off-white:#efefef
}
#app {
    font-family: Helvetica, Arial, sans-serif;
    text-align: left;
}
#spacer {
    padding-top: 100px;
}

/* Pagination styling */
.pagination-item {
    list-style-type: none;
    float: left;
    margin: 0 5px;
}
.pagination-link {
    background-color: white;
    border: none;
    border-radius: 5px;
    font-size: 20px;
    padding: 5px 15px 5px 15px;
}
.pagination-link--active {
    background-color: #c4d9f5;
}

.pagination {
    width: 60%;
    margin: auto;
    margin-top: 30px;
}
.info {
    margin: 5px 0px 0px 120px;
    color: var(--text-main);
}
</style>
