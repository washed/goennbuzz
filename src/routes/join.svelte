<script>
    import io from "socket.io-client";
    import Button, { Label } from "@smui/button";
    import IconButton, { Icon } from "@smui/icon-button";
    import Textfield from "@smui/textfield";
    import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";

    let socket = io();

    var hasBuzzed = false;
    let timestamps = [];
    let nameLocked = false;
    let client = {
        id: null,
        name: "",
    };

    function clearTimestampList() {
        timestamps = [];
    }

    function setBuzzerState(state) {
        if (state === true) {
            hasBuzzed = true;
        } else if (state === false) {
            clearTimestampList();
            hasBuzzed = false;
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
        if (!hasBuzzed) {
            setBuzzerState(true);
            let tsPaylod = {
                client: name,
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

    function registerResponseHandler(client) {
        console.log("JOIN <<< registerResponse", client);
    }

    socket.on("registerResponse", function (client) {
        registerResponseHandler(client);
    });

    function updateClient() {}

    console.log("JOIN >>> registerRequest");
    socket.emit("registerRequest");
</script>

<svelte:head>
    <title>Sapper project template</title>
</svelte:head>

{#if nameLocked}
    <h1>Goennbuzz/Join - Oh hi {client.name}!</h1>
{:else}
    <h1>Goennbuzz/Join</h1>
{/if}

<div>
    {#if !nameLocked}
        <Textfield bind:value={client.name} label="Name" />
        <IconButton class="material-icons" toggle bind:pressed={nameLocked}>
            check
        </IconButton>
    {:else}
        <Label>{client.name}</Label>
        <IconButton class="material-icons" toggle bind:pressed={nameLocked}>
            edit
        </IconButton>
    {/if}
</div>
<div>
    {#if nameLocked}
        <Button on:click={buzzerHandler}>
            <Label>BUZZ</Label>
        </Button>
    {:else}
        <p>Enter your name first!</p>
    {/if}
</div>
{#if timestamps.length}
    <DataTable table$aria-label="Buzzes">
        <Head>
            <Row>
                <Cell>Name</Cell>
                <Cell>Time</Cell>
                <Cell>t+</Cell>
            </Row>
        </Head>
        <Body>
            {#each timestamps as timestamp}
                <Row>
                    <Cell>{timestamp.clientName}</Cell>
                    <Cell numeric>{timestamp.serverTimestamp}</Cell>
                    <Cell numeric>{timestamp.offset}</Cell>
                </Row>
            {/each}
        </Body>
    </DataTable>
{:else}
    <p>Waiting for buzzing...</p>
{/if}
