<script>
  import Card from "@smui/card";
  import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
  import { socket, role } from "../stores.js";

  let timestamps = [];

  $socket.on("timestampList", function (serverTimestamps) {
    console.debug(`${$role} <<< timestampList`, serverTimestamps);
    timestamps = serverTimestamps;
  });
</script>

<Card style="width: 100%; margin: 10px 0px;" padded>
  <p>Buzzes</p>
  <DataTable table$aria-label="Buzzes" style="width: 100%;">
    <Head>
      <Row>
        <Cell>Name</Cell>
        <Cell>Time</Cell>
        <Cell>t+ [ms]</Cell>
      </Row>
    </Head>
    <Body>
      {#each timestamps as timestamp}
        <Row>
          <Cell>{timestamp.clientName}</Cell>
          <Cell>{new Date(timestamp.serverTimestamp).toLocaleTimeString()}</Cell
          >
          <Cell>{timestamp.offset}</Cell>
        </Row>
      {/each}
    </Body>
  </DataTable>
</Card>
