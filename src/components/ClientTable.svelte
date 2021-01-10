<script>
    import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";

    export let controls;
    export let clients;
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
        {#each Object.values(clients) as client}
            <Row>
                <Cell>{client.name}</Cell>
                <Cell>{client.id}</Cell>
                <Cell>{client.latency}</Cell>
            </Row>
        {/each}
    </Body>
</DataTable>
