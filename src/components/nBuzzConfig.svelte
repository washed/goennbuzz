<script>
  import Card from "@smui/card";
  import IconButton from "@smui/icon-button";
  import { nBuzzConfig } from "../stores.js";

  const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
  let buzzerCount = 4;

  $: (() => {
    let config = [];
    for (let i = 0; i < buzzerCount; i++) {
      config.push({
        index: i,
        label: alphabet[i],
      });
    }
    $nBuzzConfig = config;
  })();
</script>

<Card style="width: 100%; margin: 5px 0px;" padded>
  Buzzer count: {buzzerCount}
  <IconButton class="material-icons" on:click={() => buzzerCount++}
    >add</IconButton
  >
  <IconButton class="material-icons" on:click={() => buzzerCount--}
    >remove</IconButton
  >
</Card>
