const crypto = require("crypto"); // <-- Add this line
const razorpay = require("../../helpers/razorpay");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const { totalAmount } = req.body;

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Razorpay takes amount in paise (₹1 = 100 paise)
    const options = {
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json(order); // { id, amount, currency, status, ... }
  } catch (error) {
    console.error("Razorpay createOrder error:", error);
    res.status(500).json({ error: "Unable to create Razorpay order" });
  }
};

const capturePayment = async (req, res) => {
 try {
    const { paymentId, orderId, signature, orderData } = req.body;

    // 1️⃣ Validate incoming data
    if (!paymentId || !orderId || !signature || !orderData) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details or order data",
      });
    }

    // 2️⃣ Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // 3️⃣ Save order to DB
    const newOrder = new Order({
      userId: orderData.userId,
      cartId: orderData.cartId,
      cartItems: orderData.cartItems,
      addressInfo: orderData.addressInfo,
      totalAmount: orderData.totalAmount,
      paymentId,
      razorpayOrderId: orderId,
      paymentStatus: "paid",
      orderStatus: "confirmed",
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    });

    await newOrder.save();

    // 4️⃣ Respond with success
    res.status(200).json({
      success: true,
      message: "Payment verified & order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Payment capture error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while capturing payment",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
