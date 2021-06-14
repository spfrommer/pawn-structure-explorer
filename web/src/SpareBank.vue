<template>
<div>
    <div class="spares">
        <div v-for="(piece, i) in pieces" :key="keyPrefix + i">
            <div :class="'spare-back ' + spareBackClass(i)">
                <button @mousedown="onMouseDown($event, i)" @click="onClick($event, i)" :class="'spare spare-' + piece"></button>
            </div> 
        </div>
    </div>
</div>
</template>

<script>
export default {
    /*
        keyPrefix: unique key for the bank
        vertical: boolean whether bank is vertical or horizontal
        pieces: list of piece strings like 'pawn-black'
    */
    props: ['keyPrefix', 'vertical', 'selectable', 'pieces'],
    data: {
        selected: -1
    },
    methods: {
        spareBackClass(i) {
            if (i == 0) {
                return this.vertical ? "spare-back-top" : "spare-back-left";
            }
            if (i == this.pieces.length - 1) {
                return this.vertical ? "spare-back-bottom" : "spare-back-right";
            }
            return "spare-back-middle";
        },
        // Default methods for calling superclass method with extends
        onClick(event, i) {
            this.onClickDefault(event, i);
        },
        onClickDefault(event, i) {
            this.$emit('spareClick', event, i);
        },
        onMouseDown(event, i) {
            this.onMouseDownDefault(event, i);
        },
        onMouseDownDefault(event, i) {
            this.$emit('spareMouseDown', event, i);
        },
    }
}
</script>

<style lang="scss">
.spares {
    background-color: $secondary;
    display: inline-block;
    border-radius: $border-radii;
    box-shadow: 0px 0px 2px $secondary-shadow inset;
}

.spare-back {
    transition: background 0.7s ease;
}
.spare-back:hover {
    background: scale-color($secondary-highlight, $alpha: -30%);
}
.spare-back-top {
    border-radius: $border-radii $border-radii 0px 0px
}
.spare-back-right {
    border-radius: 0px $border-radii $border-radii 0px
}
.spare-back-bottom {
    border-radius: 0px 0px $border-radii $border-radii
}
.spare-back-left {
    border-radius: 0px $border-radii 0px $border-radii 
}
.spare-back-middle {
    border-radius: 0px 0px 0px 0px
}

.spare {
    border: 0px;
    margin: 0px;
    width: $square-size;
    height: $square-size;
    background-size: $square-size $square-size;
}

.spare-pawn-white {
    background: url($pawn-white) (0px 0px) / ($square-size $square-size) no-repeat;
}
.spare-bishop-white {
    background: url($bishop-white) (0px 0px) / ($square-size $square-size) no-repeat;
}
.spare-knight-white {
    background: url($knight-white) (0px 0px) / ($square-size $square-size) no-repeat;
}
.spare-rook-white {
    background: url($rook-white) (0px 0px) / ($square-size $square-size) no-repeat;
}
.spare-queen-white {
    background: url($queen-white) (0px 0px) / ($square-size $square-size) no-repeat;
}
.spare-king-white {
    background: url($king-white) (0px 0px) / ($square-size $square-size) no-repeat;
}

.spare-pawn-black {
    background: url($pawn-black) (0px 0px) / ($square-size $square-size) no-repeat;
}
.spare-bishop-black {
    background: url($bishop-black) (0px 0px) / ($square-size $square-size) no-repeat;
}
.spare-knight-black {
    background: url($knight-black) (0px 0px) / ($square-size $square-size) no-repeat;
}
.spare-rook-black {
    background: url($rook-black) (0px 0px) / ($square-size $square-size) no-repeat;
}
.spare-queen-black {
    background: url($queen-black) (0px 0px) / ($square-size $square-size) no-repeat;
}
.spare-king-black {
    background: url($king-black) (0px 0px) / ($square-size $square-size) no-repeat;
}
</style>

