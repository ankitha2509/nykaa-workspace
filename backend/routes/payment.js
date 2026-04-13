const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, 
      currency: "inr",
      payment_method_types: ["card"],
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
    console.log("STRIPE ERROR:", err.message);
    res.status(500).json({ error: "Stripe failed" });
  }
});

module.exports = router;