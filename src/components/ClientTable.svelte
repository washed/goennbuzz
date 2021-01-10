<script>
    import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
    import { socket, client, clients, role } from "../stores.js";
    import _ from "lodash";

    function registerResponseHandler(registerResponse) {
        console.debug(`${$role} <<< registerResponse`, registerResponse);
        $client = registerResponse;
    }

    $socket.on("registerResponse", function (registerResponse) {
        registerResponseHandler(registerResponse);
    });

    $socket.on("sendClients", function (sendClients) {
        console.debug(`${$role} <<< sendClients`, sendClients);
        $clients = sendClients;
    });

    function pong(id) {
        console.debug(`${$role} >>> pong`, id);
        $socket.emit("pong", id);
    }

    $socket.on("ping", function (id) {
        console.debug(`${$role} <<< ping`, id);
        pong(id);
    });

    if (typeof $client === "undefined" || $client == null) {
        console.debug(`${$role} >>> registerRequest`);
        $socket.emit("registerRequest");
    } else {
        console.debug(`${$role} >>> registerUpdate`, $client);
        $socket.emit("registerUpdate", $client);
    }
</script>

<p>Clients</p>
<DataTable table$aria-label="Buzzas">
    <Head>
        <Row>
            <Cell>Name</Cell>
            <Cell>ID</Cell>
            <Cell>Latency</Cell>
        </Row>
    </Head>
    <Body>
        {#if !_.isEmpty($clients)}
            {#each Object.values($clients) as client}
                <Row>
                    <Cell>{client.name}</Cell>
                    <Cell>{client.id}</Cell>
                    <Cell>{client.latency}</Cell>
                </Row>
            {/each}
        {/if}
    </Body>
</DataTable>
