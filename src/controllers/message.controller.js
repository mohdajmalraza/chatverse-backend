import ApiResponse from "../utils/ApiResponse.js";

import {
  createMessage,
  findMessageHistory,
} from "../services/message.service.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, text } = req.body;

    const message = await createMessage(req.user.id, conversationId, text);

    return res
      .status(201)
      .json(new ApiResponse(201, "Message sent successfully.", message));
  } catch (error) {
    next(error);
  }
};

export const getMessageHistory = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const messages = await findMessageHistory(req.user.id, conversationId);

    return res
      .status(200)
      .json(new ApiResponse(200, "messages fetched successfully.", messages));
  } catch (error) {
    next(error);
  }
};
