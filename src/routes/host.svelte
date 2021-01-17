<script>
  import io from "socket.io-client";
  import NameForm from "../components/NameForm.svelte";
  import ResetButton from "../components/ResetButton.svelte";
  import BuzzerTable from "../components/BuzzerTable.svelte";
  import ClientTable from "../components/ClientTable.svelte";
  import { socket, role } from "../stores.js";

  $role = "HOST";
  $socket = io();

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
</script>

<svelte:head>
  <title>Goennbuzz - Host</title>
</svelte:head>

<NameForm />
<ResetButton />
<BuzzerTable />
<ClientTable />
