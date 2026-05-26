const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

let players = {};

app.get("/", (req, res) => {
  res.send("Friends Game Server Running");
});

io.on("connection", (socket) => {
  players[socket.id] = { x: 100, y: 100 };

  socket.on("move", (data) => {
    players[socket.id] = data;
    io.emit("state", players);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
  });
});

server.listen(process.env.PORT, () => {
  console.log("Server running");
});