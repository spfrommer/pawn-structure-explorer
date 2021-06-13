<template>
    <Board ref="board"/>
</template>


<script>
import Board from './Board.vue';

export default {
    name: 'App',
    components: {
        Board
    },
    data: function() {
        return {
            highlights: {
                color: 0x555555,
                intensities: this.$utils.zeros(8, 8)
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
