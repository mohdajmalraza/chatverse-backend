import jwt from "jsonwebtoken";

export const socketAuthMiddleware = (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("Authentication required"));
    }

    const tokenCookie = cookieHeader
      .split("; ")
      .find((cookie) => cookie.startsWith("token="));

    if (!tokenCookie) {
      return next(new Error("Authentication required"));
    }

    // const token = tokenCookie.split("=")[1]; OR
    const token = tokenCookie.slice("token=".length);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = {
      id: decoded.id,
    };

    next();
  } catch (error) {
    next(new Error("Invalid or expired token"));
  }
};

// import jwt from "jsonwebtoken";
// import { ApiError } from "../utils/ApiError.js";

// export const socketAuthMiddleware = (socket, next) => {
//   try {
//     const token = socket.handshake.headers.cookie
//       ?.split("; ")
//       .find((cookie) => cookie.startsWith("token="))
//       ?.split("=")[1];

//     if (!token) {
//       return next(new Error("Authentication required"));
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     socket.user = {
//       id: decoded.id,
//     };

//     next();
//   } catch (error) {
//     next(new Error("Invalid or expired token"));
//   }
// };
