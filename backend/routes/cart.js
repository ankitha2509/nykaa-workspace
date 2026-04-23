const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");

router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        message: "Missing data"
      });
    }

    const existing = await Cart.findOne({
      userId,
      productId
    });

    if (existing) {
      existing.quantity += quantity || 1;
      await existing.save();

      return res.json({
        success: true,
        message: "Quantity updated"
      });
    }

    const newItem = new Cart({
      userId,
      productId,
      quantity: quantity || 1
    });

    await newItem.save();

    res.json({
      success: true,
      message: "Added to cart"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error adding to cart"
    });
  }
});


router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.find({
      userId: req.params.userId
    }).populate("productId");

    res.json(cart);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching cart"
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    await Cart.findByIdAndUpdate(req.params.id, {
      quantity: req.body.quantity
    });

    res.json({
      success: true,
      message: "Updated"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
});

module.exports = router;