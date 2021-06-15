<template>
<div class="spares" :id="id">
    <div v-for="(piece, i) in pieces" :key="id + i"
        :class="['spare-back', spareBackClass(i), selectedClass(i)]"
        :style="[vertical ? {} : { 'float': 'left' }]">

        <button
            :class="'spare spare-' + piece"
            @mousedown="onMouseDown($event, i)"
            @click="onClick($event, i)">
        </button>
    </div>
</div>
</template>

<script>
export default {
    /*
        id: unique key for the bank
        vertical: boolean whether bank is vertical or horizontal
        pieces: list of piece strings like 'pawn-black'
    */
    props: ['id', 'vertical', 'selectable', 'pieces'],
    data: function () {
        return {
            selected: -1,
        };
    },
    methods: {
        spareBackClass(i) {
            if (i === 0) {
                return this.vertical ? 'spare-back-top' : 'spare-back-left';
            }
            if (i === this.pieces.length - 1) {
                return this.vertical ? 'spare-back-bottom' : 'spare-back-right';
            }
            return 'spare-back-middle';
        },
        selectedClass(i) {
            return i === this.selected ? 'selected' : 'not-selected';
        },
        clearSelection() {
            this.selected = -1;
        },
        // Default methods for calling superclass method with extends
        onClick(event, i) {
            this.onClickDefault(event, i);
        },
        onClickDefault(event, i) {
            this.$emit('spareClick', event, i);
            if (this.selectable) {
                this.selected = this.selected === i ? -1 : i;
            }
        },
        onMouseDown(event, i) {
            this.onMouseDownDefault(event, i);
        },
        onMouseDownDefault(event, i) {
            this.$emit('spareMouseDown', event, i);
        },
    },
};
</script>

<style lang="scss">
.spares {
    background-color: $secondary;
    display: inline-block;
    border-radius: $border-radii;
    box-shadow: 0px 0px 2px $secondary-shadow inset;
}

.spare-back {
    transition: background 0.4s ease;
}
.spare-back.selected {
    background: $secondary-accent1
}
.spare-back.not-selected:hover {
    background: scale-color($secondary-accent1, $alpha: -30%);
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
    border-radius: $border-radii 0px 0px $border-radii
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
