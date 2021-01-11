<script>
    import io from "socket.io-client";
    import Button, { Label } from "@smui/button";
    import ClientTable from "../components/ClientTable.svelte";
    import BuzzerTable from "../components/BuzzerTable.svelte";
    import NameForm from "../components/NameForm.svelte";
    import { socket, role } from "../stores.js";

    $role = "HOST";
    $socket = io();

    $: timestamps = [];

    function resetButtonHandler() {
        console.debug(`${$role} >>> reset`);
        $socket.emit("reset");
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

    $socket.on("timestampList", function (serverTimestamps) {
        console.debug(`${$role} <<< timestampList`, serverTimestamps);
        timestamps = serverTimestamps;
    });
</script>

<svelte:head>
    <title>Goennbuzz - Host</title>
</svelte:head>

<NameForm />
<Button on:click={resetButtonHandler}>
    <Label>RESET</Label>
</Button>
<BuzzerTable {timestamps} />
<ClientTable />
