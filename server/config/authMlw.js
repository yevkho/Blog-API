require("dotenv").config();
const jwt = require("jsonwebtoken");

// 1 MANUAL
// extract token from the request & verify it (can use passport-jwt)
function checkJWT(req, res, next) {
  console.log(req.headers);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);

  // if no token passed
  if (token == undefined) {
    return res.status(401).json({ error: "Login required" });
  }
  // if token passed - verify it (used by passport-jwt underneath the hood)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    // if success than (1) the data has not been tempered with, and (2) the user is valid
    if (err)
      return res.status(403).json({
        error:
          "e.g., JWT was tempered with or Wrong key to decode or Authorization expired",
      }); // you have a token but it is not (longer) valid
    // if token is valid proceed to decoding the jwt and pass stored metadata to 'payload'
    // can pull the full user object from db here and attach to req.user
    req.user = payload; // we 'deserialize' user into req.user to use in our routes
    next();
  });
}

module.exports = { checkJWT };
