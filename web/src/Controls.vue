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
#Controls {
    color: $text-secondary;
    text-align: right;
}
#Controls button {
    background-color: rgba(0, 0, 0, 0);
    color: $text-secondary;
    border: 0px;
}
</style>
