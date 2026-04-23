const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Order = require("../models/Order");


router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});


router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});


router.put("/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });

    res.json({ message: "Status updated" });

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;