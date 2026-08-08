import ApiResponse from "../utils/ApiResponse.js";
import {
  createOrGetConversation,
  findUserConversations,
} from "../services/conversation.service.js";

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

export const getUserConversations = async (req, res, next) => {
  try {
    const conversations = await findUserConversations(req.user.id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Conversations fetched successfully.",
          conversations,
        ),
      );
  } catch (error) {
    next(error);
  }
};
