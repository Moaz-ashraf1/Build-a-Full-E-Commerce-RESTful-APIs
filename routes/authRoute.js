const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authService");

const {
  signupValidator,
  loginValidator,
} = require("../utils/vaildators/authVaildator");

router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator, login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/verifyReset").post(verifyPassResetCode);
router.route("/resetPassword").put(resetPassword);
module.exports = router;
