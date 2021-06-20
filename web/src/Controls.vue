<template>
<div>
    <button @click="tourClicked">
        &#x1C04; TOUR
    </button>
    <br>
    <button @click="flipClicked">
        &#128472; FLIP
    </button>
    <br>
    <button @click="resetClicked">
        &#128465; RESET
    </button>
</div>
</template>

<script>
export default {
    methods: {
        flipClicked() { this.$emit('flip'); },
        resetClicked() { this.$emit('reset'); },
        tourClicked() { this.$emit('tour'); },
    },
};
</script>

<style lang="scss">
#Controls button {
    background-color: rgba(0, 0, 0, 0);
    text-align: right;
    color: $text-tertiary;
    border: 0px;
    width: 80px;
    line-height: 22px;
    transition: ease 0.3s;
}
#Controls button:hover {
    background-color: scale-color($primary, $lightness: 5%);
}
</style>
