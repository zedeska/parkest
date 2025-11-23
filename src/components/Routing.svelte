<script lang="ts">
    import { routingState } from '../stores/routingStore';
    export let destination;

    function close() {
        routingState.update(state => ({ ...state, isVisible: false }));
    }
</script>

<div class="absolute top-4 left-1/2 -translate-x-1/2 bg-white z-50 flex flex-col items-center justify-center p-4 rounded-lg shadow-lg w-1/6 max-w-md">
    <button class="absolute right-4 top-4 cursor-pointer bg-transparent border-none" on:click={close} aria-label="Close">
        <i class="fa-solid fa-xmark text-2xl"></i>
    </button>
    <h1 class="text-xl font-bold mb-4">Navigation vers</h1>
    <h2 class="text-lg">{destination ? destination : 'Inconnu'}</h2>
</div>