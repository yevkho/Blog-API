const db = require("../prisma/queries");

// 1
const createComment = async (req, res) => {
  console.log("reached comment POST route");
  const { postId } = req.params;
  // const { content, authorId } = req.body;
  const { content } = req.body;
  const authorId = req.user.id; // Use authenticated user's ID (security)

  try {
    const comment = await db.createComment(content, authorId, postId);
    res.json(comment);
  } catch (error) {
    next(error);
  }
};

// 2
const updateComment = async (req, res) => {
  console.log("reached comment PUT route");
  const { commentId } = req.params;
  const { content } = req.body;

  console.log(commentId, content);

  const comment = await db.updateComment(commentId, content);

  res.json(comment);
};

// 3
const deleteComment = async (req, res) => {
  console.log("reached comment DELETE route");
  const { commentId } = req.params;

  const comment = await db.deleteComment(commentId);
  res.json({ comment });
};

module.exports = { createComment, updateComment, deleteComment };
