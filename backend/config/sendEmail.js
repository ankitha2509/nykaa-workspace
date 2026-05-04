const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // ✅ FORCE IPv4 (THIS FIXES YOUR ERROR)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Nykaa" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Nykaa OTP Verification",
      html: `
        <h2>Your OTP Code</h2>
        <h1 style="color:#fc2779;">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `
    });

    console.log("Email sent:", info.response);

  } catch (error) {
    console.log("Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;