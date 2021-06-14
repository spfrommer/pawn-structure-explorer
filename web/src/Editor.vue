<template>
<div id="editor">
    <div class="spares">
        <div class="spare-back spare-back-top"><button @mousedown="onMouseDownBlack" class="spare" id="spare-pawn-black"></button></div> 
        <div class="spare-back spare-back-bottom"><button @mousedown="onMouseDownWhite" class="spare" id="spare-pawn-white"></button></div> 
    </div>
</div>
</template>

<script>
import { EventBus } from '@/event-bus';

export default {
    props: [],
    methods: {
        onMouseDownWhite(mouseEvent) {
            EventBus.$emit('editorMouseDown', mouseEvent, 'white');
        },
        onMouseDownBlack(mouseEvent) {
            EventBus.$emit('editorMouseDown', mouseEvent, 'black');
        }
    }
}
</script>

<style scoped lang="scss">
.spares {
    background-color: $secondary;
    display: inline-block;
    border-radius: $border-radii;
    box-shadow: 0px 0px 3px $secondary-shadow inset;
}
.spare {
    border: 0px;
    margin: 0px;
    width: 40px;
    height: 40px;
    background-size: 40px 40px;
}
#spare-pawn-white {
    background: url($pawn-white) 0px 0px/40px 40px no-repeat;
}
#spare-pawn-black {
    background: url($pawn-black) 0px 0px/40px 40px no-repeat;
}

.spare-back {
    transition: background 0.7s ease;
}
.spare-back:hover {
    background: $secondary-highlight;
    box-shadow: 0px 0px 3px $secondary-highlight-shadow inset;
}
.spare-back-top {
    border-radius: $border-radii $border-radii 0px 0px
}
.spare-back-bottom {
    border-radius: 0px 0px $border-radii $border-radii
}

</style>
