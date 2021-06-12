<template>
    <div id="app">
        <!-- <router-view :key="$route.path"></router-view> -->
        <SearchBar @search="searchEvent" @setquery="setQueryEvent" :startQuery="currentQuery"/>
        <p id="spacer"></p>
        <div style="width: 100%; overflow: hidden;">
            <div style="width: 1000px; float: left;">
                <div v-if="fetchTime != null" class="info">
                    Took  {{fetchTime}} seconds to get {{numResults}} results
                </div>
                <Result v-for="result in results" :key="result.url" :result="result"/>

                <v-pagination
                    v-model="currentPage"
                    :page-count="pageCount"
                    :labels="paginationAnchorTexts"
                    @input="pageInputEvent"
                ></v-pagination>
            </div>
            <div style="margin-left: 1020px; width: 600px;">
            <WikiPreview :wikiData="wikiData" v-if="wikiData != null"/>
            </div>
        </div>
    </div>
</template>


<script>
import Result from './Result.vue';
import SearchBar from './SearchBar.vue';
import WikiPreview from './WikiPreview.vue';
import vPagination from 'vue-plain-pagination'
import axios from 'axios';

export default {
    name: 'App',
    components: {
        Result,
        SearchBar,
        WikiPreview,
        vPagination 
    },
    data: function() {
        return {
            results: [],
            fetchTime: null,
            numResults: 0,
            wikiData: null,

            currentQuery: "",
            currentPage: 1,
            pageCount: 10,
            paginationAnchorTexts: {
                first: '',
                prev: '&lsaquo;',
                next: '&rsaquo;',
                last: ''
            } 
        }
    },
    methods: {
        searchEvent: function(searchQuery) {
            this.results = [];
            this.$router.push({ path: 'search', query: { query: searchQuery, page: 1 }}).catch(
                () => { this.loadResults(); });
        },
        setQueryEvent: function(query) {
            this.currentQuery = query;
        },
        pageInputEvent: function(page) {
            this.$router.push({ path: 'search', query: { query: this.currentQuery, page: page }});
        },
        processQuery: function(vQueryDict) {
            if (vQueryDict.query) {
                this.currentQuery = vQueryDict.query;
                console.log('Set current query: ' + this.currentQuery);
                if (vQueryDict.page) {
                    this.currentPage = parseInt(vQueryDict.page);
                }
                this.loadResults();
            }
        },
        loadResults: function() {
            let encoded = encodeURIComponent(this.currentQuery);
            let endpoint = `/api/search?query=${encoded}&page=${this.currentPage}`;
            console.log(endpoint);
            this.$http.get(endpoint).then(response => {
                response = JSON.parse(response.bodyText);
                console.log(response);
                
                // let results_unique = response.results;
                let results_unique = response.results.reduceRight(function (r, a) {
                    r.some(function (b) { return a.url === b.url || a.title == b.title; }) || r.push(a);
                    return r;
                }, []); 


                results_unique.reverse();
                this.results = results_unique;
                this.numResults = response.total
                this.fetchTime = response.dt / 1000
                this.pageCount = response.pageCount;
                this.wikiData = null;
                window.scrollTo(0, 0);
                // for (var i = this.results.length - 1; i >= 0; i --) {
                for (var i = 0; i < Math.min(this.results.length, 5); i++) {
                    var result = this.results[i];
                    console.log(result.title);
                    if (result.preview) {
                        this.wikiData = result;
                        return;
                    }
                }
            }, response => { console.log(response); });
        }
    },
    beforeRouteUpdate: function(to, from, next) {
        this.processQuery(to.query);
        next();
    },
    created: function() {
        this.processQuery(this.$route.query);
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
