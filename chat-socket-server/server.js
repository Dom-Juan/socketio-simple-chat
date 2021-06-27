const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io"); 

//Setup do port que o server de backend vai rodar.
const PORT = 3030;
const NEW_MESSAGE_EVENT = 'new-message-event';

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
  cors: true,
  origins:["localhost:3000"]
});

app.use(cors());

const room = 'general';

io.on("connection", (socket) => {
  socket.join(room,() => {
    console.log("User joined the room.");
  });

  socket.on(NEW_MESSAGE_EVENT, (data) => {
    io.in(room).emit(NEW_MESSAGE_EVENT, data);
  });

  socket.on("disconnect", () => {
    console.log("User left the room.");
    socket.leave(room);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port: *:${PORT}`);
});

