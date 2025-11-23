<script lang="ts">

    let { UserContent } = $props();
    
</script>

<div class="flex flex-col justify-center items-center border-2 border-blue-500 p-5 rounded-lg bg-white shadow-lg space-y-4">
    
    <h1 class="text-3xl font-bold">Paramètres</h1>

    <div class="flex flex-row gap-3">
        <label for=""><h2 class="text-xl">Hauteur du véhicule (en centimètres) :</h2></label>
        <input type="number" placeholder="ex: 136" min="100" max="500" bind:value={$UserContent.hauteur}>
    </div>

    <div class="flex flex-row gap-3">
        <label for=""><h2 class="text-xl">PMR (Mobilité réduite) :</h2></label>
        <input type="checkbox" name="" id="" bind:checked={$UserContent.pmr}/>
    </div>
    
    <div class="flex flex-row gap-3">
        <label for=""><h2 class="text-xl">Uniquement parking avec disponibilité :</h2></label>
        <input type="checkbox" name="" id="" bind:checked={$UserContent.dspOnly}/>
    </div>
</div>