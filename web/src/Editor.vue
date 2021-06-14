<script>
import SpareBank from './SpareBank.vue';
import { EventBus } from '@/event-bus';

export default {
    name: 'Editor',
    extends: SpareBank,
    props: {
        pieces: { default () { return ['pawn-black', 'pawn-white']; } },
        vertical: { default() { return "true"; }},
        selectable: { default() { return "true"; }} 
    },
    methods: {
        onMouseDown(event, i) {
            /*
            let color = i === 0 ? 'black' : 'white';
            EventBus.$emit('editorMouseDown', event, color);
            this.onMouseDownDefault(event, i);*/
        }
    }
}
</script>