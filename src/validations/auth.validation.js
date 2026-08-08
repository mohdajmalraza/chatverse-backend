import ApiError from "../utils/ApiError.js";

export const validateRegister = (req) => {
  const { name, email, password } = req.body;

  if (!name?.trim()) {
    throw new ApiError(400, "Name is required");
  }

  if (!email?.trim()) {
    throw new ApiError(400, "Email is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }
};

export const validateLogin = (req) => {
  const { email, password } = req.body;

  if (!email?.trim()) {
    throw new ApiError(400, "Email is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }
};
