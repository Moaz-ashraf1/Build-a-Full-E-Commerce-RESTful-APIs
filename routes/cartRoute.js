const express = require("express");
const {
  addProductToCart,
  getLoggedUserCart,
  removeCartItem,
  clearLoggedUserCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../services/cartService");

const authService = require("../services/authService");

const router = express.Router();
router.use(authService.protect, authService.allowedTo("user"));

router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearLoggedUserCart);

router.route("/applyCoupon").put(applyCoupon);

router.route("/:cartItemId").put(updateCartItemQuantity).delete(removeCartItem);
module.exports = router;
