<script>
    import io from "socket.io-client";
    import IconButton, { Icon } from "@smui/icon-button";
    import NameForm from "../components/NameForm.svelte";
    import ClientTable from "../components/ClientTable.svelte";
    import BuzzerTable from "../components/BuzzerTable.svelte";
    import BuzzerButton from "../components/BuzzerButton.svelte";
    import { client } from "../stores.js";

    let socket = io();

    let timestamps = [];
    let clients = {};

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

    socket.on("timestampList", function (serverTimestampList) {
        console.debug("JOIN <<< timestampList", serverTimestampList);
        timestamps = serverTimestampList;
    });

    socket.on("reset", function () {
        console.debug("JOIN <<< reset");
        $client.hasBuzzed = false;
    });

    function registerResponseHandler(registerResponse) {
        console.debug("JOIN <<< registerResponse", registerResponse);
        client.set(registerResponse);
    }

    socket.on("registerResponse", function (registerResponse) {
        registerResponseHandler(registerResponse);
    });

    socket.on("sendClients", function (sendClients) {
        console.debug("JOIN <<< sendClients", sendClients);
        clients = sendClients;
    });

    function pong(id) {
        console.debug("JOIN >>> pong", id);
        socket.emit("pong", id);
    }

    socket.on("ping", function (id) {
        console.debug("JOIN <<< ping", id);
        pong(id);
    });

    if ($client === null) {
        console.debug("JOIN >>> registerRequest");
        socket.emit("registerRequest");
    }
</script>

<svelte:head>
    <title>Goennbuzz - Join</title>
</svelte:head>

{#if typeof $client !== 'undefined'}
    {#if $client.nameLocked}
        <h1>Goennbuzz/Join - Oh hi {$client.name}!</h1>
    {:else}
        <h1>Goennbuzz/Join</h1>
    {/if}
    <NameForm {socket} />
    <BuzzerButton {socket} />
    <BuzzerTable {timestamps} />
    <ClientTable {clients} />
{/if}
