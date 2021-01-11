<script>
    import Textfield from "@smui/textfield";
    import Button, { Label, Icon } from "@smui/button";
    import { client, socket, role } from "../stores.js";

    $: (() => {
        if (typeof $client !== "undefined" && $client != null) {
            console.debug(`${$role} >>> registerUpdate`, $client);
            $socket.emit("registerUpdate", $client);
        }
    })();

    $: console.log($client.nameLocked);
</script>

<div>
    {#if typeof $client !== 'undefined' && $client != null}
        {#if $client.nameLocked}
            <Button
                color="secondary"
                on:click={() => ($client.nameLocked = false)}>
                <Label>{$client.name}</Label>
                <Icon class="material-icons">edit</Icon>
            </Button>
        {:else}
            <Textfield
                bind:value={$client.name}
                bind:disabled={$client.nameLocked}
                label="Name" />
            <Button
                color="secondary"
                on:click={() => ($client.nameLocked = true)}>
                <Icon class="material-icons">check</Icon>
            </Button>
        {/if}
    {/if}
</div>
