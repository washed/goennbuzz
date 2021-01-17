<script>
  import Textfield from "@smui/textfield";
  import Button, { Label, Icon } from "@smui/button";
  import { client, socket, role } from "../stores.js";

  $: (() => {
    if (typeof $client !== "undefined" && $client != null) {
      console.debug(`${$role} >>> registerUpdate`, $client);
      $socket.emit("registerUpdate", $client);
    }
  })();
</script>

{#if typeof $client !== "undefined" && $client != null}
  {#if !$client.nameLocked}
    <Textfield
      bind:value={$client.name}
      bind:disabled={$client.nameLocked}
      label="Name"
    />
  {/if}
  <Button
    touch
    color="secondary"
    on:click={() => ($client.nameLocked = !$client.nameLocked)}
  >
    {#if $client.nameLocked}
      <Label>{$client.name}</Label>
      <Icon class="material-icons">edit</Icon>
    {:else}
      <Icon class="material-icons" on>check</Icon>
    {/if}
  </Button>
{/if}
