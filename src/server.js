import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";
import http from "http";
import io from "socket.io";
import { generate as shortUuidGenerate } from "short-uuid";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const server = http.createServer();

polka({ server })
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .listen(PORT, (err) => {
    if (err) console.log("error", err);
  });

let ioServer = io(server);

var timestamps = [];

function emitReset(socket) {
  console.debug("SERVER >>> reset");
  socket.emit("reset");
}

function broadcastReset(socket) {
  console.debug("SERVER >>> reset");
  socket.broadcast.emit("reset");
}

function emitTimestamps(socket) {
  console.debug("SERVER >>> timestampList", timestamps);
  socket.emit("timestampList", timestamps);
}

function broadcastTimestamps(socket) {
  console.debug("SERVER >>> timestampList", timestamps);
  socket.broadcast.emit("timestampList", timestamps);
}

function buzzHandler(socket, payload) {
  console.debug("SERVER <<< buzz", payload);
  let serverTimestamp = Date.now();
  timestamps.push({
    clientName: payload.client.name,
    clientTimestamp: payload.timestamp,
    serverTimestamp: serverTimestamp,
    offset: 0,
  });
  timestamps.sort(compareTimestamps);
  populateOffsets(timestamps);

  // Send timestamps to the everyone
  emitTimestamps(socket);
  broadcastTimestamps(socket);
}

function resetHandler(socket) {
  console.debug("SERVER <<< reset");
  timestamps = [];

  // talk to host
  emitReset(socket);
  emitTimestamps(socket);

  // talk to clients
  broadcastReset(socket);
  broadcastTimestamps(socket);
}

var clients = {};

function sendClients(socket) {
  console.debug("SERVER >>> sendClients", clients);
  socket.emit("sendClients", clients);
  socket.broadcast.emit("sendClients", clients);
}

function pingHandler(id) {
  setInterval(() => {
    console.debug("SERVER >>> ping", id);
    clients[id]["lastPing"] = Date.now();
    ioServer.emit("ping", id);
  }, 1000);
}

function registerRequestHandler(socket) {
  let newClient = {
    id: shortUuidGenerate(),
    name: "",
  };
  console.debug("SERVER >>> registerResponse", newClient);
  socket.emit("registerResponse", newClient);

  registerUpdateHandler(socket, newClient);
}

function registerUpdateHandler(socket, registerUpdate) {
  console.debug("SERVER <<< registerUpdate", registerUpdate);
  clients[registerUpdate.id] = registerUpdate;
  pingHandler(registerUpdate.id);
  sendClients(socket);
}

ioServer.on("connection", (socket) => {
  // emitReset(socket);
  emitTimestamps(socket);
  sendClients(socket);

  socket.on("buzz", function (payload) {
    buzzHandler(socket, payload);
  });

  socket.on("reset", function () {
    resetHandler(socket);
  });

  socket.on("registerRequest", function () {
    console.debug("SERVER <<< registerRequest");
    registerRequestHandler(socket);
  });

  socket.on("registerUpdate", function (registerUpdate) {
    registerUpdateHandler(socket, registerUpdate);
  });

  socket.on("pong", function (id) {
    console.debug("SERVER <<< pong", id);
    let now = Date.now();
    clients[id]["latency"] = (now - clients[id]["lastPing"]) / 2;
    sendClients(socket);
  });
});

function compareTimestamps(a, b) {
  const timestampA = a.clientTimestamp;
  const timestampB = b.clientTimestamp;

  let comparison = 0;
  if (timestampA > timestampB) {
    comparison = 1;
  } else if (timestampA < timestampB) {
    comparison = -1;
  }
  return comparison;
}

function populateOffsets(timestampList) {
  if (Array.isArray(timestampList) && timestampList.length) {
    // Has to be sorted first!
    const firstTimestamp = timestampList[0].clientTimestamp;

    timestampList.forEach((timestamp) => {
      timestamp.offset = timestamp.clientTimestamp - firstTimestamp;
    });
  }
}
