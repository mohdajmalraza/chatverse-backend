import express from "express";

import { register, login, profile } from "../controllers/auth.controller.js";

import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";

import {
  validateRegister,
  validateLogin,
} from "../validations/auth.validation.js";

const router = express.Router();

router.post("/register", validate(validateRegister), register);

router.post("/login", validate(validateLogin), login);

router.get("/profile", protect, profile);

export default router;
