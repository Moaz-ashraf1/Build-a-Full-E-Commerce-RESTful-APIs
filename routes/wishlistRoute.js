const express = require("express");

const router = express.Router();

const {
  getLoggedUserWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
} = require("../services/wishlistService");

const {
  addProductToWishlistVaildator,
  removeProductFromWishlistVaildator,
} = require("../utils/vaildators/wishlistVaildator");
const authService = require("../services/authService");

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").get(getLoggedUserWishlist);
router.route("/").post(addProductToWishlistVaildator, addProductToWishlist);

router
  .route("/:productId")
  .delete(removeProductFromWishlistVaildator, removeProductFromWishlist);

module.exports = router;
