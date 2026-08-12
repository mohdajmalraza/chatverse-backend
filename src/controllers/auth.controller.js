import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import { cookieOptions } from "../utils/cookieOptions.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const { user, token } = await registerUser({
      name,
      email,
      password,
    });

    res.cookie("token", token, cookieOptions);

    return res.status(201).json(
      new ApiResponse(201, "User registered successfully", {
        user,
      }),
    );
  } catch (error) {
    next(error);
  }
};

// export const register = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;

//   const data = await registerUser({
//     name,
//     email,
//     password,
//   });

//   return res
//     .status(201)
//     .json(new ApiResponse(201, "User registered successfully", data));
// });

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser({
      email,
      password,
    });

    res.cookie("token", token, cookieOptions);

    return res.status(200).json(
      new ApiResponse(200, "Login successful", {
        user,
      }),
    );
  } catch (error) {
    next(error);
  }
};

// export const login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const data = await loginUser({
//     email,
//     password,
//   });

//   return res.status(200).json(new ApiResponse(200, "Login successful", data));
// });

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(200).json(new ApiResponse(200, "Logged out successfully"));
};

/**
 * @route   GET /api/auth/profile
 * @desc    Get logged-in user profile
 * @access  Private
 */
export const profile = async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user.id);

    return res
      .status(200)
      .json(new ApiResponse(200, "User profile fetched successfully", user));
  } catch (error) {
    next(error);
  }
};

// export const profile = asyncHandler(async (req, res) => {
//   const data = await getUserProfile(req.user.id);

//   return res
//     .status(200)
//     .json(new ApiResponse(200, "User profile fetched successfully", data));
// });
