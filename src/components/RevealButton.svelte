<script>
  import Button, { Label } from "@smui/button";
  import { role, socket } from "../stores.js";

  function revealButtonHandler() {
    console.debug(`${$role} >>> revealAnswers`);
    $socket.emit("revealAnswers");
  }
</script>

<Button
  on:click={revealButtonHandler}
  style="height: 100px; width: 100%; margin: 10px 0px;"
  variant="outlined"
>
  <Label>REVEAL ANSWERS</Label>
</Button>
