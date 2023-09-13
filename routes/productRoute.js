const express = require("express");

const router = express.Router();
const productService = require("../services/productService");
const authService = require("../services/authService");
const productVaildator = require("../utils/vaildators/productVaildator");

const reviewRoute = require("./reviewRoute");

router.use("/:productId/reviews", reviewRoute);
router
  .route("/")
  .get(productService.getProducts)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    productService.uploadProductImages,
    productService.resizeProductImages,
    productVaildator.createProductVaildator,
    productService.createProduct
  );
router
  .route("/:id")
  .get(productVaildator.getProductVaildator, productService.getProduct)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    productService.uploadProductImages,
    productService.resizeProductImages,
    productVaildator.updateProductVaildator,
    productService.updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    productVaildator.deleteProductVaildator,
    productService.deleteProduct
  );

module.exports = router;
