const express = require("express");
const subCategoriesService = require("../services/subCategoriesService");
const authService = require("../services/authService");

const subCategoriesVaildator = require("../utils/vaildators/subCategoryVaildator ");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    subCategoriesService.createFilterObj,
    subCategoriesService.getSubCategories
  )
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    subCategoriesService.setCategoryIdToBody,
    subCategoriesVaildator.createSubCtegoryVaildator,
    subCategoriesService.createSubCategory
  );

router
  .route("/:id")
  .get(
    subCategoriesVaildator.getSubCtegoryVaildator,
    subCategoriesService.getSubCategory
  )
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    subCategoriesVaildator.updateSubCtegoryVaildator,
    subCategoriesService.updateSubCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    subCategoriesVaildator.deleteSubCtegoryVaildator,
    subCategoriesService.deleteSubCategory
  );

module.exports = router;
