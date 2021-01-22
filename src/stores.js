import { writable } from "svelte/store";

export let client;
export let hostConfig;

if (typeof window !== "undefined") {
  client = writable(JSON.parse(sessionStorage.getItem("client")));
  client.subscribe((val) =>
    sessionStorage.setItem("client", JSON.stringify(val))
  );
} else {
  client = writable();
}

if (typeof window !== "undefined") {
  hostConfig = writable(JSON.parse(sessionStorage.getItem("hostConfig")));
  hostConfig.subscribe((val) =>
    sessionStorage.setItem("hostConfig", JSON.stringify(val))
  );
} else {
  hostConfig = writable();
}

export let clients = writable({});
export let socket = writable();
export let role = writable();
export let gameConfig = writable();
export let nBuzzConfig = writable();
