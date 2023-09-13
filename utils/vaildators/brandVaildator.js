const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middlewars/vaildatorMiddleware");

exports.createBrandVaildator = [
  // 1- rules
  check("name")
    .notEmpty()
    .withMessage("brand must have a name")
    .isLength({ max: 32 })
    .withMessage("To long brand name")
    .isLength({ min: 3 })
    .withMessage("To short brand name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];

exports.getBrandVaildator = [
  // 1- rules
  check("id").isMongoId().withMessage("invaid barnd id format"),
  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];

exports.updateBrandVaildator = [
  // 1- rules
  check("id").isMongoId().withMessage("invaid barnd id format"),

  check("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];
exports.deleteBrandVaildator = [
  // 1- rules
  check("id").isMongoId().withMessage("invaid barnd id format"),
  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];
