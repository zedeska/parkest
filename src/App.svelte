<script lang="ts">
  import { onMount } from 'svelte'
  import { Geolocation } from '@capacitor/geolocation'
  import { Router, type RouteConfig } from "@mateothegreat/svelte5-router";
  import "@maptiler/sdk/dist/maptiler-sdk.css";
  import User from './user';
  import Position from './position';
  import Map from './map';
  import { Parking } from './parking';
  import { LngLat } from '@maptiler/sdk';
  import Routing from './components/Routing.svelte';
  
  import Navbar from './components/Navbar.svelte';
  import Home from './routes/Home.svelte';
  import Params from './routes/Params.svelte';
  import RoutingComponent from './components/Routing.svelte';
  import { writable, get } from 'svelte/store';
  import { routingState } from './stores/routingStore';
  import { mapStore } from './stores/mapStore';

  const user : User = new User("test", false, false);
  const stored = localStorage.getItem('user');

  if (stored) {
    const parsed = JSON.parse(stored);
    user.typeVehicule = parsed.typeVehicule;
    user.pmr = parsed.pmr;
    user.dspOnly = parsed.dspOnly;
  }

  const UserContent = writable(user);
  UserContent.subscribe(value => {
    localStorage.setItem('user', JSON.stringify(value));
  });

  const routes: RouteConfig[] = [
    {
      component: Home,
      props: {
        mapInit
      }
    },
    {
      path: "parametres",
      component: Params,
      props: {
        UserContent
      }
    }
  ];

  const deviceHeight = window.innerHeight;
  const deviceWidth = window.innerWidth;
  let openSideMenu = false;

  const position: Position = new Position();
  const parking = new Parking();

  // Clear route when routing component is closed
  $: if (!$routingState.isVisible) {
    const currentMap = get(mapStore);
    if (currentMap) {
      currentMap.clearRoute();
    }
  }

  // refresh markers when dspOnly changes and map exists
  $: if ($mapStore && $UserContent.dspOnly !== undefined) {
    (async () => {
      try {
        $mapStore.clearParkingMarkers();
        $mapStore.setParkingMarkers(
        parking.getNearParkings(new LngLat(position.longitude, position.latitude), $UserContent.dspOnly)
        );
      } catch (e) {
        console.error('Failed to refresh parkings', e);
      }
    })();
  }

  async function mapInit() {
    console.log('mapInit started');
    let map = get(mapStore);
    
    // Ensure permissions are checked/requested before proceeding
    try {
      const permStatus = await Geolocation.checkPermissions();
      if (permStatus.location !== 'granted') {
        const requestStatus = await Geolocation.requestPermissions();
      }
    } catch (e) {
      console.error('Error checking permissions in mapInit', e);
    }

    if (!map) {
      console.log('Creating new Map instance');
      map = new Map('map');
      mapStore.set(map);
      
      try {
        await position.getPosition();
        map.longitude = position.longitude;
        map.latitude = position.latitude;
      } catch (e) {
        console.error('Could not get initial position', e);
        map.longitude = 6.1757; 
        map.latitude = 49.1193;
      }

      map.loadMap();
      position.setWatcher(map.setPosition.bind(map));
      await parking.fetchParkings();
      map.setParkingMarkers(parking.getNearParkings(new LngLat(position.longitude, position.latitude), $UserContent.dspOnly));
    } else {
      map.loadMap();
      
      // Re-attach watcher
      position.setWatcher(map.setPosition.bind(map));
      
      // Check if we need to fetch
      if (parking.parkings.length === 0) {
         await parking.fetchParkings();
      }
      
      map.setParkingMarkers(parking.getNearParkings(new LngLat(position.longitude, position.latitude), $UserContent.dspOnly));
    }
  }
</script>

<main class="flex flex-col justify-center items-center" style="height: {deviceHeight}px; width: {deviceWidth}px; ">

  <Navbar bind:open={openSideMenu} />

  {#if $routingState.isVisible}
    <RoutingComponent destination={$routingState.destination} />
  {/if}

  <Router {routes} />

</main>