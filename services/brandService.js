const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const uniqid = require("uniqid");
const { uploadSingleImage } = require("../middlewars/uploadImageMiddleware");
const Brand = require("../models/brandModel");
const factory = require("./handlersFactory");

// Upload single image
exports.uploadImage = uploadSingleImage("image");
// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uniqid()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 60)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`); // (store image in disk storage)
  console.log(req.body.image);
  req.body.image = filename;

  next();
});
// @desc   Get list of Brands
// @route  GET /api/v1/brands
// @access public
exports.getBrands = factory.getAll(Brand);

// @desc   Get specific brand by id
// @route  GET /api/v1/brands/:id
// @access public
exports.getBrand = factory.getOne(Brand);

// @desc   Create Brand
// @route  POST /api/v1/brands
// @access private
exports.createBrand = factory.createOne(Brand);

// @desc   Update specific brand by id
// @route  PATCH /api/v1/brands/:id
// @access private
exports.updateBrand = factory.updateOne(Brand);

// @desc   Delete specific brand by id
// @route  DELETE /api/v1/brands/:id
// @access private
exports.deleteBrand = factory.deleteOne(Brand);
