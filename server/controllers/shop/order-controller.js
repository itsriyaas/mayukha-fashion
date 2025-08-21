const crypto = require("crypto");
const razorpay = require("../../helpers/razorpay");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const mongoose = require("mongoose");
const sendEmail = require("../../helpers/sendEmail.js");
const User = require("../../models/User.js")

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
      sizes: orderData.sizes || [],
      paymentId,
      razorpayOrderId: orderId,
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      orderStatus: "confirmed",
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    });

    await newOrder.save();

    // 4️⃣ Respond with success including full order
    res.status(200).json({
      success: true,
      message: "Payment verified & order placed successfully",
      order: newOrder, // full order object
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

    // Validate ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID format!",
      });
    }

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
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

//mail payment success
const paymentSuccess = async (req, res) => {
  const { orderId } = req.body;

  try {
    // 1. Get order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    // 2. Get user
    const user = await User.findById(order.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // 3. Build email
    const htmlContent = `
      <h2>✅ Order Confirmation</h2>
<p>Hi ${user.userName},</p>
<p>Thank you for your purchase!</p>
<p><strong>Order ID:</strong> ${order._id}</p>
<p><strong>Total:</strong> ₹${order.totalAmount}</p>

<p>
  <a href="https://mayukha-fashion.vercel.app/shop/account"
     style="display:inline-block; 
            padding:12px 20px; 
            background-color:#4CAF50; 
            color:#fff; 
            text-decoration:none; 
            border-radius:6px; 
            font-weight:bold;">
    📄 Download Invoice
  </a>
</p>

<p>We’ll notify you when your order ships.</p>
    `;

    // 4. Send email
    await sendEmail(user.email, "Your Order Confirmation", htmlContent);

    res.json({ success: true, message: "Payment success & email sent!" });
  } catch (err) {
    console.error("PaymentSuccess Error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
  paymentSuccess
};
