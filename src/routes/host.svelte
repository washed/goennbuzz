<script>
  import io from "socket.io-client";
  import NameForm from "../components/NameForm.svelte";
  import ResetButton from "../components/ResetButton.svelte";
  import BuzzerTable from "../components/BuzzerTable.svelte";
  import ClientTable from "../components/ClientTable.svelte";
  import { socket, role } from "../stores.js";

  $role = "HOST";
  $socket = io();
</script>

<svelte:head>
  <title>Goennbuzz - Host</title>
</svelte:head>

<NameForm />
<ResetButton />
<BuzzerTable />
<ClientTable />
