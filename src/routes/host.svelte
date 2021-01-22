<script>
  import io from "socket.io-client";
  import NameForm from "../components/NameForm.svelte";
  import ResetButton from "../components/ResetButton.svelte";
  import BuzzerTable from "../components/BuzzerTable.svelte";
  import ClientTable from "../components/ClientTable.svelte";
  import NBuzzConfig from "../components/nBuzzConfig.svelte";
  import RevealButton from "../components/RevealButton.svelte";
  import { socket, role, nBuzzConfig, hostConfig } from "../stores.js";

  import Tab, { Icon, Label } from "@smui/tab";
  import TabBar from "@smui/tab-bar";
  let modeTabs = [
    {
      key: 0,
      icons: ["room_service"],
      label: "Single Buzzer",
    },
    {
      key: 1,
      icons: ["room_service", "room_service", "room_service", "room_service"],
      label: "n-Buzzer",
    },
  ];

  let activeMode = modeTabs[0];

  if (typeof $hostConfig === "undefined" || $hostConfig == null) {
    $hostConfig = {
      mode: activeMode.key,
      nBuzzConfig: $nBuzzConfig,
    };
  } else {
    activeMode = modeTabs[$hostConfig.mode];
    $nBuzzConfig = $hostConfig.nBuzzConfig;
  }

  $: $hostConfig.mode = activeMode.key;
  $: $hostConfig.nBuzzConfig = $nBuzzConfig;

  $: (() => {
    console.debug(`${$role} >>> configChangedHandler: `, $hostConfig);
    $socket.emit("configChanged", $hostConfig);
  })();

  $role = "HOST";
  $socket = io();
</script>

<svelte:head>
  <title>Goennbuzz - Host</title>
</svelte:head>

<NameForm />
<TabBar tabs={modeTabs} let:tab bind:active={activeMode}>
  <Tab {tab}>
    {#each tab.icons as icon}
      <Icon class="material-icons">{icon}</Icon>
    {/each}
    <Label>{tab.label}</Label>
  </Tab>
</TabBar>

{#if activeMode.key == 1}
  <NBuzzConfig />
  <RevealButton />
{/if}
<ResetButton />
<BuzzerTable />
<ClientTable />
