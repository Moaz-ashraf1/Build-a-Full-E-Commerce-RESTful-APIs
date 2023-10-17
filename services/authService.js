const crypto = require("crypto");

const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const asyncHandler = require("express-async-handler");

const { sanitizeUser } = require("../utils/sanitizeDate");

const AppError = require("../utils/appError");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const createToken = require("../utils/generateToken");
// @desc   signup
// @route  GET /api/v1/auth/signup
// @access public
exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

  const token = createToken(user._id);

  res.status(201).json({ data: sanitizeUser(user), token });
});

// @desc   login
// @route  GET /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError("Incorrecte email or password", 401));
  }

  const token = createToken(user._id);

  res.status(200).json({
    status: "success",

    data: {
      user,
      token,
    },
  });
});

// @desc  make sure that user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(
        "You are not logged in, please login to get access to this route.",
        401
      )
    );
  }

  // 2) verify token

  const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);

  // 3) check if user is exist
  const currentUser = await User.findById(decoded.userId);

  if (!currentUser) {
    return next(
      new AppError("the user that belong to this token does not exist", 403)
    );
  }

  // 4) check if user changed his password after token created
  if (currentUser.changePasswordAt) {
    const changedPasswordAt = parseInt(
      currentUser.changePasswordAt.getTime() / 1000,
      10
    );

    if (changedPasswordAt > decoded.iat) {
      return next(
        new AppError("User changed password after token created"),
        401
      );
    }
  }

  // 5) check if user Inactive account ?
  if (!currentUser.active) {
    return next(new AppError("This account has been deactivated"), 401);
  }
  req.currentUser = currentUser;
  next();
});

//@desc Authorization (User Permissions)
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user
    if (!roles.includes(req.currentUser.role)) {
      return next(
        new AppError("You are not allowed to access this route", 401)
      );
    }

    next();
  });

// @desc   forgotPassword
// @route  POST /api/v1/auth/forgotPassword
// @access public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError(`There is no user with that email ${req.body.email}`, 404)
    );
  }

  // 2) If user is already existing, generate random 6 digits and save it in db

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // 3) save hased reset code,expiration time and password reset verified in db
  user.passwordResetCode = hashedResetCode;
  user.passwordExpTime = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  // 4) send reset code via email
  const message = `Hi ${user.name},\n we received a request to reset the password on your E-shop Account.\n ${resetCode}\n Enter this code to complete the reset.\n Thanks for helping us keep your account secure.\n`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Your password reset code (vaild for 10 min",
      message,
    });
  } catch (err) {
    console.log(err);
    user.passwordResetCode = undefined;
    user.passwordExpTime = undefined;
    user.passwordResetVerified = undefined;
    await user.save();

    return next(new AppError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "success", message: "Reset code sent to email" });
});

// @desc   vertify password reset code
// @route  POST /api/v1/auth/verifyReset
// @access public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = await crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordExpTime: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Reset code invalid or expired"));
  }

  // 2) Reset code vaild
  user.passwordResetVerified = true;

  user.save();
  res.status(200).json({
    status: "success",
  });
});

// @desc   reset password
// @route  POST /api/v1/auth/resetPassword
// @access public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("user not found"));
  }

  if (!user.passwordResetVerified) {
    return next(new AppError("Reset code not verified"));
  }

  user.passwordResetVerified = undefined;
  user.passwordExpTime = undefined;
  user.passwordResetCode = undefined;

  user.password = req.body.newPassword;
  user.save();

  const token = createToken(user._id);

  res.status(200).json({ token });
});
