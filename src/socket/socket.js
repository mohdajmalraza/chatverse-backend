import { Server } from "socket.io";

import { socketAuthMiddleware } from "./socketAuth.js";
import { addOnlineUser, removeOnlineUser } from "./onlineUsers.js";
import { registerMessageHandlers } from "./message.socket.js";

export const initializeSocket = (server) => {
  // Create Socket.IO server
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  // Socket authentication middleware
  io.use(socketAuthMiddleware);

  // Socket.IO connection
  io.on("connection", (socket) => {
    console.log(
      "Authenticated socket connected:",
      socket.user.id,
      "socket:",
      socket.id,
    );

    addOnlineUser(socket.user.id, socket.id);

    registerMessageHandlers(io, socket);

    socket.on("disconnect", () => {
      removeOnlineUser(socket.user.id);

      console.log("Socket disconnected:", socket.user.id, "socket:", socket.id);
    });
  });

  return io;
};
