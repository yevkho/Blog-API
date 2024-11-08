// 1) IMPORT DEPENDENCIES
const express = require("express");
const path = require("path");
const cors = require("cors");

const indexRouter = require("./routes/indexRouter");
const postsRouter = require("./routes/postsRouter");

// 2) LAUNCH EXPRESS
const app = express();

// 3) MIDDLEWARE
// parse JSON
app.use(express.json());
// Body parser middleware
app.use(express.urlencoded({ extended: true }));
// allow CORS
app.use(cors()); // add {origin: url} for restricting access

// 4) ROUTES
app.use("/posts", postsRouter);
app.use("/", indexRouter); // prefix all routes for CRUD with api/...
// app.use("/user", userRouter) - potential dedicated user route to log in and sign up etc.

// mlw to perhaps generate error to send to error handler if none of the routes were hit
// app.use(function (req: Request, res: Response, next: NextFunction) {
//   next(createError(404));
// });

// 5) GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json(err.message);
});

// 6) START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
