import ApiResponse from "../utils/ApiResponse.js";

import { findUsers } from "../services/user.service.js";

export const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;

    const users = await findUsers(q, req.user.id);

    return res
      .status(200)
      .json(new ApiResponse(200, "Users fetched successfully.", users));
  } catch (error) {
    next(error);
  }
};
