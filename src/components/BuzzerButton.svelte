<script>
  import Button, { Label } from "@smui/button";
  import { client, role, socket } from "../stores.js";

  function buzzerHandler() {
    if (!$client.hasBuzzed) {
      $client.hasBuzzed = true;
      let tsPaylod = {
        client: $client,
        timestamp: Date.now(),
      };
      console.debug(`${$role} >>> buzz`, tsPaylod);
      $socket.emit("buzz", tsPaylod);
    }
  }
</script>

<div>
  {#if $client.nameLocked}
    <Button
      on:click={buzzerHandler}
      style="height: 200px; width: 100%"
      variant="outlined"
    >
      {#if !$client.hasBuzzed}
        <Label>BUZZ</Label>
      {:else}
        <Label>BUZZED</Label>
      {/if}
    </Button>
  {:else}
    <p>Lock in your name first! (You can change it anytime)</p>
  {/if}
</div>
