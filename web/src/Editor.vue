<template>
<div id="editor">
    <div id="spares">
        <div><button @mousedown="onMouseDownBlack" class="spare" id="spare-black"></button></div> 
        <div><button @mousedown="onMouseDownWhite" class="spare" id="spare-white"></button></div> 
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
#spares {
    background-color: #727272;
    display: inline-block;
    border-radius: 5px;
    box-shadow: 1px 1px 5px #555 inset;
}
.spare {
    border: 0px;
    margin: 0px;
    width: 40px;
    height: 40px;
    background-size: 40px 40px;
}
#spare-white {
    background: url($pawn-white) 0px 0px/40px 40px no-repeat;
}
#spare-black {
    background: url($pawn-black) 0px 0px/40px 40px no-repeat;
}
</style>
