const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  userId: String,

  name: String,
  phone: String,

  address1: String,
  address2: String,
  city: String,
  pincode: String,

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Address", addressSchema);