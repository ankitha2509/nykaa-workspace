const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  gender: String,

  otp: String,
  otpExpires: Date

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);