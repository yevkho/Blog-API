const { Router } = require("express");
const postsController = require("../controllers/postsController");
const commentsRouter = require("./commentsRouter");
const auth = require("../config/authMlw");

const passport = require("passport");
require("../config/passportConfig");

const postsRouter = Router();

// READ
postsRouter.get("/", postsController.getAllPosts);
// manual auth mlw
// postsRouter.get("/", auth.checkJWT, postsController.getAllPosts);
// using passport for auth
// postsRouter.get(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   postsController.getAllPosts
// );
postsRouter.get("/:postId", postsController.getPostById);

// CREATE
postsRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  auth.checkAdminStatus,
  postsController.createPost
);

// UPDATE
postsRouter.put(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  postsController.updatePost
);

// DELETE
postsRouter.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  postsController.deletePost
);

// COMMENTS TRANSITION
postsRouter.use(
  "/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  commentsRouter
);

// Implement authorization checks on the back end. In your route handlers or middleware,
// after verifying the user's identity with authentication (e.g., using Passport),
// check if the authenticated user's ID (req.user.id) matches the authorId of the post
// or if the user has an admin role. Only allow the update or delete operation if this
// condition is met. This ensures security, as back-end checks cannot be bypassed like
// front-end code (combined front end (display) and back-end authorization).

module.exports = postsRouter;
