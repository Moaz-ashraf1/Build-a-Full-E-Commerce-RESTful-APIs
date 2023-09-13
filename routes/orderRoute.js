const express = require("express");

const router = express.Router();
const {
  createCashOrder,
  getAllOrders,
  getOrder,
  filterObjectForLoggedUser,
  updateOrderToDelivered,
  updateOrderToPaid,
  createCheckoutSession,
} = require("../services/orderService");

const authService = require("../services/authService");

router.use(authService.protect);

router.route("/checkout/:cartId").get(createCheckoutSession);
router.route("/:cartId").post(authService.allowedTo("user"), createCashOrder);

router
  .route("/")
  .get(
    authService.allowedTo("user", "admin", "manager"),
    filterObjectForLoggedUser,
    getAllOrders
  );

router
  .route("/:id")
  .get(authService.allowedTo("user", "admin", "manager"), getOrder);

router
  .route("/:orderId/pay")
  .put(authService.allowedTo("admin", "manager"), updateOrderToPaid);

router
  .route("/:orderId/deliver")
  .put(authService.allowedTo("admin", "manager"), updateOrderToDelivered);

module.exports = router;
