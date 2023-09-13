const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const AppError = require("../utils/appError");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;

  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.totalPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;

  return totalPrice;
};

// @desc    Add product to  cart
// @route   POST /api/v1/cart
// @access  Private/User

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);

  // Get cart for logged user
  let cart = await Cart.findOne({ user: req.currentUser._id });

  if (!cart) {
    // create cart for logged user with product
    cart = await Cart.create({
      user: req.currentUser._id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
        },
      ],
    });
  } else {
    // product is already in the cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not exits in cart, push product to cart
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price,
      });
    }
  }
  // calculate total cart price
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added to cart successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.currentUser._id });

  if (!cart) {
    return next(
      new AppError(`There is no cart for this user id ${req.currentUser._id}`)
    );
  }

  res.status(200).json({
    status: "success",
    numOfCartItem: cart.cartItems.length,
    cart,
  });
});

exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.currentUser._id },
    {
      $pull: { cartItems: { _id: req.params.cartItemId } },
    },
    { new: true }
  );

  // calculate total price for cart items
  const totalPrice = calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    message: "product removed from cart successfully",
    cart,
  });
});

exports.clearLoggedUserCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.currentUser._id });

  res.status(204).send();
});

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.currentUser._id });

  if (!cart) {
    return next(
      new AppError(
        `There is no cart for this user id ${req.currentUser._id}`,
        404
      )
    );
  }

  const cartItemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.cartItemId
  );

  if (cartItemIndex > -1) {
    cart.cartItems[cartItemIndex].quantity = req.body.quantity;
  } else {
    return next(
      new AppError(`There is no item for this id ${req.params.cartItemId}`, 404)
    );
  }

  let totalPrice = 0;
  totalPrice = calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    message: "product removed from cart successfully",
    cart,
  });
});

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new AppError(`Coupon not found or expired`, 404));
  }
  // 2) Get logged user cart to get total cart price
  const cart = await Cart.findOne({ user: req.currentUser._id });
  // 3) calculate total price after coupon

  const totalPriceAfterDiscount = (
    cart.totalPrice -
    (cart.totalPrice * coupon.discount) / 100
  ).toFixed(2);

  console.log(totalPriceAfterDiscount);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    message: "product removed from cart successfully",
    cart,
  });
});
