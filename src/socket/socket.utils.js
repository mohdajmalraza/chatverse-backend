export const getReceiverId = (conversation, currentUserId) => {
  if (!conversation?.participants?.length || !currentUserId) {
    return null;
  }

  const receiverId = conversation.participants.find(
    (participant) => participant.toString() !== currentUserId.toString(),
  );

  return receiverId || null;
};
