const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }, // Allow all origins (safe for your use case)
  transports: ['websocket'] // Force WebSockets for lowest latency (no polling fallback)
});

// Serve static files (your frontend)
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  // Join a room from URL param (e.g., ?room=ourwhiteboard)
  socket.on('joinRoom', ({ room }) => {
    socket.join(room);
    console.log(`🔵 User ${socket.id} joined room: ${room}`);
  });

  // Receive drawing data → broadcast to others in room
  socket.on('drawLine', ({ room, lineData }) => {
    socket.to(room).emit('drawLine', { lineData }); // Send to ALL except sender
  });

  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
