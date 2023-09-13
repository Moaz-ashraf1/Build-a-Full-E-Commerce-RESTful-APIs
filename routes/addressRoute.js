const express = require("express");

const router = express.Router();

const {
  addAddressToUserAddresses,
  removeAddressFromUserAddresses,
  getLoggedUserAddresses,
} = require("../services/addressService");

const authService = require("../services/authService");

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").get(getLoggedUserAddresses);
router.route("/").post(addAddressToUserAddresses);

router.route("/:addressId").delete(removeAddressFromUserAddresses);

module.exports = router;
