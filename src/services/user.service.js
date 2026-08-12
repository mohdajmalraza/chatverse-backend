import User from "../models/User.js";

export const findUsers = async (search, currentUserId) => {
  const users = await User.find({
    _id: {
      $ne: currentUserId,
    },
    $or: [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ],
  })
    .select("-password")
    .limit(20)
    .sort({ name: 1 });

  return users;
};
