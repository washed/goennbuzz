<script>
    import Textfield from "@smui/textfield";
    import IconButton, { Icon } from "@smui/icon-button";
    import { client, socket, role } from "../stores.js";

    $: (() => {
        if (typeof $client !== "undefined" && $client != null) {
            console.debug(`${$role} >>> registerUpdate`, $client);
            $socket.emit("registerUpdate", $client);
        }
    })();
</script>

<div>
    {#if typeof $client !== 'undefined' && $client != null}
        <Textfield
            bind:value={$client.name}
            bind:disabled={$client.nameLocked}
            label="Name" />
        <IconButton toggle bind:pressed={$client.nameLocked}>
            <Icon class="material-icons">check</Icon>
            <Icon class="material-icons" on>edit</Icon>
        </IconButton>
    {/if}
</div>
