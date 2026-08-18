import Conversation from "../models/Conversation.js";

import { createMessage } from "../services/message.service.js";
import { getUserSocketId } from "./onlineUsers.js";

export const registerMessageHandlers = (io, socket) => {
  socket.on("send_message", async ({ conversationId, text }) => {
    try {
      // Basic validation
      if (!conversationId || !text?.trim()) {
        return socket.emit("message_error", {
          message: "Conversation ID and message text are required.",
        });
      }

      // Find conversation
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return socket.emit("message_error", {
          message: "Conversation not found.",
        });
      }

      // Find the other participant
      const receiverId = conversation.participants.find(
        (participant) => participant.toString() !== socket.user.id.toString(),
      );

      if (!receiverId) {
        return socket.emit("message_error", {
          message: "Receiver not found.",
        });
      }

      const message = await createMessage(socket.user.id, conversationId, text);

      // Confirm message to sender
      socket.emit("message_sent", message);

      // Find receiver's socket
      const receiverSocketId = getUserSocketId(receiverId);

      // Receiver is offline
      if (!receiverSocketId) {
        return;
      }

      // Send message to receiver
      io.to(receiverSocketId).emit("receive_message", message);
    } catch (error) {
      console.error("Socket send_message error:", error);

      socket.emit("message_error", {
        message: error.message || "Failed to send message.",
      });
    }
  });
};
