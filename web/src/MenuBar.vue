<template>
<div>
    <span>Pawn Structure Explorer</span>
    <button @click="aboutClicked">
        ABOUT
    </button>
</div>
</template>

<script>
export default {
    methods: {
        aboutClicked() { alert('about'); },
    },
};
</script>

<style lang="scss">
#MenuBar {
    font-size: 18px;
}
#MenuBar span {
    padding-right: 13px;
    // border-right: 1px solid $secondary;
}
#MenuBar button {
    background-color: rgba(0, 0, 0, 0);
    text-align: right;
    font-size: 14px;
    color: $text-tertiary;
    border: 0px;
    line-height: 22px;
    transition: ease 0.3s;

    margin-left: 6px;
}
#MenuBar button:hover {
    background-color: scale-color($primary, $lightness: 5%);
}
</style>
