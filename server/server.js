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

// Use TLS - https://expressjs.com/en/advanced/best-practice-security.html#prevent-brute-force-attacks-against-authorization

// Use Helmet (and others) - https://expressjs.com/en/advanced/best-practice-security.html#prevent-brute-force-attacks-against-authorization

// 5) GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json(err.message);
});

// 6) START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
