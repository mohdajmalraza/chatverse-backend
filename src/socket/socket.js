import { Server } from "socket.io";

import { socketAuthMiddleware } from "./socketAuth.js";
import {
  addOnlineUser,
  getOnlineUserIds,
  removeOnlineUser,
} from "./onlineUsers.js";
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

    // Send currently online users to the newly connected client.
    socket.emit("online_users", {
      userIds: getOnlineUserIds(),
    });

    const becameOnline = addOnlineUser(socket.user.id, socket.id);

    // User was previously offline
    if (becameOnline) {
      console.log("User is now online:", socket.user.id);

      socket.broadcast.emit("user_online", {
        userId: socket.user.id,
      });
    }

    // Register message handlers
    registerMessageHandlers(io, socket);

    socket.on("disconnect", () => {
      const becameOffline = removeOnlineUser(socket.user.id, socket.id);

      console.log("Socket disconnected:", socket.user.id, "socket:", socket.id);

      // User has no remaining active connections
      if (becameOffline) {
        console.log("User is now offline:", socket.user.id);

        socket.broadcast.emit("user_offline", {
          userId: socket.user.id,
        });
      }
    });
  });

  return io;
};
