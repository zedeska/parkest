<script lang="ts">
  import { Geolocation } from '@capacitor/geolocation'
  import { onMount } from 'svelte'

  // Use plain reactive variables so Svelte updates the template when values change.
  let latitude: number = 0
  let longitude: number = 0
  let error: string | null = null

  async function getPos() {
    try {
      const coordinates = await Geolocation.getCurrentPosition({timeout: 30000})
      // Assignments to top-level variables are reactive in Svelte
      latitude = coordinates.coords.latitude
      longitude = coordinates.coords.longitude
      error = null
    } catch (e: any) {
      error = 'Error getting location: ' + (e?.message ?? String(e))
    }
  }

  // Optional: auto-request on mount (commented out by default)
  onMount(() => {
    try {
      Geolocation.checkPermissions().then((result) => {
        if (result.location !== 'granted') {
          Geolocation.requestPermissions()
        }
      })
    } catch (e) {
      error = "Please enable location services."
    }
  })
</script>

<main>
  <h1>Geolocation Example</h1>
  <p>Latitude: {latitude}, Longitude: {longitude}</p>
  <button on:click={getPos}>Get Position</button>
  {#if error}
    <p style="color:crimson">{error}</p>
  {/if}
</main>