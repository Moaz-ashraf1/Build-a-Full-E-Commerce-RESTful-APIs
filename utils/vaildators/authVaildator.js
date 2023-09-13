const { check } = require("express-validator");
const { default: slugify } = require("slugify");

const vaildatorMiddleware = require("../../middlewars/vaildatorMiddleware");
const User = require("../../models/userModel");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("User must have a name")
    .isLength({ min: 3 })
    .withMessage("To short User name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("User must have an email ")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("user already exists");
      }
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("User must have password ")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("User must enter password confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("The password confirmation does not match ");
      }
      return true;
    }),
  vaildatorMiddleware,
];
exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("User must have an email ")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password").notEmpty().withMessage("User must enter a password"),

  vaildatorMiddleware,
];
