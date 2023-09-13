const factory = require("./handlersFactory");
const Review = require("../models/reviewModel");

// @desc Nested route
// GET /api/v1/reviews/:productId/reviews
exports.createFilterObj = (req, res, next) => {
  const filter = req.params.productId ? { product: req.params.productId } : {};

  req.filterObj = filter;
  next();
};

// @desc   Get list of reviews
// @route  GET /api/v1/reviews
// @access public
exports.getReviews = factory.getAll(Review);

// @desc   Get specific review by id
// @route  GET /api/v1/reviews/:id
// @access public
exports.getReview = factory.getOne(Review);

// @desc Nested route
// POST /api/v1/reviews/:productId/reviews
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.user) {
    req.body.user = req.currentUser._id;
  }

  if (!req.body.product) {
    req.body.product = req.params.productId;
  }
  next();
};

// @desc   Create review
// @route  POST /api/v1/reviews
// @access private/protect/User
exports.createReview = factory.createOne(Review);

// @desc   Update specific review by id
// @route  PATCH /api/v1/reviews/:id
// @access private/protect/User
exports.updateReview = factory.updateOne(Review);

// @desc   Delete specific review by id
// @route  DELETE /api/v1/reviews/:id
// @access private/protect/User-Admin-Manager
exports.deleteReview = factory.deleteOne(Review);
