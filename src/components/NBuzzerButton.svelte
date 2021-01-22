<script>
  import Button, { Label } from "@smui/button";
  import { client, role, socket } from "../stores.js";

  export let label = "Buzz";

  function buzzerHandler() {
    if (!$client.hasBuzzed) {
      $client.hasBuzzed = true;
      let tsPayload = {
        client: $client,
        timestamp: Date.now(),
        buzzer: label,
      };
      console.debug(`${$role} >>> buzz`, tsPayload);
      $socket.emit("buzz", tsPayload);
    }
  }
</script>

<Button
  on:click={buzzerHandler}
  style="height: 80px; width: 100%"
  variant="outlined"
>
  {#if !$client.hasBuzzed}
    <Label>{label}</Label>
  {:else}
    <Label style="bold">{label}</Label>
  {/if}
</Button>
