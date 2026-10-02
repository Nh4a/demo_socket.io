const express = require("express");
const { Server } = require("socket.io");
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  const p = path.join(__dirname, "public", "index.html");
  res.sendFile(p);
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle new messages
  socket.on("chat message", (msg) => {
    console.log("Message received:", msg);
    // Broadcast the message to all connected clients
    io.emit("chat message", {
      message: msg,
      username: socket.username,
      id: socket.id,
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  //user joined
  socket.on("join", (data) => {
    console.log(`${data.username} joined the chat`);
    socket.username = data.username;
    socket.id = data.id;
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
