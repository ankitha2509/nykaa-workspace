const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String },           
  gender: { type: String },        
  
  email: { type: String, unique: true, sparse: true },
  mobile: { type: String, unique: true, sparse: true },

  otp: { type: String },
  otpExpires: { type: Date }

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);