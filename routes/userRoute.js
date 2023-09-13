const express = require("express");
const userService = require("../services/userService");

const userVaildator = require("../utils/vaildators/userVaildator");
const authService = require("../services/authService");

const router = express.Router();

router
  .route("/getMe")
  .get(authService.protect, userService.getLoggedUserData, userService.getUser);
router
  .route("/changeMyPassword")
  .put(authService.protect, userService.changeLoggedUserPassword);
router
  .route("/updateMe")
  .put(
    authService.protect,
    userVaildator.updateLoggedUserValidator,
    userService.updateLoggedUserDate
  );
router
  .route("/deleteMe")
  .delete(authService.protect, userService.DeactivateLoggedUserAccount);

// Admin

router.use(authService.protect, authService.allowedTo("admin"));
router
  .route("/")
  .post(
    userService.uploadImage,
    userService.resizeImage,
    userVaildator.createUserVaildator,
    userService.createUser
  )
  .get(userService.getUsers);
router
  .route("/:id")
  .get(userVaildator.getUserVaildator, userService.getUser)
  .put(
    userVaildator.updateUserValidator,
    userService.uploadImage,
    userService.resizeImage,
    userService.updateUser
  )
  .delete(userVaildator.deleteUserVaildator, userService.deleteUser);

router
  .route("/changePassword/:id")
  .put(userVaildator.changePasswordVaildator, userService.changeUserPassword);

module.exports = router;
