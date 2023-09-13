const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewars/vaildatorMiddleware");

exports.createCtegoryVaildator = [
  // 1- rules
  check("name")
    .notEmpty()
    .withMessage("Category must have a name")
    .isLength({ max: 32 })
    .withMessage("To long category name")
    .isLength({ min: 3 })
    .withMessage("To short category name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];

exports.getCtegoryVaildator = [
  // 1- rules
  check("id").isMongoId().withMessage("invaid category id format"),
  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];

exports.updateCtegoryVaildator = [
  // 1- rules
  check("id").isMongoId().withMessage("invaid category id format"),

  check("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];
exports.deleteCtegoryVaildator = [
  // 1- rules
  check("id").isMongoId().withMessage("invaid category id format"),
  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];
