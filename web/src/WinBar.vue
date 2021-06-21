<template>
<div class="win-bar" :class="{ vis: visible }">
    <div>{{ leftText }}</div>
    <div class="win-bar-grad"> </div>
    <div>{{ rightText }}</div>
</div>
</template>

<script>
export default {
    props: ['whiteWinFirst', 'visible'],
    computed: {
        leftText: function () {
            return this.whiteWinFirst ? '1 ⁠– 0' : '0 ⁠– 1';
        },
        rightText: function () {
            return this.whiteWinFirst ? '0 ⁠– 1' : '1 ⁠– 0';
        },
    },
};
</script>

<style lang="scss">
.win-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    margin-bottom: 7px;
    margin-top: 7px;
}
.win-bar.vis {
    visibility: visible;
    opacity: 1;
    transition: opacity 1s linear;
}
.win-bar:not(.vis) {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s 1s, opacity 1s linear;
}
.win-bar div {
    float: left;
}
.win-bar-grad {
    background-image: linear-gradient(to right, $accent3, $accent1, $accent2);
    width: 200px;
    height: 4px;
    margin: 5px 10px 5px 10px;
}
</style>
