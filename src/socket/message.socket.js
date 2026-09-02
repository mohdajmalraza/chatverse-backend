import Conversation from "../models/Conversation.js";

import { createMessage } from "../services/message.service.js";
import { emitToUser, getReceiverId } from "./socket.utils.js";

export const registerMessageHandlers = (io, socket) => {
  // Send message
  socket.on("send_message", async ({ conversationId, text }) => {
    try {
      if (!conversationId || !text?.trim()) {
        return socket.emit("message_error", {
          message: "Conversation ID and message text are required.",
        });
      }

      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return socket.emit("message_error", {
          message: "Conversation not found.",
        });
      }

      // Find the other participant
      const receiverId = getReceiverId(conversation, socket.user.id);

      if (!receiverId) {
        return socket.emit("message_error", {
          message: "Receiver not found.",
        });
      }

      const message = await createMessage(socket.user.id, conversationId, text);

      // Confirm message to sender
      socket.emit("message_sent", message);

      // Send message too receiver's active sockets
      emitToUser(io, receiverId, "receive_message", message);
    } catch (error) {
      console.error("Socket send_message error:", error);

      socket.emit("message_error", {
        message: error.message || "Failed to send message.",
      });
    }
  });

  // Typing started
  socket.on("typing:start", async ({ conversationId }) => {
    try {
      if (!conversationId) {
        return;
      }

      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return;
      }

      const receiverId = getReceiverId(conversation, socket.user.id);

      if (!receiverId) {
        return;
      }

      emitToUser(io, receiverId, "typing:start", {
        conversationId,
        userId: socket.user.id,
      });
    } catch (error) {
      console.error("Socket typing:start error:", error);
    }
  });

  // Typing stopped
  socket.on("typing:stop", async ({ conversationId }) => {
    try {
      if (!conversationId) {
        return;
      }

      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return;
      }

      const receiverId = getReceiverId(conversation, socket.user.id);

      if (!receiverId) {
        return;
      }

      emitToUser(io, receiverId, "typing:stop", {
        conversationId,
        userId: socket.user.id,
      });
    } catch (error) {
      console.error("Socket typing:stop error:", error);
    }
  });
};
