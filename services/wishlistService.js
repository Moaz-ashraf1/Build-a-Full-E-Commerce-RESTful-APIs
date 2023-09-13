const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc   add products to wishlist
// @route  POST /api/v1/wishlist
// @access private/user
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.currentUser._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product added successfully to wishlist",
    wishlist: user.wishlist,
  });
});

// @desc   remove products from wishlist
// @route  DELETE /api/v1/wishlist
// @access private/user
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.currentUser._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product removed successfully from wishlist",
    wishlist: user.wishlist,
  });
});

// @desc   get logged user wishlist
// @route  GET /api/v1/wishlist
// @access private/user
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.currentUser._id).populate("wishlist");

  res.status(200).json({
    status: "success",
    result: user.wishlist.length,
    wishlist: user.wishlist,
  });
});
