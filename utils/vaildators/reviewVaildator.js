const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewars/vaildatorMiddleware");
const Review = require("../../models/reviewModel");

exports.createReviewVaildator = [
  // 1- rules
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Rating value required")

    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 to 5"),

  check("user").isMongoId().withMessage("invaid user id format"),

  check("product")
    .isMongoId()
    .withMessage("invaid product id format")
    .custom(async (val, { req }) => {
      const review = await Review.findOne({
        user: req.body.user,
        product: req.body.product,
      });

      if (review) {
        throw new Error("You already created a review before");
      }
    }),

  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];

exports.getReviewVaildator = [
  // 1- rules
  check("id").isMongoId().withMessage("invaid barnd id format"),
  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];

exports.updateReviewVaildator = [
  // 1- rules
  check("id")
    .isMongoId()
    .withMessage("invaid review id format")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        throw new Error(`There is no review with id ${val} `);
      }
      if (review.user._id.toString() !== req.currentUser._id.toString()) {
        throw new Error(`You are not allowed to perform this action`);
      }
    }),
  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];

exports.deleteReviewVaildator = [
  // 1- rules
  check("id")
    .isMongoId()
    .withMessage("invaid review id format")
    .custom(async (val, { req }) => {
      if (req.currentUser.role === "user") {
        const review = await Review.findById(val);
        if (!review) {
          throw new Error(`There is no review with id ${val} `);
        }
        console.log(review.user._id.toString(), req.currentUser._id.toString());
        if (review.user._id.toString() !== req.currentUser._id.toString()) {
          throw new Error(`You are not allowed to perform this action`);
        }
      }
    }),
  // 2- middleware =>catch errors from rules if exist
  validatorMiddleware,
];
