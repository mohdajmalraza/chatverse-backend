export const formatConversation = (conversation, userId) => {
  const receiver = conversation.participants.find(
    (participant) => participant._id.toString() !== userId.toString(),
  );

  return {
    conversationId: conversation._id,
    receiver,
    lastMessage: conversation.lastMessage,
    updatedAt: conversation.updatedAt,
  };
};
