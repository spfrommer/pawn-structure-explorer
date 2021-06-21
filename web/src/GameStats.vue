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
            try {
                const percents = percentRound([this.count('1-0'), this.count('1/2-1/2'), this.count('0-1')]);
                return percents.map(p => p + '%').join(' / ');
            } catch (err) {
                console.log('got percents error');
                console.log(this.games);
                return 'foo';
            }
        },
    },
    methods: {
        count: function (result) {
            const openings = this.games[result].openings;
            let games = 0;
            for (const main of Object.keys(openings)) {
                for (const variation of Object.keys(openings[main])) {
                    games += openings[main][variation].length;
                }
            }
            if (games === 0) {
                console.log('-----------------');
                console.log(this.games);
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
