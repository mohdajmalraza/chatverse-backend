import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

export const createConversationValidation = (req) => {
  const { receiverId } = req.body;

  // Check receiverId is provided
  if (!receiverId) {
    throw new ApiError(400, "Receiver Id is required.");
  }

  if (typeof receiverId !== "string") {
    throw new ApiError(400, "Receiver ID must be a string.");
  }

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    throw new ApiError(400, "Invalid receiver ID");
  }
};
