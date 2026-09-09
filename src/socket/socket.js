import { Server } from "socket.io";

import { socketAuthMiddleware } from "./socketAuth.js";
import {
  addOnlineUser,
  getOnlineUserIds,
  removeOnlineUser,
} from "./onlineUsers.js";
import Conversation from "../models/Conversation.js";
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
      socket.broadcast.emit("user_online", {
        userId: socket.user.id,
      });
    }

    // Conversation Rooms
    socket.on("conversation:join", async (conversationId) => {
      try {
        if (!conversationId) {
          return;
        }

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
          socket.emit("conversation:error", {
            message: "Conversation not found.",
          });

          return;
        }

        const isParticipant = conversation.participants.some(
          (participant) => participant.toString() === socket.user.id.toString(),
        );

        if (!isParticipant) {
          socket.emit("conversation:error", {
            message: "You are not a participant of this conversation.",
          });

          return;
        }

        const roomName = `conversation:${conversationId}`;

        await socket.join(roomName);

        console.log(`Socket ${socket.id} joined room ${roomName}`);
      } catch (error) {
        console.error("Socket conversation:join error:", error);

        socket.emit("conversation:error", {
          message: "Failed to join conversation.",
        });
      }
    });

    // Register message handlers
    registerMessageHandlers(io, socket);

    socket.on("disconnect", () => {
      const becameOffline = removeOnlineUser(socket.user.id, socket.id);

      console.log("Socket disconnected:", socket.user.id, "socket:", socket.id);

      // User has no remaining active connections
      if (becameOffline) {
        socket.broadcast.emit("user_offline", {
          userId: socket.user.id,
        });
      }
    });
  });

  return io;
};
