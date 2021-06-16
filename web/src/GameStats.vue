<template>
<div class="game-stats">
    {{ gameCount }} Games
    <br>
    {{ percentWhite }}% / {{ percentDraw }}% / {{ percentBlack }}%
</div>
</template>

<script>
export default {
    /*
        games: games for the current structure, as returned by the server
    */
    props: ['games'],
    computed: {
        hasGames: function () {
            return Object.keys(this.games).length !== 0;
        },
        gameCount: function () {
            if (!this.hasGames) return 0;
            return this.games['1-0'].gameCount
                 + this.games['1/2-1/2'].gameCount
                 + this.games['0-1'].gameCount;
        },
        percentWhite: function () {
            if (this.gameCount === 0) return '-';
            return Math.round(100 * (this.games['1-0'].gameCount / this.gameCount));
        },
        percentDraw: function () {
            if (this.gameCount === 0) return '-';
            return Math.round(100 * (this.games['1/2-1/2'].gameCount / this.gameCount));
        },
        percentBlack: function () {
            if (this.gameCount === 0) return '-';
            return Math.round(100 * (this.games['0-1'].gameCount / this.gameCount));
        },
    },
};
</script>

<style lang="scss">
.game-stats {
    color: $text-secondary;
    text-align: right
}
</style>
