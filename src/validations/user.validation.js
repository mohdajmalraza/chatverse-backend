import ApiError from "../utils/ApiError.js";

export const searchUsersValidation = (req) => {
  const { q } = req.query;

  if (!q) {
    throw new ApiError(400, "Search query is required.");
  }

  const search = q.trim();

  if (search.length < 2) {
    throw new ApiError(400, "Search query must be at least 2 characters long.");
  }

  if (search.length > 50) {
    throw new ApiError(400, "Search query cannot exceed 50 characters.");
  }
};
