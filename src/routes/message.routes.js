import express from "express";

import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";

import {
  sendMessage,
  getMessageHistory,
} from "../controllers/message.controller.js";

import {
  sendMessageValidation,
  getMessageHistoryValidation,
} from "../validations/message.validation.js";

const router = express.Router();

router.post("/", protect, validate(sendMessageValidation), sendMessage);

router.get(
  "/:conversationId",
  protect,
  validate(getMessageHistoryValidation),
  getMessageHistory,
);

export default router;
