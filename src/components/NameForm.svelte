<script>
    import Textfield from "@smui/textfield";
    import IconButton, { Icon } from "@smui/icon-button";
    import { client } from "../stores.js";

    export let socket;

    function updateClient(client) {
        console.debug("JOIN >>> registerUpdate");
        socket.emit("registerUpdate", client);
    }

    $: updateClient($client);
</script>

<Textfield
    bind:value={$client.name}
    bind:disabled={$client.nameLocked}
    label="Name" />
<IconButton toggle bind:pressed={$client.nameLocked}>
    <Icon class="material-icons">check</Icon>
    <Icon class="material-icons" on>edit</Icon>
</IconButton>
