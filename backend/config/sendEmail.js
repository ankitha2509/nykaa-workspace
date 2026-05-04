const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, otp) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Nykaa OTP Verification",
      html: `
        <h2>Your OTP Code</h2>
        <h1 style="color:#fc2779;">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `
    });

    console.log("Email sent");

  } catch (error) {
    console.log("Email Error:", error);
    throw error;
  }
};

module.exports = sendEmail;