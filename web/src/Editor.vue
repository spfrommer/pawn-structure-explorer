<script>
import SpareBank from './SpareBank.vue';
import { EventBus } from '@/event-bus';

export default {
    name: 'Editor',
    extends: SpareBank,
    props: {
        pieces: { default () { return ['pawn-black', 'pawn-white']; } },
        vertical: { default() { return true; }},
        selectable: { default() { return false; }} 
    },
    methods: {
        onMouseDown(event, i) {
            let color = i === 0 ? 'black' : 'white';
            EventBus.$emit('editorMouseDown', event, color);
            this.onMouseDownDefault(event, i);
        }
    }
}
</script>
<style lang="scss">
#editor .spare-back.selected {
    background: $secondary-accent2
}
#editor .spare-back.not-selected:hover {
    background: scale-color($secondary-accent2, $alpha: -30%);
}
</style>