<template>
<div class="result">
    <a :href=result.url>{{ truncatedTitle }}</a>
    <h3>{{ formattedUrl }}</h3>
    <p><span v-html="result.content"></span></p>
    <p id="metadata" v-if="hasMetadata">{{ formattedMetadata }}</p>
</div>
</template>

<script>
export default {
    props: ['result'],
    computed: {
        truncatedTitle: function() {
            return this.$utils.truncate(this.result.title, 60);
        },
        formattedUrl: function() {
            return this.$utils.truncate(this.result.url, 70);
        },
        hasMetadata: function() {
            return this.result.hasOwnProperty('metadata');
        },
        formattedMetadata: function() {
            return "TF-IDF: " + this.result.metadata.tfidf.toString().substring(0, 7) + 
                   " - Pagerank: " + this.result.metadata.pagerank.toString().substring(0, 7) + 
                   " - Combined: " + this.result.metadata.totalscore.toString().substring(0, 7);
        }
    }
}
</script>

<style>
.result {
    margin-left: 120px;
}
.result a {
    color: var(--main-color);
    font-size: 25px;
    text-decoration: none;
    
    display: inline-block;
    margin: 20px 0px 0px 0px;
    padding: 0px;
}
.result h3 {
    color: var(--text-third);
    font-size: 17px;
    margin: 5px 0px 5px 0px;
}
.result p {
    color: var(--text-main);

    margin-top: 5px;
    width: 700px;
}
.result #metadata {
    color: var(--text-third);
    font-size: 14px;
}
</style>
