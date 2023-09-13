const { check } = require("express-validator");
const { default: slugify } = require("slugify");

const validatorMiddleware = require("../../middlewars/vaildatorMiddleware");

exports.createSubCtegoryVaildator = [
  // 1- rules
  check("name")
    .notEmpty()
    .withMessage("subCategory must have a name")
    .isLength({ max: 32 })
    .withMessage("To long subCategory name")
    .isLength({ min: 2 })
    .withMessage("To short subCategory name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("category")
    .isMongoId()
    .withMessage("invaid Category id format")
    .notEmpty()
    .withMessage("subCategory must be belong to category"),

  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];

exports.getSubCtegoryVaildator = [
  // 1- rules
  check("id").isMongoId().withMessage("invaid subcategory id format"),
  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];

exports.updateSubCtegoryVaildator = [
  // 1- rules
  check("id").isMongoId().withMessage("invaid subcategory id format"),

  check("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),

  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];
exports.deleteSubCtegoryVaildator = [
  // 1- rules
  check("id").isMongoId().withMessage("invaid subcategory id format"),
  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];
