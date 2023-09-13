const express = require("express");

const categoryService = require("../services/categoryService");
const authService = require("../services/authService");
const categoryVaildator = require("../utils/vaildators/categoryVaildator");
const subCategoriesRoute = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subCategories", subCategoriesRoute);
router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    categoryService.uploadImage,
    categoryService.resizeImage,
    categoryVaildator.createCtegoryVaildator,
    categoryService.createCategory
  )
  .get(categoryService.getCategories);
router
  .route("/:id")
  .get(categoryVaildator.getCtegoryVaildator, categoryService.getCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    categoryService.uploadImage,
    categoryService.resizeImage,
    categoryVaildator.updateCtegoryVaildator,
    categoryService.updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    categoryVaildator.deleteCtegoryVaildator,
    categoryService.deleteCategory
  );
module.exports = router;
