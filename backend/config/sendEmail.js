const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, otp) => {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Nykaa OTP",
      html: `<h1>${otp}</h1>`
    });

    console.log("Email sent:", info.response);

  } catch (error) {
    console.log("EMAIL ERROR FULL:", error);
    throw error;
  }
};

module.exports = sendEmail;