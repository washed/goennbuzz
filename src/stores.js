import { writable } from "svelte/store";

export let client;

if (typeof window !== "undefined") {
  client = writable(JSON.parse(localStorage.getItem("client")));
  client.subscribe((val) =>
    localStorage.setItem("client", JSON.stringify(val))
  );
} else {
  client = writable();
}
