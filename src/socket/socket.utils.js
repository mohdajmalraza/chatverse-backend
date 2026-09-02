import { getUserSocketIds } from "./onlineUsers.js";

export const getReceiverId = (conversation, currentUserId) => {
  if (!conversation?.participants?.length || !currentUserId) {
    return null;
  }

  const receiverId = conversation.participants.find(
    (participant) => participant.toString() !== currentUserId.toString(),
  );

  return receiverId || null;
};

export const emitToUser = (io, userId, event, data) => {
  const socketIds = getUserSocketIds(userId);

  socketIds.forEach((socketId) => {
    io.to(socketId).emit(event, data);
  });

  return socketIds.size > 0;
};
