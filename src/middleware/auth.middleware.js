import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// const protect = async (req, res, next) => {
//   try {
//     // Get token from Authorization header
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       throw new ApiError(401, "Access denied. No token provided.");
//     }

//     // Extract token
//     const token = authHeader.split(" ")[1];

//     // Verify token
//     let decoded;

//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (error) {
//       if (error.name === "TokenExpiredError") {
//         throw new ApiError(401, "Token has expired.");
//       }

//       throw new ApiError(401, "Invalid token.");
//     }

//     // Find user
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       throw new ApiError(404, "User not found.");
//     }

//     // Attach authenticated user to request
//     req.user = {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//     };

//     next();
//   } catch (error) {
//     if (error instanceof ApiError) {
//       return next(error);
//     }

//     return next(new ApiError(500, "Internal server error."));
//   }
// };

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new ApiError(401, "Authentication required.");
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new ApiError(401, "Token has expired.");
      }

      throw new ApiError(401, "Invalid token.");
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};

// const protect = asyncHandler(async (req, res, next) => {
//   // Get token from Authorization header
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     throw new ApiError(401, "Access denied. No token provided.");
//   }

//   // Extract token
//   const token = authHeader.split(" ")[1];

//   // Verify token
//   let decoded;

//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET);
//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       throw new ApiError(401, "Token has expired.");
//     }

//     throw new ApiError(401, "Invalid token.");
//   }

//   // Find user
//   const user = await User.findById(decoded.id).select("-password");

//   if (!user) {
//     throw new ApiError(404, "User not found.");
//   }

//   // Attach authenticated user to request
//   req.user = {
//     id: user._id,
//     name: user.name,
//     email: user.email,
//   };

//   next();
// });

export default protect;
