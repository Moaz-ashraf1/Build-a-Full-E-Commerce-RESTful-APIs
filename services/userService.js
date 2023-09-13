const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const uniqid = require("uniqid");
const { uploadSingleImage } = require("../middlewars/uploadImageMiddleware");
const User = require("../models/userModel");
const factory = require("./handlersFactory");
const AppError = require("../utils/appError");

const createToken = require("../utils/generateToken");

// Upload single image
exports.uploadImage = uploadSingleImage("profileImage");
// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uniqid()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 60)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`); // (store image in disk storage)
    console.log(req.body.image);
    req.body.profileImage = filename;
  }

  next();
});

// @desc   Get list of users
// @route  GET /api/v1/users
// @access private
exports.getUsers = factory.getAll(User);

// @desc   Get specific user by id
// @route  GET /api/v1/users/:id
// @access private
exports.getUser = factory.getOne(User);

// @desc   Create user
// @route  POST /api/v1/users
// @access private
exports.createUser = factory.createOne(User);

// @desc   Update specific user by id
// @route  PATCH /api/v1/users/:id
// @access private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    { new: true }
  );

  if (!document) {
    return next(new AppError(`No ${User} for this id ${req.params.id}`, 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      document,
    },
  });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      password: await bcrypt.hash(req.body.password, 12),
      changePasswordAt: Date.now(),
    },
    { new: true }
  );

  if (!document) {
    return next(new AppError(`No ${User} for this id ${req.params.id}`, 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      document,
    },
  });
});

// @desc   Delete specific user by id
// @route  DELETE /api/v1/users/:id
// @access private
exports.deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { active: false });

  res.status(200).json({
    status: "success",
    message: "User deactivated successfully.",
  });
});

// @desc   Get Logged user
// @route  DELETE /api/v1/users/getMe
// @access private/protected

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.currentUser._id;
  next();
});

// @desc  Change Logged User Password
// @route  PUT /api/v1/users/changeMyPassword
// @access private/protected
exports.changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    { _id: req.currentUser._id },
    {
      password: await bcrypt.hash(req.body.password, 12),
      changePasswordAt: Date.now(),
    },
    { new: true }
  );

  const token = createToken(req.currentUser._id);

  res.status(200).json({
    data: user,
    token: token,
  });
});

// @desc  Update Logged User Date (Without Password, role)
// @route  PUT /api/v1/users/updateMe
// @access private/protected
exports.updateLoggedUserDate = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.currentUser._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json(user);
});

// @desc  Deactivate Logged User account
// @route  DELETE /api/v1/users/deleteMe
// @access private/protected
exports.DeactivateLoggedUserAccount = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.currentUser._id, { active: false });

  res.status(204).json({
    message: "user deleted successfully",
  });
});
