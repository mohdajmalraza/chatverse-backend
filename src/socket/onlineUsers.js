const onlineUsers = new Map();

export const addOnlineUser = (userId, socketId) => {
  const userKey = userId.toString();

  // User already has one or more active sockets
  if (onlineUsers.has(userKey)) {
    onlineUsers.get(userKey).add(socketId);
    return false;
  }

  // First active socket for this user
  onlineUsers.set(userKey, new Set([socketId]));

  return true;
};

export const removeOnlineUser = (userId, socketId) => {
  const userKey = userId.toString();

  const socketIds = onlineUsers.get(userKey);

  if (!socketIds) {
    return false;
  }

  socketIds.delete(socketId);

  // User still has another active conection
  if (socketIds.size > 0) {
    return false;
  }

  // No active connections remaining
  onlineUsers.delete(userKey);

  return true;
};

export const getUserSocketIds = (userId) => {
  return onlineUsers.get(userId.toString()) || new Set();
};

export const isUserOnline = (userId) => {
  return onlineUsers.has(userId.toString());
};

export const getOnlineUserIds = () => {
  return Array.from(onlineUsers.keys());
};
