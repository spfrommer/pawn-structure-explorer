<template>
<div class="controls">
    <button @click="flipClicked">
        FLIP
    </button>
</div>
</template>

<script>
export default {
    methods: {
        flipClicked() { this.$emit('flip'); },
    },
};
</script>

<style lang="scss">
.game-stats {
    color: $text-secondary;
    text-align: right
}
</style>
