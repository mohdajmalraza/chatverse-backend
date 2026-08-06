import { createOrGetConversation } from "../services/conversation.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createConversation = async (req, res, next) => {
  try {
    const { receiverId } = req.body;

    const { conversation, isNew } = await createOrGetConversation(
      req.user.id,
      receiverId,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          isNew
            ? "Conversation created successfully."
            : "Conversation fetched successfully.",
          conversation,
        ),
      );
  } catch (error) {
    next(error);
  }
};
