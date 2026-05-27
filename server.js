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
  res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static("public"));

io.on("connection", (socket) => {
  players[socket.id] = {
  x: Math.random() * 700,
  y: Math.random() * 400
};

io.emit("state", players);

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
