<script>
  import Card from "@smui/card";
  import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
  import GlowyString from "../components/GlowyString.svelte";
  import { socket, role, hostConfig, gameConfig, client } from "../stores.js";

  let timestamps = [];

  $: mode = $role == "HOST" ? $hostConfig.mode : $gameConfig.mode;
  $: reveal = $role == "HOST" ? true : false;

  $socket.on("timestampList", function (serverTimestamps) {
    console.debug(`${$role} <<< timestampList`, serverTimestamps);
    timestamps = serverTimestamps;
  });

  $socket.on("revealAnswers", function () {
    console.debug(`${$role} <<< revealAnswers`);
    reveal = true;
  });

  $socket.on("reset", function () {
    console.debug(`${$role} <<< reset`);
    reveal = false;
  });
</script>

<Card style="width: 100%; margin: 10px 0px;" padded>
  <p>Buzzes</p>
  <DataTable table$aria-label="Buzzes" style="width: 100%;">
    <Head>
      <Row>
        <Cell>Pos</Cell>
        <Cell>Name</Cell>
        {#if mode == 0}
          <Cell>Time</Cell>
          <Cell>t+ [ms]</Cell>
        {:else if mode == 1}
          <Cell>Answer</Cell>
        {/if}
      </Row>
    </Head>
    <Body>
      {#each timestamps as timestamp, i}
        <Row>
          <Cell>
            {i + 1}
          </Cell>
          <Cell>
            {#if i == 0}
              <GlowyString string={timestamp.clientName} />
            {:else}
              {timestamp.clientName}
            {/if}
          </Cell>

          {#if mode == 0}
            <Cell
              >{new Date(timestamp.serverTimestamp).toLocaleTimeString()}</Cell
            >
            <Cell>{timestamp.offset}</Cell>
          {:else if mode == 1}
            {#if reveal}
              <Cell>{timestamp.rawPayload.buzzer}</Cell>
            {:else if timestamp.rawPayload.client.id === $client.id}
              <Cell>{timestamp.rawPayload.buzzer}</Cell>
            {:else}
              <Cell>?</Cell>
            {/if}
          {/if}
        </Row>
      {/each}
    </Body>
  </DataTable>
</Card>
