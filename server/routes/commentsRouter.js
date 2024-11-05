const { Router } = require("express");
const commentsController = require("../controllers/commentsController");

const commentsRouter = Router({ mergeParams: true });

// CREATE
commentsRouter.post("/", commentsController.createComment);

// UPDATE
commentsRouter.put("/:commentId", commentsController.updateComment);

// DELETE
commentsRouter.delete("/:commentId", commentsController.deleteComment);

module.exports = commentsRouter;
