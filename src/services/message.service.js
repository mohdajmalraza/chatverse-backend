import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

import ApiError from "../utils/ApiError.js";

export const createMessage = async (senderId, conversationId, text) => {
  // Check conversation exists
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new ApiError(404, "Conversation not found.");
  }

  // Ensure sender belongs to this conversation
  const isParticipant = conversation.participants.some(
    (participant) => participant.toString() === senderId.toString(),
  );

  if (!isParticipant) {
    throw new ApiError(403, "You are not a participant in this conversation.");
  }

  // Create message
  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    text: text.trim(),
  });

  // Update last message
  conversation.lastMessage = message._id;
  await conversation.save();

  await message.populate("sender", "-password");

  return message;
};
