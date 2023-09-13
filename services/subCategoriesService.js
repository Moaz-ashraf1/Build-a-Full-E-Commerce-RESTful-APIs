const subCategoryModel = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

exports.createFilterObj = (req, res, next) => {
  const filter = req.params.categoryId
    ? { category: req.params.categoryId }
    : {};

  req.filterObj = filter;
  next();
};

// @desc   Get list of subcategory
// @route  GET /api/v1/subCategory
// @access public
exports.getSubCategories = factory.getAll(subCategoryModel);

// @desc   Get specific subcategory
// @route  GET /api/v1/subCategories
// @access private
exports.getSubCategory = factory.getOne(subCategoryModel);

// @desc   Create Sub Category
// @route  POST /api/v1/subCategories
// @access private
exports.createSubCategory = factory.createOne(subCategoryModel);

// @desc   Update specific subcategory by id
// @route  PATCH /api/v1/subCategories/:id
// @access private
exports.updateSubCategory = factory.updateOne(subCategoryModel);

// @desc   Delete specific subcategory by id
// @route  DELETE /api/v1/subCategories/:id
// @access private
exports.deleteSubCategory = factory.deleteOne(subCategoryModel);
