const express = require("express");
const router = express.Router();
const Address = require("../models/Address");

router.post("/add", async (req, res) => {
  try {
    const newAddress = new Address(req.body);
    await newAddress.save();

    res.json({ message: "Address saved" });
  } catch (err) {
    res.status(500).json({ message: "Error saving address" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching address" });
  }
});

module.exports = router;