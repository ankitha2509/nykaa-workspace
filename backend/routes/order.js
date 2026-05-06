const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");

const sendInvoice = require("../config/sendInvoice");

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

    const user = await User.findById(userId);

    if (user?.email) {
      sendInvoice(user.email, order)
        .then(() => console.log("Invoice sent"))
        .catch((err) => console.log("Email error:", err.message));
    }

    await Cart.deleteMany({ userId });

    res.json({
      message: "Order placed successfully 🎉",
      orderId: order._id
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error placing order"
    });
  }
});

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