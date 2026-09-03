import Conversation from "../models/Conversation.js";

import { createMessage } from "../services/message.service.js";
import { getReceiverId } from "./socket.utils.js";

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

      // Verify sender belongs to conversation
      const isParticipant = conversation.participants.some(
        (participant) => participant.toString() === socket.user.id.toString(),
      );

      if (!isParticipant) {
        return socket.emit("message_error", {
          message: "You are not a participant of this conversation.",
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

      // Send message to everyone else inside this conversation room
      socket
        .to(`conversation:${conversationId}`)
        .emit("receive_message", message);
    } catch (error) {
      console.error("Socket send_message error:", error);

      socket.emit("message_error", {
        message: error.message || "Failed to send message.",
      });
    }
  });

  // Typing started
  socket.on("typing:start", ({ conversationId }) => {
    if (!conversationId) {
      return;
    }

    socket
      .to(`conversation:${conversationId}`)
      .emit("typing:start", { conversationId, userId: socket.user.id });
  });

  // Typing stopped
  socket.on("typing:stop", ({ conversationId }) => {
    if (!conversationId) {
      return;
    }

    socket.to(`conversation:${conversationId}`).emit("typing:stop", {
      conversationId,
      userId: socket.user.id,
    });
  });

  // Typing started
  // socket.on("typing:start", async ({ conversationId }) => {
  //   try {
  //     if (!conversationId) {
  //       return;
  //     }

  //     const conversation = await Conversation.findById(conversationId);

  //     if (!conversation) {
  //       return;
  //     }

  //     const isParticipant = conversation.participants.some(
  //       (participant) => participant.toString() === socket.user.id.toString(),
  //     );

  //     if (!isParticipant) {
  //       return;
  //     }

  //     socket.to(`conversation:${conversationId}`).emit("typing:start", {
  //       conversationId,
  //       userId: socket.user.id,
  //     });
  //   } catch (error) {
  //     console.error("Socket typing:start error:", error);
  //   }
  // });

  // Typing stopped
  // socket.on("typing:stop", async ({ conversationId }) => {
  //   try {
  //     if (!conversationId) {
  //       return;
  //     }

  //     const conversation = await Conversation.findById(conversationId);

  //     if (!conversation) {
  //       return;
  //     }

  //     const isParticipant = conversation.participants.some(
  //       (participant) => participant.toString() === socket.user.id.toString(),
  //     );

  //     if (!isParticipant) {
  //       return;
  //     }

  //     socket.to(`conversation:${conversationId}`).emit("typing:stop", {
  //       conversationId,
  //       userId: socket.user.id,
  //     });
  //   } catch (error) {
  //     console.error("Socket typing:stop error:", error);
  //   }
  // });
};
