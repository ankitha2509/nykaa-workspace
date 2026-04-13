const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,

  name: String,
  phone: String,
  address: String,

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
    }
  ],

  totalAmount: Number,

  paymentMethod: String, // 🔥 NEW

  status: {
    type: String,
    default: "Placed",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);