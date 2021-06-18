<template>
<div class="game-stats">
    White wins
    <!--
    <GameSnapshot class="snapshot"
        :structure="this.games._id"
        :pgn="testPgn"
        :flipped="boardFlipped"/>
        -->

    {{ selectedGames }}

    <br>
    {{ selectedPgns }}
    <br>
    Black wins
</div>
</template>

<script>
export default {
    // games: games for the current structure, as returned by the server
    props: ['games'],
    watch: {
        games: function (newGames) {
            if ('0-1' in newGames) {
                const self = this;

                const id = newGames['0-1'].openings['Alekhine Defense']['Two Pawn Attack'][0];
                const pgnEndpoint = `/api/gamePgn?gameId=${id}`;
                this.$http.get(pgnEndpoint).then(response => {
                    const responseJson = JSON.parse(response.bodyText).pgn;
                    self.testPgn = (responseJson === null) ? {} : responseJson;
                }, err => { console.error(err); });
            }
        },
    },
    methods: {
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
            for (const result of ['1-0', '1/2-1/2', '0-1']) {
                console.log(result);
                console.log(this.selectedGames[result]);
            }
            return Promise.resolve(1);
            /*
            const id = newGames['0-1'].openings['Alekhine Defense']['Two Pawn Attack'][0];
            const pgnEndpoint = `/api/gamePgn?gameId=${id}`;
            this.$http.get(pgnEndpoint).then(response => {
                const responseJson = JSON.parse(response.bodyText).pgn;
                self.testPgn = (responseJson === null) ? {} : responseJson;
            }, err => { console.error(err); });
            */
        },
    },
};
</script>

<style lang="scss">
.game-stats {
    color: $text-secondary
}
</style>
