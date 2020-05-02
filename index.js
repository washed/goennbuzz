var port = process.env.PORT || 3000,
  express = require("express"),
  app = require("express")(),
  http = require("http").createServer(app),
  io = require("socket.io")(http),
  timesyncServer = require("timesync/server");

var TIMESTAMPS = [];
var TEAM_STRING = "";
var TEAM_NAMES = "";
var TEAM_COUNT = 0;

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

  console.log("SERVER>toall: 'reset'");
  socket.emit("reset");

  // Send timestamps to the clients
  console.log("SERVER>toall: 'timestampList':" + TIMESTAMPS);
  io.emit("timestampList", TIMESTAMPS);

  // Send teams to the clients
  console.log("SERVER>toall: 'teamstringJoin':" + TEAM_STRING);
  io.emit("teamstringJoin", [TEAM_STRING]);

  // Send team builder inputs to the host on reconnect
  console.log("SERVER>toall: 'teamstringNamesHost':" + TEAM_NAMES);
  io.emit("teamstringNamesHost", [TEAM_NAMES]);

  console.log("SERVER>toall: 'teamstringTeamCountHost':" + TEAM_COUNT);
  io.emit("teamstringTeamCountHost", [TEAM_COUNT]);

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
    console.log(
      "SERVER>fromclient: 'timestamp':" + [clientName, clientTimestamp]
    );

    const serverTimestamp = Date.now();
    TIMESTAMPS.push({
      clientName: clientName,
      clientTimestamp: clientTimestamp,
      serverTimestamp: serverTimestamp,
      offset: 0,
    });

    TIMESTAMPS.sort(compareTimestamps);

    // populateOffsets(TIMESTAMPS);

    TIMESTAMPS.forEach((timestamp) => {
      console.log(timestamp);
    });

    // Send timestamps to the clients
    console.log("SERVER>toall: 'timestampList':" + TIMESTAMPS);
    io.emit("timestampList", TIMESTAMPS);
  });
});

io.on("connection", function (socket) {
  socket.on("teamstringHost", function ([teamstringHost]) {
    console.log("SERVER>fromhost: 'teamstringHost':" + teamstringHost);

    TEAM_STRING = teamstringHost;

    // Send the new teamString to the clients
    console.log("SERVER>toall: 'teamstringJoin':" + TEAM_STRING);
    io.emit("teamstringJoin", [TEAM_STRING]);
  });

  socket.on("teamstringNames", function ([teamstringNames]) {
    console.log("SERVER>fromhost: 'teamstringNames':" + teamstringNames);

    TEAM_NAMES = teamstringNames;
    console.log("Received from host: " + TEAM_NAMES);

    console.log("SERVER>toall: 'teamstringNamesHost':" + TEAM_NAMES);
    io.emit("teamstringNamesHost", [TEAM_NAMES]);
  });

  socket.on("teamstringTeamCount", function ([teamstringTeamCount]) {
    console.log(
      "SERVER>fromhost: 'teamstringTeamCount':" + teamstringTeamCount
    );

    TEAM_COUNT = teamstringTeamCount;
    console.log("Received from host: " + TEAM_COUNT);

    console.log("SERVER>toall: 'teamstringTeamCountHost':" + TEAM_COUNT);
    io.emit("teamstringTeamCountHost", [TEAM_COUNT]);
  });
});

io.on("connection", function (socket) {
  socket.on("reset", function () {
    console.log("SERVER>fromhost: 'reset'");

    TIMESTAMPS = [];

    // Reset the clients
    console.log("SERVER>toall: 'reset'");
    io.emit("reset");
  });
});

http.listen(port, function () {
  console.log("listening on *:" + port.toString());
});
