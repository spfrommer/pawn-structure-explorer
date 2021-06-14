<script>
import { SpareBank } from './SpareBank.vue';
import { EventBus } from '@/event-bus';

export default {
    name: 'Editor',
    extends: SpareBank,
    methods: {
        onMouseDown(i) {
            color = i == 0 ? 'white' : 'black';
            EventBus.$emit('editorMouseDown', mouseEvent, color);
        }
    }
}
</script>