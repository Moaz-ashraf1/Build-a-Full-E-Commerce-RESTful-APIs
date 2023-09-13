const { default: slugify } = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewars/vaildatorMiddleware");

const Category = require("../../models/categoryModel");

const SubCategory = require("../../models/subCategoryModel");

exports.createProductVaildator = [
  // 1- rules
  check("title")
    .notEmpty()
    .withMessage("Product must have a title")
    .isLength({ max: 100 })
    .withMessage("Too long Product title")
    .isLength({ min: 3 })
    .withMessage("Too short Product title")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("description")
    .notEmpty()
    .withMessage("Product must have a description")
    .isLength({ max: 2000 })
    .withMessage("Too long Product description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product must have a quantity")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Too long proce"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("product priceAfterDiscount must be a number ")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`No catefory for this id:${categoryId}`);
      }
    }),

  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("product must be belong to a subcategory")
    .custom(async (subCategoriesIds) => {
      const result = await SubCategory.find({
        _id: { $exists: true, $in: subCategoriesIds },
      });

      if (result.length === subCategoriesIds.length) {
        return true;
      }
      throw new Error("Invaild subcategories ids");
    })
    .custom(async (value, { req }) => {
      // @des check if subcategories in the subcategory model and related to its category
      const subcategories = await SubCategory.find({
        _id: { $in: value },
        category: req.body.category,
      });
      if (subcategories.length !== value.length) {
        throw new Error("invalid subcategories");
      }
    }),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("product must be belong to a brand"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];

exports.getProductVaildator = [
  // 1- rules
  check("id").isMongoId().withMessage("invaid Product id format"),
  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];

exports.updateProductVaildator = [
  // 1- rules
  check("id").isMongoId().withMessage("invaid Product id format"),
  check("title")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];

exports.deleteProductVaildator = [
  // 1- rules
  check("id").isMongoId().withMessage("invaid Product id format"),
  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];
