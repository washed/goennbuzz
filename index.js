var port = process.env.PORT || 3000,
  express = require("express"),
  app = require("express")(),
  http = require("http").createServer(app),
  io = require("socket.io")(http),
  timesyncServer = require("timesync/server");

var TIMESTAMPS = [];

// Make static content available
app.use("/static", express.static(__dirname + "/static"));

// handle GET
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/html/index.html");
});

app.get("/host/", function (req, res) {
  res.sendFile(__dirname + "/html/host.html");
});

app.get("/join/", function (req, res) {
  res.sendFile(__dirname + "/html/join.html");
});

// handle timesync requests
app.use("/timesync", timesyncServer.requestHandler);

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

io.on("connection", function (socket) {
  // handle user connect
  console.log("a user connected");

  socket.emit("reset");

  // Send timestamps to the clients
  io.emit("timestampList", TIMESTAMPS);

  io.clients((error, clients) => {
    if (error) throw error;
    console.log(clients);
  });

  // handle disconnect
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

io.on("connection", function (socket) {
  socket.on("timestamp", function ([clientName, clientTimestamp]) {
    const serverTimestamp = Date.now();
    TIMESTAMPS.push({
      clientName: clientName,
      clientTimestamp: clientTimestamp,
      serverTimestamp: serverTimestamp,
      offset: 0,
    });

    TIMESTAMPS.sort(compareTimestamps);

    populateOffsets(TIMESTAMPS);

    TIMESTAMPS.forEach((timestamp) => {
      console.log(timestamp);
    });

    // Send timestamps to the clients
    io.emit("timestampList", TIMESTAMPS);
  });
});

io.on("connection", function (socket) {
  socket.on("reset", function () {
    TIMESTAMPS = [];

    // Reset the clients
    io.emit("reset");

    console.log("RESET!");
  });
});

http.listen(port, function () {
  console.log("listening on *:" + port.toString());
});
