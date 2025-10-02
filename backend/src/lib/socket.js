import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174", 
      "http://localhost:5175",
      process.env.CLIENT_URL || "http://localhost:5173"
    ],
    credentials: true
  },
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
    }
//used to store online users {userId:socketId}
const userSocketMap={};
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);
  
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log('User ID ' + userId + ' is associated with socket ID ' + socket.id);

  }
    //io.emit is used to send message to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
    delete userSocketMap[userId];
  });

  // Add more event listeners as needed
});

export {io, app, server};