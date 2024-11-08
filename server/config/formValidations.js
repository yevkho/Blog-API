const { body } = require("express-validator");

const signUpForm = [
  body("username").trim(),
  // custom validator to check if username already exists (query db) - https://github.com/erynder-z/code-blog-api/blob/main/controllers/signup_controller.ts; https://github.com/guskirb/blog-apiTOP/blob/main/controllers/authController.ts
  body("email")
    .trim()
    .isEmail()
    .withMessage("Username must be a valid e-mail address"),
  // custom validator to check if email already exists (query db)
  body("password").trim(),
  // .isStrongPassword() TBD - Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, one number, and one symbol
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
