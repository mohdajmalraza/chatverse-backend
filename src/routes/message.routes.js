import express from "express";

import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";

import { sendMessageValidation } from "../validations/message.validation.js";
import { sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", protect, validate(sendMessageValidation), sendMessage);

export default router;
