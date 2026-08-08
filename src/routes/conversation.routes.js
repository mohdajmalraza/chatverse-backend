import express from "express";

import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";

import { createConversationValidation } from "../validations/conversation.validation.js";
import {
  createConversation,
  getUserConversations,
} from "../controllers/conversation.controller.js";

const router = express.Router();

// Create/Get Conversation API
router.post(
  "/",
  protect,
  validate(createConversationValidation),
  createConversation,
);

// Get User Conversations
router.get("/", protect, getUserConversations);

export default router;
