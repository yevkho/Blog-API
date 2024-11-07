const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// 1 get all posts
async function getPosts() {
  const posts = await prisma.post.findMany();
  return posts;
}

// 2 get post by id
async function getPost(postId) {
  const posts = await prisma.post.findUnique({
    where: {
      id: parseInt(postId),
    },
    include: { author: true, comments: true },
  });
  return posts;
}

// 3 create new post
async function createPost(title, content, authorId) {
  const post = await prisma.post.create({
    data: {
      title: title,
      content: content,
      authorId: parseInt(authorId),
    },
  });
  return post;
}

// 4 update post
async function updatePost(postId, title, content, authorId) {
  const post = await prisma.post.update({
    where: {
      id: parseInt(postId),
    },
    data: {
      title: title,
      content: content,
      authorId: parseInt(authorId),
    },
  });
  return post;
}

// 5 delete post
async function deletePost(postId) {
  const post = await prisma.post.delete({
    where: {
      id: parseInt(postId),
    },
  });
  return post;
}

// 6 create new comment
async function createComment(content, authorId, postId) {
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: parseInt(authorId),
        postId: parseInt(postId),
      },
    });
    return comment;
  } catch (error) {
    throw new Error("Failed to create comment");
  }
}

// 7 update comment
async function updateComment(commentId, content) {
  try {
    const comment = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { content },
    });
    return comment;
  } catch (error) {
    res.status(500).json({ error: "Failed to update comment" });
  }
}

// 8 delete comment
async function deleteComment(commentId) {
  try {
    const post = await prisma.comment.delete({
      where: {
        id: parseInt(commentId),
      },
    });
    return post;
  } catch (error) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
}

// 9 create new user
async function createUser(username, email, hashedPassword) {
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });
  return user;
}

// 10 get user by name
async function getUserByName(username) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  return user;
}

// 11 get user by id
async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
}

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
  createUser,
  getUserByName,
  getUserById,
};
