<script>
    import IconButton, { Icon } from "@smui/icon-button";
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

{#if $client.nameLocked}
    <IconButton on:click={buzzerHandler} class="touch" color="primary">
        {#if !$client.hasBuzzed}
            <Icon class="material-icons">star</Icon>
        {:else}
            <Icon class="material-icons">star_border</Icon>
        {/if}
    </IconButton>
{:else}
    <p>Enter your name first!</p>
{/if}
