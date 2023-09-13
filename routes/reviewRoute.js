const express = require("express");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdToBody,
} = require("../services/reviewService");

const authService = require("../services/authService");
const {
  createReviewVaildator,
  updateReviewVaildator,
  deleteReviewVaildator,
} = require("../utils/vaildators/reviewVaildator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    authService.protect,
    authService.allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewVaildator,
    createReview
  );

router
  .route("/:id")
  .get(getReview)
  .put(
    authService.protect,
    authService.allowedTo("user"),
    updateReviewVaildator,
    updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager", "user"),
    deleteReviewVaildator,
    deleteReview
  );
module.exports = router;
