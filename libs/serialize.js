// Helper function to serialize Mongoose documents for client components
export const serializePost = (post) => {
  return {
    _id: post._id.toString(),
    title: post.title,
    description: post.description || "",
    boardId: post.boardId.toString(),
    userId: post.userId?.toString() || null,
    votesCounter: post.votesCounter || 0,
    voters: post.voters ? post.voters.map((voter) => voter.toString()) : [],
    createdAt: post.createdAt?.toISOString() || null,
    updatedAt: post.updatedAt?.toISOString() || null,
  };
};

export const serializeBoard = (board) => {
  return {
    _id: board._id.toString(),
    name: board.name,
    userId: board.userId?.toString() || null,
    createdAt: board.createdAt?.toISOString() || null,
    updatedAt: board.updatedAt?.toISOString() || null,
  };
};
