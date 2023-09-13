const stripe = require("stripe")(process.env.STRIPE_SECRET);

const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const factory = require("./handlersFactory");
const AppError = require("../utils/appError");

// @desc Create cash order
// @desc POST /api/v1/orders/cartId
// @access protected/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) Get cart depend on cartId

  const cart = await Cart.findById(req.params.cartId);
  if (!cart)
    return next(
      new AppError(`There is no cart with this id ${req.params.cartId}`, 404)
    );

  // 2) Get order price depend on cart price "check if copuon apply"

  const orderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;

  const totalOrderPrice = orderPrice + taxPrice + shippingPrice;

  // 3) Create order with default payment method cash

  const order = await Order.create({
    user: req.currentUser._id,
    shippingAdress: req.body.shippingAddress,
    cartItems: cart.cartItems,
    totalOrderPrice,
  });

  // 4) Decrement product quantity, increment product sold

  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOptions, {});
  }

  // 5) Clear cart depend on cartId
  await Cart.findByIdAndDelete(req.params.cartId);

  res.status(201).json({ status: "success", data: order });
});

exports.filterObjectForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.currentUser.role === "user") {
    req.filterObj = { user: req.currentUser._id };
  }
  next();
});

// @desc Get all orders
// @desc POST /api/v1/orders
// @access protected/User-Admin-Manager
exports.getAllOrders = factory.getAll(Order);

// @desc Get specific orders
// @desc GET /api/v1/orders/orderId
// @access protected/User-Admin-Manager
exports.getOrder = factory.getOne(Order);

// @desc update order paid status to paid
// @desc POST /api/v1/orders/orderId/pay
// @access protected/Admin-Manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    updatedOrder,
  });
});

// @desc update order Delivered status to Deliver
// @desc POST /api/v1/orders/orderId/deliver
// @access protected/Admin-Manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    updatedOrder,
  });
});

// @desc Create Checkout Session
// @desc GET /api/v1/orders/checkout/cartId
// @access protected/User
exports.createCheckoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart)
    return next(
      new AppError(`There is no cart with this id ${req.params.cartId}`, 404)
    );

  // 2) Get order price depend on cart price "check if copuon apply"
  const orderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;

  const totalOrderPrice = orderPrice + taxPrice + shippingPrice;

  // 3) Create a Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    mode: "payment",
    customer_email: req.currentUser.email,
    client_reference_id: req.params.cartId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.currentUser.name,
          },
        },
      },
    ],
  });

  res.status(200).json({ status: "success", session });
});

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAdress = session.metadata;
  const totalPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  console.log(user);
  console.log(cart);
  // 3) Create order with payment method card
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAdress,
    totalOrderPrice: totalPrice,
    paymentMethod: "card",
    isPaid: true,
    paidAt: Date.now(),
  });

  // 4) Decrement product quantity, increment product sold
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOptions, {});
  }

  // 5) Clear cart depend on cartId
  await Cart.findByIdAndDelete(cartId);
};

// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    //  Create order
    createCardOrder(event.data.object);
  }
  res.status(200).json({ recived: true });
});
