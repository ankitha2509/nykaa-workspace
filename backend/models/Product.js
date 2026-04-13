const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  category: String,
  price: Number,
  stock: Number,
  description: String,
  image: String,
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);