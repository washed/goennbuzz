<script>
    import io from "socket.io-client";
    import Button, { Label } from "@smui/button";
    import IconButton, { Icon } from "@smui/icon-button";
    import Textfield from "@smui/textfield";
    import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
    import ClientTable from "../components/ClientTable.svelte";
    import BuzzerTable from "../components/BuzzerTable.svelte";
    import { client } from "../stores.js";

    let socket = io();

    let timestamps = [];
    let clients = {};

    function clearTimestampList() {
        timestamps = [];
    }

    function setBuzzerState(state) {
        if (state === true) {
            $client.hasBuzzed = true;
        } else if (state === false) {
            clearTimestampList();
            $client.hasBuzzed = false;
        }
    }

    Number.prototype.round = function (places) {
        var precision_factor = Math.pow(10, places) / 10;
        return (
            +Math.round((this + Number.EPSILON) * precision_factor) /
            precision_factor
        );
    };

    function buzzerHandler() {
        if (!$client.hasBuzzed) {
            setBuzzerState(true);
            let tsPaylod = {
                client: $client,
                timestamp: Date.now(),
            };
            console.log("JOIN >>> buzz", tsPaylod);
            socket.emit("buzz", tsPaylod);
        }
    }

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
        console.log("JOIN <<< timestampList", serverTimestampList);
        timestamps = serverTimestampList;
    });

    socket.on("reset", function () {
        console.log("JOIN <<< reset");
        setBuzzerState(false);
    });

    function registerResponseHandler(registerResponse) {
        console.log("JOIN <<< registerResponse", registerResponse);
        client.set(registerResponse);
    }

    socket.on("registerResponse", function (registerResponse) {
        registerResponseHandler(registerResponse);
    });

    socket.on("sendClients", function (sendClients) {
        console.log("JOIN <<< sendClients", sendClients);
        clients = sendClients;
    });

    function pong(id) {
        console.log("JOIN >>> pong", id);
        socket.emit("pong", id);
    }

    socket.on("ping", function (id) {
        console.log("JOIN <<< ping", id);
        pong(id);
    });

    function updateClient() {
        console.log("JOIN >>> registerUpdate");
        socket.emit("registerUpdate", $client);
    }

    if ($client === null) {
        console.log("JOIN >>> registerRequest");
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
    <div>
        {#if !$client.nameLocked}
            <Textfield bind:value={$client.name} label="Name" />
            <IconButton
                class="material-icons"
                toggle
                bind:pressed={$client.nameLocked}
                on:click={updateClient}>
                check
            </IconButton>
        {:else}
            <Label>{$client.name}</Label>
            <IconButton
                class="material-icons"
                toggle
                bind:pressed={$client.nameLocked}>
                edit
            </IconButton>
        {/if}
    </div>
    <div>
        {#if $client.nameLocked}
            <Button on:click={buzzerHandler}>
                <Label>BUZZ</Label>
            </Button>
        {:else}
            <p>Enter your name first!</p>
        {/if}
    </div>
    <BuzzerTable {timestamps} />
    <ClientTable {clients} />
{/if}
