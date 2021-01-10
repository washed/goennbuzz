<script>
    import io from "socket.io-client";
    import IconButton, { Icon } from "@smui/icon-button";
    import NameForm from "../components/NameForm.svelte";
    import ClientTable from "../components/ClientTable.svelte";
    import BuzzerTable from "../components/BuzzerTable.svelte";
    import BuzzerButton from "../components/BuzzerButton.svelte";
    import { client, socket, role } from "../stores.js";

    $role = "JOIN";
    $socket = io();

    let timestamps = [];

    Number.prototype.round = function (places) {
        var precision_factor = Math.pow(10, places) / 10;
        return (
            +Math.round((this + Number.EPSILON) * precision_factor) /
            precision_factor
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

    $socket.on("timestampList", function (serverTimestampList) {
        console.debug(`${$role} <<< timestampList`, serverTimestampList);
        timestamps = serverTimestampList;
    });

    $socket.on("reset", function () {
        console.debug(`${$role} <<< reset`);
        $client.hasBuzzed = false;
    });
</script>

<svelte:head>
    <title>Goennbuzz - Join</title>
</svelte:head>

{#if typeof $client !== 'undefined' && $client != null}
    {#if $client.nameLocked}
        <h1>Goennbuzz/Join - Oh hi {$client.name}!</h1>
    {:else}
        <h1>Goennbuzz/Join</h1>
    {/if}

    <NameForm />
    <BuzzerButton />
    <BuzzerTable {timestamps} />
{/if}
<ClientTable />
