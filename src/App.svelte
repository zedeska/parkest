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
  
  import Navbar from './components/Navbar.svelte';
  import Home from './routes/Home.svelte';
  import Params from './routes/Params.svelte';
  import { writable } from 'svelte/store';

  const position: Position = new Position();
  const map = new Map('map');
  const parking = new Parking();

  const user : User = new User("test", false);
  const stored = localStorage.getItem('user');
  if (stored) {
    const parsed = JSON.parse(stored);
    user.typeVehicule = parsed.typeVehicule;
    user.handicap = parsed.handicap;
  }
  const UserContent = writable(user);
  UserContent.subscribe(value => {
    localStorage.setItem('user', JSON.stringify(value));
  });

  const routes: RouteConfig[] = [
    {
      component: Home
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

  onMount(async() => {
    try {
      await Geolocation.checkPermissions().then(async (result) => {
        if (result.location !== 'granted') {
          await Geolocation.requestPermissions();
        }
      })
    } catch (e) {
      console.error('Error checking/requesting permissions', e)
    }
    await position.getPosition();
    map.longitude = position.longitude;
    map.latitude = position.latitude;
    map.loadMap();
    position.setWatcher(map.setPosition.bind(map));
    await parking.fetchParkings();
    map.setParkingMarkers(parking.getNearParkings(new LngLat(position.longitude, position.latitude)));
    
  })
</script>

<main class="flex flex-col justify-center items-center" style="height: {deviceHeight}px; width: {deviceWidth}px; ">

  <Navbar bind:open={openSideMenu} />

  <Router {routes} />

</main>