import { writable } from "svelte/store";

export let client;

if (typeof window !== "undefined") {
  client = writable(JSON.parse(sessionStorage.getItem("client")));
  client.subscribe((val) =>
    sessionStorage.setItem("client", JSON.stringify(val))
  );
} else {
  client = writable();
}

export let clients = writable({});
export let socket = writable();
export let role = writable();
