const db = require("../prisma/queries");

// 1
const getAllPosts = async (req, res) => {
  // TEST user serialization - remove at production
  console.log(`serialized user object ${req.user}`);
  // TEST user serialization
  const allPosts = await db.getPosts();
  res.json(allPosts);
};

// 2
const getPostById = async (req, res) => {
  const { postId } = req.params;
  const post = await db.getPost(postId);
  res.json(post);
};

// 3
const createPost = async (req, res, next) => {
  console.log("reached Post's POST route");
  const { title, content } = req.body;
  const authorId = req.user.id; // Use authenticated user's ID (security)
  try {
    const post = await db.createPost(title, content, authorId);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

// 4
const updatePost = async (req, res) => {
  console.log("reached PUT route");
  const { postId } = req.params;
  const { title, content } = req.body;
  const authorId = req.user.id; // Use authenticated user's ID (security)

  const post = await db.updatePost(postId, title, content, authorId);
  res.json({ post });
};

// 5
const deletePost = async (req, res) => {
  console.log("reached DELETE route");
  const { postId } = req.params;

  const post = await db.deletePost(postId);
  res.json({ post });
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
