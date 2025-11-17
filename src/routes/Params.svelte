<script lang="ts">

    let { UserContent } = $props();
    
</script>

<div class="flex flex-col justify-center items-center">
    <label for="">Type de véhicule</label>
    <select name="" id="">
        <option value="">{$UserContent.typeVehicule}</option>
    </select>

    <label for="">Handicap ?</label>
    <input type="checkbox" name="" id="" bind:checked={$UserContent.handicap}/>
</div>