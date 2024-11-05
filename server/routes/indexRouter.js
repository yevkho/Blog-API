const { Router } = require("express");
const { validationResult } = require("express-validator");
const validation = require("../config/formValidations");
const bcrypt = require("bcryptjs");
const db = require("../prisma/queries");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const indexRouter = Router();

// 1 SIGN UP NEW USER
indexRouter.post("/signup", validation.signUpForm, async (req, res, next) => {
  console.log("reached index POST route");
  // validation
  const errors = validationResult(req);
  console.log(errors.isEmpty());
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // after validation
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await db.createUser(username, email, hashedPassword);
    res.json({ success: true, user });
    // can implement jwt generation here already and send to client (see at 25:01 https://www.youtube.com/watch?v=Ne0tLHm1juE&list=PLYQSCk-qyTW2ewJ05f_GKHtTIzjynDgjK&index=10 )
  } catch (error) {
    next(error);
  }
});

// 2 LOGIN
indexRouter.post("/login", async (req, res) => {
  let { username, password } = req.body;
  // Authenticate User (check request.body user & password against User db)
  try {
    // 1 - get user from db
    const user = await db.getUserByName(username);
    // 2 - if no user found in db return 401 (unauthorized)
    if (!user) {
      console.log("Incorrect username");
      return res.status(401).json({ message: "Incorrect user name" });
    }
    // 3 - if user exists check the password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // 4 - if no passwords match return 401 (unauthorized)
      console.log("Incorrect password");
      return res.status(401).json({ message: "Incorrect password" });
    }
    // 5 - if user & password successfully authenticated then generate & send JWT to user
    console.log("successful authentication");
    const payload = { sub: user.id };

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "120s", // or "1d"
    });

    res.status(200).json({
      message: "Authentication passed and sent to user browser",
      success: true,
      user: { userId: user.id, username: user.username },
      token: "Bearer " + token,
      // set expiration to manage authentication on front-end
    });
  } catch (err) {
    // if any errors along the way (e.g., db issues)
    console.log("un-successful authentication");
    return res.status(500).json({ message: "Authentication Failed" });
  }
});

// 3 LOGOUT
// indexRouter.get("/logout", indexController.logOutUser);
// When the user logs out, you can have the client remove the JWT from storage.

module.exports = indexRouter;