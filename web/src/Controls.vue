<template>
<div class="controls">
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
.controls {
    color: $text-secondary;
    text-align: right;
}
button {
    background-color: rgba(0, 0, 0, 0);
    color: $text-secondary;
    border: 0px;
}
</style>
