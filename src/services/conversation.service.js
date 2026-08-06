import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import ApiError from "../utils/ApiError.js";

export const createOrGetConversation = async (userId, receiverId) => {
  // User cannot chat with themselves
  if (userId.toString() === receiverId) {
    throw new ApiError(400, "You cannot start a conversation with yourself.");
  }

  // Check receiver exists
  const receiver = await User.findById(receiverId);

  if (!receiver) {
    throw new ApiError(404, "Receiver not found.");
  }

  // Find existing conversation
  const existingConversation = await Conversation.findOne({
    participants: {
      $all: [userId, receiverId],
    },
  }).populate("participants", "-password");

  if (existingConversation) {
    return {
      conversation: existingConversation,
      isNew: false,
    };
  }

  // Create new conversation
  const conversation = await Conversation.create({
    participants: [userId, receiverId],
  });

  await conversation.populate("participants", "-password");

  return {
    conversation,
    isNew: true,
  };
};
