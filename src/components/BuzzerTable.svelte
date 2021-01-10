<script>
    import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";

    export let timestamps;
</script>

<p>Buzzes</p>
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
