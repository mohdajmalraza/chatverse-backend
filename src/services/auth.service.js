import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import ApiError from "../utils/ApiError.js";
import { buildUserResponse } from "../utils/userResponse.js";

/**
 * Register a new user
 */
export const registerUser = async ({ name, email, password }) => {
  email = email.toLowerCase().trim();

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Generate JWT
  const token = generateToken(user._id);

  // Return user data without password
  return {
    user: buildUserResponse(user),
    token,
  };
};

/**
 * Login user
 */
export const loginUser = async ({ email, password }) => {
  email = email.toLowerCase().trim();

  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Compare password
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate JWT
  const token = generateToken(user._id);

  return {
    user: buildUserResponse(user),
    token,
  };
};

/**
 * Get logged-in user's profile
 */
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return { user: buildUserResponse(user) };
};
