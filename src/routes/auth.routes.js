import express from "express";

import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";

import {
  register,
  login,
  profile,
  logout,
} from "../controllers/auth.controller.js";

import {
  validateRegister,
  validateLogin,
} from "../validations/auth.validation.js";

const router = express.Router();

router.post("/register", validate(validateRegister), register);

router.post("/login", validate(validateLogin), login);

router.post("/logout", logout);

router.get("/profile", protect, profile);

export default router;
