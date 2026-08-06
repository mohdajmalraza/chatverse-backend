import { createMessage } from "../services/message.service.js";
import ApiResponse from "../utils/ApiResponse.js";

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
