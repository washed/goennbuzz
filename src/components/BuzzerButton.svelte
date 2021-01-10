<script>
    import Button, { Label } from "@smui/button";
    import { client } from "../stores.js";
    export let socket;

    function buzzerHandler() {
        if (!$client.hasBuzzed) {
            $client.hasBuzzed = true;
            let tsPaylod = {
                client: $client,
                timestamp: Date.now(),
            };
            console.debug("JOIN >>> buzz", tsPaylod);
            socket.emit("buzz", tsPaylod);
        }
    }
</script>

<!--<style lang="scss" global>
    // TODO: Get this stupid theming stuff to work
    @import "@smui/icon-button/_index.scss";
    .mdc-button {
        @include height(128);
    }
</style>-->

<div>
    {#if $client.nameLocked}
        <Button on:click={buzzerHandler}>
            {#if !$client.hasBuzzed}
                <Label>BUZZ</Label>
            {:else}
                <Label>BUZZED</Label>
            {/if}
        </Button>
    {:else}
        <p>Lock in your name first! (You can change it anytime)</p>
    {/if}
</div>
