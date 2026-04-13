const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const existing = await Cart.findOne({ userId, productId });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json({ message: "Quantity updated" });
    }

    const newItem = new Cart({
      userId,
      productId,
      quantity,
    });

    await newItem.save();

    res.json({ message: "Added to cart" });

  } catch (err) {
    res.status(500).json({ message: "Error adding to cart" });
  }
});


router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.userId })
      .populate("productId"); 

    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: "Error fetching cart" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

router.put("/update/:id", async (req, res) => {
  await Cart.findByIdAndUpdate(req.params.id, {
    quantity: req.body.quantity,
  });
  res.json({ message: "Updated" });
});

module.exports = router;