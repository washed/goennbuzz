<script>
  import io from "socket.io-client";
  import NameForm from "../components/NameForm.svelte";
  import ClientTable from "../components/ClientTable.svelte";
  import BuzzerTable from "../components/BuzzerTable.svelte";
  import BuzzerButton from "../components/BuzzerButton.svelte";
  import NBuzzers from "../components/NBuzzers.svelte";
  import { client, socket, role, gameConfig } from "../stores.js";

  $role = "JOIN";
  $socket = io();

  Number.prototype.round = function (places) {
    var precision_factor = Math.pow(10, places) / 10;
    return (
      +Math.round((this + Number.EPSILON) * precision_factor) / precision_factor
    );
  };

  function make_it_glow_bitch(str) {
    var glowy_string_html = "<div>";
    for (var i = 0; i < str.length; i++) {
      glowy_string_html = glowy_string_html.concat(
        "<span class='glow'>" + str.charAt(i) + "</span>"
      );
    }
    glowy_string_html = glowy_string_html.concat("</div>");
    return glowy_string_html;
  }

  $socket.on("reset", function () {
    console.debug(`${$role} <<< reset`);
    $client.hasBuzzed = false;
  });

  $socket.on("config", (config) => {
    console.log(`${$role} <<< config`, config);
    $gameConfig = config;
  });
</script>

<svelte:head>
  <title>Goennbuzz - Join</title>
</svelte:head>{#if typeof $client !== "undefined" && $client != null}
  <NameForm />
  {#if typeof $gameConfig !== "undefined" && $gameConfig != null}
    {#if $gameConfig.mode == 0}
      <BuzzerButton />
    {:else if $gameConfig.mode == 1}
      <NBuzzers />
    {/if}
    <BuzzerTable />
  {/if}
{/if}
<ClientTable />
