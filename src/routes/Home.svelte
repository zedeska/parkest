<script lang="ts">
  import { onMount } from 'svelte';


    import Map from '../map';
    import Position from '../position';

    const deviceHeight = window.innerHeight;
    const deviceWidth = window.innerWidth;
    const position: Position = new Position();
    const map = new Map('map');

    onMount(async() => {
        await position.getPosition();
        map.laodMap();
        position.setWatcher(map.setPosition.bind(map));
    })

</script>


<div id="map" style="width: {deviceWidth}px; height: {deviceHeight}px;"></div>