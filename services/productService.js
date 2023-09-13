const multer = require("multer");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const uniqid = require("uniqid");
const factory = require("./handlersFactory");
const Product = require("../models/productModel");
const { uploadMixOfImages } = require("../middlewars/uploadImageMiddleware");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  { name: "images", maxCount: 4 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const filename = `product-${uniqid()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${filename}`); // (store image in disk storage)

    req.body.imageCover = filename;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (image, index) => {
        const filename = `product-${uniqid()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(image.buffer)
          .resize(600, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${filename}`); // (store image in disk storage)

        req.body.images.push(filename);
      })
    );
  }
  next();
});

// @desc   Get list of Products
// @route  GET /api/v1/products
// @access public
exports.getProducts = factory.getAll(Product, "Product");

// @desc   Get specific Product by id
// @route  GET /api/v1/product/:id
// @access public
exports.getProduct = factory.getOne(Product, "review");

// @desc   Create Product
// @route  POST /api/v1/products
// @access private
exports.createProduct = factory.createOne(Product);

// @desc   Update specific product by id
// @route  PATCH /api/v1/products/:id
// @access private
exports.updateProduct = factory.updateOne(Product);

// @desc   Delete specific product by id
// @route  DELETE /api/v1/products/:id
// @access private
exports.deleteProduct = factory.deleteOne(Product);
