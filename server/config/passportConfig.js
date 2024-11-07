const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const db = require("../prisma/queries");

// ADVANCED JWT-PASSPORT STRATEGY & REFRESH TOKENS & REACT
// JWT Authentication | Node JS and Express tutorials for Beginners: https://www.youtube.com/watch?v=favjC6EKFgw
// React Login Authentication with JWT Access, Refresh Tokens, Cookies and Axios: https://www.youtube.com/watch?v=nI8PYZNFtac&t=2396s
// Authentication in React with JWTs, Access & Refresh Tokens (Complete Tutorial): https://www.youtube.com/watch?v=AcYF18oGn6Y&t=15s

// 2 PASSPORT
// 1) create new jwt authentication strategy
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
  // audience: 'yoursite.net';
};

const strategy = new JwtStrategy(options, async (payload, done) => {
  console.log(`payload object`);
  console.log(payload);
  // automatically uses jsonwebtoken library to verify received token and if so passes the payload object (so here we already know our JWT is valid)
  try {
    const user = await db.getUserById(payload.sub);

    if (user) {
      // if (user.admin) ... for ADMIN logic // Since you have a role field, consider implementing RBAC within your strategy or as middleware to protect admin routes.
      return done(null, user); // passport will deserialize it to req.user
    } else {
      return done(null, false); // if no user found in db
    }
  } catch (error) {
    return done(error, null);
  }
});

// 2) connect strategy to the passport framework
passport.use(strategy);

module.exports = passport;

// require("./config/passportConfig") - where need to call passport authentication on a route

// passport.authenticate('jwt', { session: false }) - call mlw to protect a route
