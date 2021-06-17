<template>
<div class="game-stats">
    White wins
    {{ whiteOpenings }}
    <br>
    Black wins
</div>
</template>

<script>
export default {
    // games: games for the current structure, as returned by the server
    props: ['games'],
    computed: {
        hasGames: function () {
            return Object.keys(this.games).length !== 0;
        },
        whiteOpenings: function () {
            if (!this.hasGames) return 0;
            return Object.keys(this.games['1-0'].openings);
        },
    },
};
</script>

<style lang="scss">
.game-stats {
    color: $text-secondary
}
</style>
