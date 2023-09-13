const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc   add address to user addresses
// @route  POST /api/v1/addresses
// @access private/user
exports.addAddressToUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.currentUser._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Addresses added successfully",
    Addresses: user.addresses,
  });
});

// @desc   remove address from user addresses
// @route  DELETE /api/v1/addresses
// @access private/user
exports.removeAddressFromUserAddresses = asyncHandler(
  async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      req.currentUser._id,
      {
        $pull: { addresses: { _id: req.params.addressId } },
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Address removed successfully ",
      addresses: user.addresses,
    });
  }
);

// @desc   get logged user Addresses
// @route  GET /api/v1/addresses
// @access private/user
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.currentUser._id);

  res.status(200).json({
    status: "success",
    result: user.addresses.length,
    wishlist: user.addresses,
  });
});
