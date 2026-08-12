import express from "express";

import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";

import { searchUsers } from "../controllers/user.controller.js";

import { searchUsersValidation } from "../validations/user.validation.js";

const router = express.Router();

router.get("/search", protect, validate(searchUsersValidation), searchUsers);

export default router;
