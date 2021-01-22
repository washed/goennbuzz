<script>
  import NBuzzerButton from "../components/NBuzzerButton.svelte";
  import { gameConfig, client } from "../stores.js";
</script>

{#if $client.nameLocked}
  <div class="container">
    {#if $gameConfig.nBuzzConfig != null}
      {#each $gameConfig.nBuzzConfig as buzzer}
        <div class="item">
          <div>
            <NBuzzerButton label={buzzer.label} />
          </div>
        </div>
      {/each}
    {/if}
  </div>
{:else}
  <p>Lock in your name first! (You can change it anytime)</p>
{/if}

<style>
  .container {
    display: flex;
    flex-flow: row wrap;
    align-content: space-around;
    justify-content: space-around;
  }
  .item {
    display: contents;
  }
  .item > div {
    width: 48%;
    margin: 1%;
  }
  .item:nth-child(2n)::after {
    content: "";
    width: 100%;
  }
</style>
