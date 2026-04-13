const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

router.post("/signup/send-otp", async (req, res) => {
  try {
    const { mobile, email } = req.body;

    if (!mobile && !email) {
      return res.status(400).json({ message: "Provide mobile or email" });
    }

    const existingUser = mobile
      ? await User.findOne({ mobile })
      : await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Account already exists. Please login."
      });
    }

    const otp = generateOTP();

    const newUser = new User({
      mobile,
      email,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000
    });

    await newUser.save();

    res.json({ message: "OTP sent for signup", otp });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/login/send-otp", async (req, res) => {
  try {
    const { mobile, email } = req.body;

    if (!mobile && !email) {
      return res.status(400).json({ message: "Provide mobile or email" });
    }

    const user = mobile
      ? await User.findOne({ mobile })
      : await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "No account found. Please sign up."
      });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    res.json({ message: "OTP sent for login", otp });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { mobile, email, otp } = req.body;

    const user = mobile
      ? await User.findOne({ mobile })
      : await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (
      String(user.otp) !== String(otp) ||
      !user.otpExpires ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({
        message: "OTP is incorrect or expired."
      });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        mobile: user.mobile
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
});


router.put("/update/:id", async (req, res) => {
  try {
    const { name, gender, mobile } = req.body;

    await User.findByIdAndUpdate(req.params.id, {
      name,
      gender,
      mobile,
    });

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router;