const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../config/sendEmail");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};



// ================= SIGNUP =================
router.post("/signup/send-otp", async (req, res) => {
  try {
    const { name, mobile, email } = req.body;

    if (!name || !mobile || !email) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    // ✅ check both email + mobile
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Account already exists"
      });
    }

    const otp = generateOTP();

    // ✅ send email first
    await sendEmail(email, otp);

    // ✅ then save user
    const newUser = new User({
      name,
      mobile,
      email,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000
    });

    await newUser.save();

    res.json({
      message: "OTP sent successfully to email"
    });

  } catch (error) {
    console.log("Signup Error:", error.message);
    res.status(500).json({
      message: "Error sending OTP"
    });
  }
});



// ================= LOGIN =================
router.post("/login/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "No account found. Please signup."
      });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(email, otp);

    res.json({
      message: "OTP sent successfully to email"
    });

  } catch (error) {
    console.log("Login Error:", error.message);
    res.status(500).json({
      message: "Error sending OTP"
    });
  }
});



// ================= VERIFY OTP =================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    // ✅ safe comparison
    if (
      String(user.otp) !== String(otp) ||
      !user.otpExpires ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({
        message: "OTP is invalid or expired"
      });
    }

    user.otp = null;
    user.otpExpires = null;

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email
      }
    });

  } catch (error) {
    console.log("Verify OTP Error:", error.message);
    res.status(500).json({
      message: "OTP verification failed"
    });
  }
});



// ================= GET USER =================
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user"
    });
  }
});



// ================= UPDATE USER =================
router.put("/update/:id", async (req, res) => {
  try {
    const { name, gender, mobile } = req.body;

    await User.findByIdAndUpdate(req.params.id, {
      name,
      gender,
      mobile
    });

    res.json({
      message: "Profile updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating profile"
    });
  }
});


module.exports = router;