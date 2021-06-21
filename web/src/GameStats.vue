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
            if (!this.hasGames) { console.log('*****'); console.log(this.games); return 0; }
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
            const openings = this.games[result].openings;
            let games = 0;
            for (const main of Object.keys(openings)) {
                for (const variation of Object.keys(openings[main])) {
                    const length = openings[main][variation].length;
                    console.assert(length !== 0);
                    console.assert(!Number.isNaN(length));
                    games += length;
                }
            }
            return games;
            // return this.games[result].gameCount;
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
