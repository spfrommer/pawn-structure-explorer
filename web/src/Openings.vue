<template>
<div>
    <div id="SliderDiv">
        <vue-slider v-model="sliderValue" v-bind="sliderOptions"/>
        {{ sliderValue }}
    </div>
    <div v-for="(game, index) in selectedGames[sliderValue]" :key = "game.gameId">
        <p class="main"> {{ processMain(game.main) }} </p>
        <p class="variation"> {{ processVariation(game.variation) }} </p>
        <GameSnapshot
            :structure="games._id"
            :pgn="selectedPgnsResult[index]"
            :flipped="flipped"
            class="snapshot" />
    </div>
</div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';
import GameSnapshot from './GameSnapshot.vue';

import variables from './styles/_variables.scss';

const nSel = 3;

export default {
    props: ['games', 'flipped'],
    components: { GameSnapshot, VueSlider },
    data: function () {
        return {
            sliderValue: '1-0',
            sliderOptions: {
                width: 90,
                dotSize: 14,
                data: ['1-0', '1/2-1/2', '0-1'],
                dotOptions: {
                    tooltip: 'none',
                    focusStyle: 'none',
                },
                marks: val => {
                    const style = {
                        'box-shadow': 'none',
                        width: '12px',
                        height: '12px',
                        transform: 'translate(-4px, -4px)',
                    };
                    const color = {
                        '1-0': variables.textPrimary,
                        '1/2-1/2': variables.textSecondary,
                        '0-1': '#333',
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
        commonOpenings(result) {
            if (!this.hasGames) return [];

            const openings = this.games[result].openings;
            const sortable = [];
            for (const main of Object.keys(openings)) {
                for (const variation of Object.keys(openings[main])) {
                    sortable.push([main, variation, openings[main][variation].length]);
                }
            }

            sortable.sort((a, b) => b[2] - a[2]);

            return sortable.slice(0, nSel).map(l => l.slice(0, 2));
        },
        selectGames(result, openings) {
            // openings is a list of ['main', 'variation'] tuples
            // Returns list of { 'gameId': str, 'main': str, 'variation': str }
            const gameIds = [];
            let counter = 0;
            while (gameIds.length < nSel) {
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

                gameIds.push(...newIds.slice(0, nSel - gameIds.length));
                counter++;
            }

            return gameIds;
        },
    },
    computed: {
        hasGames: function () {
            return Object.keys(this.games).length !== 0;
        },
        selectedGames: function () {
            const select = res => this.selectGames(res, this.commonOpenings(res));
            return { '1-0': select('1-0'), '1/2-1/2': select('1/2-1/2'), '0-1': select('0-1') };
        },
        selectedPgnsResult: function () {
            const pgns = this.selectedPgns;
            if (pgns == null) return Array(nSel).fill('');
            return this.selectedPgns[this.sliderValue];
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
                    resultPgns[result] = pgns.slice(i, i + this.selectedGames[result].length);
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
#Openings #SliderDiv {
    position: relative;
    margin-top: -30px;
    margin-bottom: 15px;
    margin-left: 13px;
    display: flex;
}
#Openings #SliderDiv .vue-slider {
    margin-right: 20px;
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
