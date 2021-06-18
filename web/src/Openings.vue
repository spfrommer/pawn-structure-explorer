<template>
<div>
    <vue-slider v-model="value" v-bind="sliderOptions"/>

    <div v-for="(game, index) in selectedGames['1-0']" :key = "game.gameId">
    <p class="main"> {{ processMain(game.main) }} </p>
    <p class="variation"> {{ processVariation(game.variation) }} </p>
    <GameSnapshot
        :structure="games._id"
        :pgn="selectedPgns['1-0'][index]"
        :flipped="flipped"
        class="snapshot" />
    </div>
    <!--
    <GameSnapshot v-for="(game, index) in selectedGames['1/2-1/2']"
        :key = "game.gameId"
        :structure="games._id"
        :pgn="selectedPgns['1/2-1/2'][index]"
        :flipped="flipped"
        class="snapshot" />

    <GameSnapshot v-for="(game, index) in selectedGames['0-1']"
        :key = "game.gameId"
        :structure="games._id"
        :pgn="selectedPgns['0-1'][index]"
        :flipped="flipped"
        class="snapshot" />
        -->
</div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';
import GameSnapshot from './GameSnapshot.vue';

import variables from './styles/_variables.scss';

export default {
    props: ['games', 'flipped'],
    components: { GameSnapshot, VueSlider },
    data: function () {
        return {
            value: 'white',
            sliderOptions: {
                width: 90,
                dotSize: 14,
                data: ['white', 'draw', 'black'],
                dotOptions: {
                    tooltip: 'none',
                    focusStyle: 'none',
                },
                marks: val => {
                    const style = {
                        'box-shadow': '0 0 0 0px ' + variables.textSecondary,
                        // 'box-shadow': 'none',
                        width: '12px',
                        height: '12px',
                        transform: 'translate(-4px, -4px)',
                    };
                    const color = {
                        white: variables.textPrimary,
                        draw: variables.textSecondary,
                        black: '#333',
                    };
                    style.backgroundColor = color[val];
                    return { style: style };
                },
                'hide-label': true,
                railStyle: { 'background-color': '#656565' },
                absorb: true,
            },
        };
    },
    methods: {
        processMain(main) {
            if (main != null) {
                return this.$utils.truncate(main, 20);
            }
            return main;
        },
        processVariation(variation) {
            if (variation != null) {
                return this.$utils.truncate(variation.split(',')[0], 30);
            }
            return variation;
        },
        commonOpenings(result, n) {
            if (!this.hasGames) return [];

            const openings = this.games[result].openings;
            const sortable = [];
            for (const main of Object.keys(openings)) {
                for (const variation of Object.keys(openings[main])) {
                    sortable.push([main, variation, openings[main][variation].length]);
                }
            }

            sortable.sort((a, b) => b[2] - a[2]);

            return sortable.slice(0, n).map(l => l.slice(0, 2));
        },
        selectGames(result, openings, n) {
            // openings is a list of ['main', 'variation'] tuples
            // Returns list of { 'gameId': str, 'main': str, 'variation': str }
            const gameIds = [];
            let counter = 0;
            while (gameIds.length < n) {
                const newIds = [];
                for (const opening of openings) {
                    const [main, variation] = opening;
                    const openingIds = this.games[result].openings[main][variation];
                    if (openingIds.length > counter) {
                        newIds.push({
                            gameId: openingIds[counter],
                            main: main,
                            variation: variation,
                        });
                    }
                }

                if (newIds.length === 0) return gameIds;

                gameIds.push(...newIds.slice(0, n - gameIds.length));
                counter++;
            }

            return gameIds;
        },
    },
    computed: {
        hasGames: function () {
            return Object.keys(this.games).length !== 0;
        },
        whiteOpenings: function () {
            if (!this.hasGames) return 0;
            return Object.keys(this.games['1-0'].openings);
        },
        whiteWinOpenings: function () {
            return this.getCommonOpenings('1-0', 3);
        },
        selectedGames: function () {
            const nSel = 3;
            const select = res => this.selectGames(res, this.commonOpenings(res, nSel), nSel);
            return { '1-0': select('1-0'), '1/2-1/2': select('1/2-1/2'), '0-1': select('0-1') };
        },
    },
    asyncComputed: {
        selectedPgns: function () {
            const promises = [];
            for (const result of ['1-0', '1/2-1/2', '0-1']) {
                for (const selectedGame of this.selectedGames[result]) {
                    const pgnEndpoint = `/api/gamePgn?gameId=${selectedGame.gameId}`;
                    promises.push(this.$http.get(pgnEndpoint).then(response => {
                        const responseJson = JSON.parse(response.bodyText).pgn;
                        return (responseJson === null) ? {} : responseJson;
                    }, err => { console.error(err); }));
                }
            }
            return Promise.all(promises).then(pgns => {
                const resultPgns = {};

                let i = 0;
                for (const result of ['1-0', '1/2-1/2', '0-1']) {
                    resultPgns[result] = pgns.splice(i, i + this.selectedGames[result].length);
                    i += this.selectedGames[result].length;
                }

                return resultPgns;
            });
        },
    },
};
</script>

<style lang="scss">
#Openings square.last-move {
    background-color: scale-color($accent1, $alpha: -70%);
}
#Openings p.main {
    font-size: 10px;
    font-family: Arial;
    color: $text-primary;
    margin: -8px 0px 0px 0px;
}
#Openings p.variation {
    font-size: 8px;
    font-family: Arial;
    color: $text-secondary;
    margin: 0px 0px 5px 0px;
}

#Openings .vue-slider {
    position: relative;
    margin-top: -30px;
    margin-bottom: 15px;
    margin-left: 13px;
}
#Openings .vue-slider-process {
    background-color: #656565;
}
#Openings .vue-slider-dot-handle {
    background-color: rgba(0, 0, 0, 0);
    border-color: $accent1;
    transition: none;
}
</style>
