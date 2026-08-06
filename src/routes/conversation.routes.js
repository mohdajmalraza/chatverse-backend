import express from "express";

import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";

import { createConversationValidation } from "../validations/conversation.validation.js";
import { createConversation } from "../controllers/conversation.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  validate(createConversationValidation),
  createConversation,
);

export default router;
