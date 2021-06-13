<template>
<div>
    <button @mousedown="onMouseDown">Editor click</button>
</div>
</template>

<script>
import { EventBus } from '@/event-bus';

export default {
    props: [],
    methods: {
        onMouseDown(mouseEvent) {
            EventBus.$emit('editorMouseDown', mouseEvent, 'white');
        }
    }
}
</script>

<style>
</style>
