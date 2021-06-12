<template>
<div class="preview">
    <a :href="wikiData.url">{{ truncatedTitle }}</a>
    <p>{{ truncatedPreview }}</p>
    <h3>Wikipedia</h3>
</div>
</template>

<script>
export default {
    props: ['wikiData'],
    computed: {
        truncatedTitle: function() {
            console.log(this.wikiData);
            var title = this.wikiData.title ? this.wikiData.title : "";
            title = title.replace(' - Wikipedia', '');
            title = this.$utils.truncate(title, 30);
            return title;
        },
        truncatedPreview: function() {
            return this.wikiData.preview ? this.$utils.truncate(this.wikiData.preview.preview, 800) : "";
        }
    }
}
</script>

<style>
.preview {
    border: 2px solid var(--off-white);
    border-radius: 8px;
    margin-top: 30px;
}
.preview a {
    color: var(--text-main);
    font-size: 35px;
    text-decoration: none;
    
    display: inline-block;
    margin-top: 20px;
    margin-bottom: 4px;
    padding: 10px 20px 0px 20px;
}
.preview p {
    color: var(--text-main);
    font-size: 22px;
    text-decoration: none;
    text-align: justify;

    padding: 0 20px 0px 20px;
}
.preview h3 {
    color: var(--text-third);

    font-size: 14px;

    padding: 0 20px 20px 20px;
}
</style>
