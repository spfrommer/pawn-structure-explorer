<template>
<div>
    <button @click="flipClicked">
        FLIP
    </button>
    <br>
    <button @click="resetClicked">
        RESET
    </button>
</div>
</template>

<script>
export default {
    methods: {
        flipClicked() { this.$emit('flip'); },
        resetClicked() { this.$emit('reset'); },
    },
};
</script>

<style lang="scss">
#Controls button {
    background-color: rgba(0, 0, 0, 0);
    text-align: right;
    color: $text-tertiary;
    border: 0px;
}
</style>
