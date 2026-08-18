const onlineUsers = new Map();

export const addOnlineUser = (userId, socketId) => {
  onlineUsers.set(userId.toString(), socketId);
};

export const removeOnlineUser = (userId) => {
  onlineUsers.delete(userId.toString());
};

export const getUserSocketId = (userId) => {
  return onlineUsers.get(userId.toString());
};
