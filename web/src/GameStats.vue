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
            let count = this.count('1-0') + this.count('1/2-1/2') + this.count('0-1');
            // eslint-disable-next-line no-underscore-dangle
            if (count === 326502 && this.games._id === '8/pppppppp/8/8/8/8/PPPPPPPP/8') {
                // Hack to fix a problem where the initial structure doesn't index past one file
                count = 581502;
            }
            return count;
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
                    const count = openings[main][variation].count;
                    console.assert(count !== 0);
                    console.assert(!Number.isNaN(count));
                    games += count;
                }
            }
            return games;
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
