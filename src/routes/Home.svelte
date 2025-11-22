<script lang="ts">
    import { onMount } from 'svelte';

    const deviceHeight = window.innerHeight;
    const deviceWidth = window.innerWidth;
    export let mapInit: () => Promise<void>;

    onMount(() => {
        console.log('Home mounted, calling mapInit...');
        if (mapInit) {
            mapInit().catch(e => console.error('mapInit failed:', e));
        } else {
            console.error('mapInit prop is missing!');
        }
    });

</script>


<div id="map" style="width: {deviceWidth}px; height: {deviceHeight}px;"></div>