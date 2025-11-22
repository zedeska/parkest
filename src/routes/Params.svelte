<script lang="ts">

    let { UserContent } = $props();
    
</script>

<div class="flex flex-col justify-center items-center">
    <label for="">Type de véhicule</label>
    <select name="" id="">
        <option value="">{$UserContent.typeVehicule}</option>
    </select>

    <label for="">PMR (Mobilité réduite)</label>
    <input type="checkbox" name="" id="" bind:checked={$UserContent.pmr}/>

    <label for="">Afficher uniquement parking avec disponibilité</label>
    <input type="checkbox" name="" id="" bind:checked={$UserContent.dspOnly}/>
</div>