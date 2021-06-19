<template>
<div>
    {{ gameCount }} games
    <br>
    {{ percents }}
    <br>
    <span> white / draw / black </span>
</div>
</template>

<script>
import percentRound from 'percent-round';

export default {
    props: ['games'],
    computed: {
        hasGames: function () {
            return Object.keys(this.games).length !== 0;
        },
        gameCount: function () {
            if (!this.hasGames) return 0;
            return this.count('1-0') + this.count('1/2-1/2') + this.count('0-1');
        },
        percents: function () {
            if (!this.hasGames) return '- / - / -';
            const percents = percentRound([this.count('1-0'), this.count('1/2-1/2'), this.count('0-1')]);
            return percents.map(p => p + '%').join(' / ');
        },
    },
    methods: {
        count: function (result) {
            return this.games[result].gameCount;
        },
    },
};
</script>

<style lang="scss">
#GameStats {
    color: $text-primary;
    text-align: right
}
#GameStats span {
    color: $text-secondary;
}
</style>
