const bcrypt = require("bcryptjs");

const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middlewars/vaildatorMiddleware");
const User = require("../../models/userModel");

exports.createUserVaildator = [
  // 1- rules
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
        throw new Error("E-mail already in use  ");
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

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invaild phone number only accepted EG and SA"),
  check("profileImage").optional(),
  check("role").optional(),
  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];

exports.getUserVaildator = [
  // 1- rules
  check("id").isMongoId().withMessage("invaid user id format"),
  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];

exports.updateUserValidator = [
  // 1- rules

  check("id").isMongoId().withMessage("invaid user id format"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("To short User name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("E-mail already in use");
      }
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number; only accepted EG and SA"),

  check("profileImage").optional(),
  check("role").optional(),
  // 2- middleware => catch errors from rules if exist
  validatorMiddleware,
];

exports.deleteUserVaildator = [
  // 1- rules
  check("id").isMongoId().withMessage("invaid barnd id format"),
  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];

exports.changePasswordVaildator = [
  check("id").isMongoId().withMessage("invaid user id format"),

  check("currentPassword")
    .notEmpty()
    .withMessage("You must enter your new password"),

  check("confiremPassword")
    .notEmpty()
    .withMessage("You must enter your new password confirmation"),

  check("password")
    .notEmpty()
    .withMessage("You must enter your current password")
    .custom(async (value, { req }) => {
      // 1) verify current password
      const user = await User.findById(req.params.id);
      if (!user) throw new Error("There is no user for this id");

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isCorrectPassword) throw new Error(" Incorrect current password");

      // 2) Verify password confirmation

      if (value !== req.body.confiremPassword)
        throw new Error("The password confirmation is incorrect");

      return true;
    }),

  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  // 1- rules
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("To short User name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("E-mail already in use");
      }
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number; only accepted EG and SA"),
  // 2- middleware => catch errors from rules if exist
  validatorMiddleware,
];
