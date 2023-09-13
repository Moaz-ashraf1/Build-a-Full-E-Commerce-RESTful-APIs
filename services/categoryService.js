const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const uniqid = require("uniqid");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewars/uploadImageMiddleware");
const Category = require("../models/categoryModel");

// Upload single image
exports.uploadImage = uploadSingleImage("image");
// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `category-${uniqid()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 60)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`); // (store image in disk storage)

    req.body.image = filename;
  }

  next();
});

// @desc   Create Category
// @route  POST /api/v1/categories
// @access private
exports.createCategory = factory.createOne(Category);

// @desc   Get list of categories
// @route  GET /api/v1/categories
// @access public
exports.getCategories = factory.getAll(Category);
// @desc   Get specific category by id
// @route  GET /api/v1/categories/:id
// @access public
exports.getCategory = factory.getOne(Category);

// @desc   Update specific category by id
// @route  PATCH /api/v1/categories/:id
// @access private
exports.updateCategory = factory.updateOne(Category);

// @desc   Delete specific category by id
// @route  DELETE /api/v1/categories/:id
// @access private
exports.deleteCategory = factory.deleteOne(Category);
