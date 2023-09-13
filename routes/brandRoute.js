const express = require("express");
const {
  uploadImage,
  resizeImage,
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../services/brandService");

const {
  createBrandVaildator,
  getBrandVaildator,
  updateBrandVaildator,
  deleteBrandVaildator,
} = require("../utils/vaildators/brandVaildator");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadImage,
    resizeImage,
    createBrandVaildator,
    createBrand
  )
  .get(getBrands);
router
  .route("/:id")
  .get(getBrandVaildator, getBrand)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadImage,
    resizeImage,
    updateBrandVaildator,
    updateBrand
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteBrandVaildator,
    deleteBrand
  );
module.exports = router;
