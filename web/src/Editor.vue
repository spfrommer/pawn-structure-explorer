<script>
// eslint-disable-next-line import/no-unresolved
import { EventBus } from '@/event-bus';
import SpareBank from './SpareBank.vue';

export default {
    name: 'Editor',
    extends: SpareBank,
    props: {
        flipped: { default() { return false; } },
        pieces: {
            default() {
                // TOOD: fix
                const pieces = ['pawn-black', 'pawn-white'];
                if (this.flipped) pieces.reverse();
                return pieces;
            },
        },
        vertical: { default() { return true; } },
        selectable: { default() { return false; } },
    },
    methods: {
        onMouseDown(event, i) {
            const color = i === this.flipped ? 'black' : 'white';
            EventBus.$emit('editorMouseDown', event, color);
            this.onMouseDownDefault(event, i);
        },
    },
};
</script>

<style lang="scss">
#editor .spare-back.selected {
    background: $secondary-accent2
}
#editor .spare-back.not-selected:hover {
    background: scale-color($secondary-accent2, $alpha: -30%);
}
</style>
