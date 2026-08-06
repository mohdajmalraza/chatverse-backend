import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

export const sendMessageValidation = (body = {}) => {
  const { conversationId, text } = body;

  if (!conversationId) {
    throw new ApiError(400, "Conversation ID is required.");
  }

  if (typeof conversationId !== "string") {
    throw new ApiError(400, "Conversation ID must be a string.");
  }

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new ApiError(400, "Invalid conversation ID.");
  }

  if (!text) {
    throw new ApiError(400, "Message text is required.");
  }

  if (typeof text !== "string") {
    throw new ApiError(400, "Message text must be a string.");
  }

  if (!text.trim()) {
    throw new ApiError(400, "Message cannot be empty.");
  }
};
