<script>
  import Button, { Label } from "@smui/button";
  import { role, socket } from "../stores.js";

  function resetButtonHandler() {
    console.debug(`${$role} >>> reset`);
    $socket.emit("reset");
  }
</script>

<Button
  on:click={resetButtonHandler}
  style="height: 100px; width: 100%; margin: 10px 0px;"
  variant="outlined"
>
  <Label>RESET</Label>
</Button>
