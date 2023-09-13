const { check } = require("express-validator");

const vaildatorMiddleware = require("../../middlewars/vaildatorMiddleware");

const Product = require("../../models/productModel");

exports.addProductToWishlistVaildator = [
  // 1- rules
  check("productId")
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom(async (val, { req }) => {
      const product = await Product.findOne({ _id: req.body.productId });
      if (!product) {
        throw new Error("Product not found");
      }
      return true; // Return true if validation passes
    }),
  // 2- middleware =>catch errors from rules if exist
  vaildatorMiddleware,
];

exports.removeProductFromWishlistVaildator = [
  // 1- rules
  check("productId")
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom(async (val, { req }) => {
      const product = await Product.findOne({ _id: req.params.productId });
      if (!product) {
        throw new Error("Product not found");
      }
      return true; // Return true if validation passes
    }),
  // 2- middleware =>catch errors from rules if exist
  vaildatorMiddleware,
];
