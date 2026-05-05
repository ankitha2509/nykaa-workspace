const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");

const sendInvoice = require("../config/sendInvoice");

// CREATE ORDER
router.post("/create/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const {
      name,
      phone,
      address1,
      address2,
      city,
      pincode,
      paymentMethod
    } = req.body;

    const fullAddress = `${address1}, ${address2}, ${city} - ${pincode}`;

    // get cart items
    const cartItems = await Cart.find({ userId }).populate("productId");

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;

    const items = cartItems.map((item) => {
      totalAmount += item.productId.price * item.quantity;

      return {
        productId: item.productId._id,
        quantity: item.quantity
      };
    });

    // create order
    const order = new Order({
      userId,
      name,
      phone,
      address: fullAddress,
      items,
      totalAmount,
      paymentMethod
    });

    await order.save();

    // get user email
    const user = await User.findById(userId);

    // 📩 SEND GST INVOICE EMAIL
    if (user && user.email) {
      try {
        await sendInvoice(user.email, order);
        console.log("Invoice email sent");
      } catch (emailErr) {
        console.log("Invoice email failed:", emailErr.message);
      }
    }

    // clear cart
    await Cart.deleteMany({ userId });

    res.json({
      message: "Order placed successfully 🎉",
      orderId: order._id
    });

  } catch (err) {
    console.log("Order Error:", err);
    res.status(500).json({
      message: "Error placing order"
    });
  }
});


// GET USER ORDERS
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("items.productId");

    res.json(orders);

  } catch (err) {
    res.status(500).json({
      message: "Error fetching orders"
    });
  }
});

module.exports = router;