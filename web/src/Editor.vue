<script>
// eslint-disable-next-line import/no-unresolved
import { EventBus } from '@/event-bus';
import SpareBank from './SpareBank.vue';

export default {
    name: 'Editor',
    extends: SpareBank,
    props: {
        flipped: { default() { return false; } },
        vertical: { default() { return true; } },
        selectable: { default() { return false; } },
        // PIECES MUST BE PASSED IN W/ FORM ['pawn-black', 'pawn-white']
    },
    methods: {
        onMouseDown(event, i) {
            // eslint-disable-next-line eqeqeq
            const color = (i == this.flipped) ? 'black' : 'white';
            EventBus.$emit('editorMouseDown', event, color);
            this.onMouseDownDefault(event, i);
        },
    },
};
</script>

<style lang="scss">
#Editor .spare-back.selected {
    background: $secondary-accent2
}
#Editor .spare-back.not-selected:hover {
    background: scale-color($secondary-accent2, $alpha: -30%);
}
</style>
