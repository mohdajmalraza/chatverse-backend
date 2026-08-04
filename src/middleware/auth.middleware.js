import jwt from "jsonwebtoken";
import User from "../models/User.js";

import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// const protect = async (req, res, next) => {
//   try {
//     // Get token from Authorization header
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return next(new ApiError(401, "Access denied. No token provided."));
//     }

//     // Extract token
//     const token = authHeader.split(" ")[1];

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Find user
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     // Attach user to request
//     req.user = {
//       id: user._id,
//       email: user.email,
//       name: user.name,
//     };

//     next();
//   } catch (error) {
//     next(new ApiError(401, "Invalid or expired token."));
//   }
// };

const protect = asyncHandler(async (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Access denied. No token provided.");
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  // Verify token
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token has expired.");
    }

    throw new ApiError(401, "Invalid token.");
  }

  // Find user
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Attach authenticated user to request
  req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
  };

  next();
});

export default protect;
