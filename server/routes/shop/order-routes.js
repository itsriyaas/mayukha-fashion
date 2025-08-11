const express = require("express");
const {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

/**
 * PAYMENT ROUTES (SECURE)
 */
router.post("/payment/create-order", createOrder); // Step 1: Create Razorpay Order
router.post("/payment/capture", capturePayment);   // Step 2: Verify & Capture Payment

/**
 * ORDER ROUTES
 */
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;
