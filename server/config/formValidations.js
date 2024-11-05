const { body } = require("express-validator");

const signUpForm = [
  body("username").trim(),
  // custom validator to check if username already exists (query db)
  body("email")
    .trim()
    .isEmail()
    .withMessage("Username must be a valid e-mail address"),
  // custom validator to check if email already exists (query db)
  body("password").trim(),
  // .isLength({ min: 8 })
  // .withMessage("Password should be 8 characters long.")
  // .matches(/[A-Z]/)
  // .withMessage("Password must contain at least one uppercase letter.")
  // .matches(/[0-9]/)
  // .withMessage("Password must contain at least one number.")
  // .matches(/[@$!%*?&]/)
  // .withMessage("Password must contain at least one special character."),
  body("repeatpassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm password should not be empty.")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("passwords must match."),
];

module.exports = { signUpForm };
