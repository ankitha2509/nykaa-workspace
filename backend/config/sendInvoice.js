const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

console.log("📦 sendInvoice module loaded");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // ✅ FORCE IPv4 (IMPORTANT)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

// ✅ OPTIONAL: verify connection at startup
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP NOT READY:", error);
  } else {
    console.log("✅ SMTP READY TO SEND EMAILS");
  }
});

const sendInvoice = async (email, order) => {
  try {
    console.log("📩 sendInvoice STARTED");
    console.log("TO:", email);

    if (!email) throw new Error("No email provided");
    if (!order) throw new Error("No order data provided");

    // 📄 Safe file path for Render
    const fileName = `invoice-${order._id}.pdf`;
    const filePath = path.join("/tmp", fileName);

    // 📊 Calculations
    const gst = order.totalAmount * 0.18;
    const finalTotal = order.totalAmount + gst;

    // 📄 Create PDF
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(20).text("Nykaa GST Invoice");
    doc.moveDown();

    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Name: ${order.name}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Address: ${order.address}`);
    doc.moveDown();

    doc.text(`Subtotal: ₹${order.totalAmount}`);
    doc.text(`GST (18%): ₹${gst.toFixed(2)}`);
    doc.text(`Total: ₹${finalTotal.toFixed(2)}`);

    doc.moveDown();
    doc.text("Thank you for shopping with us 💖");

    doc.end();

    // ⏳ wait for PDF write complete
    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    console.log("📄 PDF GENERATED:", filePath);

    // 📧 SEND EMAIL (with retry logic)
    let info;

    try {
      info = await transporter.sendMail({
        from: `"Nykaa Clone" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your GST Invoice",
        text: "Thanks for your order. Invoice attached.",
        attachments: [
          {
            filename: fileName,
            path: filePath,
          },
        ],
      });
    } catch (emailErr) {
      console.log("⚠️ FIRST EMAIL ATTEMPT FAILED, RETRYING...", emailErr.message);

      info = await transporter.sendMail({
        from: `"Nykaa Clone" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your GST Invoice",
        text: "Thanks for your order. Invoice attached.",
        attachments: [
          {
            filename: fileName,
            path: filePath,
          },
        ],
      });
    }

    console.log("📧 EMAIL SENT SUCCESS:", info.messageId);

    // 🧹 cleanup
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return true;
  } catch (err) {
    console.log("❌ SEND INVOICE ERROR:", err);
    console.log("❌ STACK:", err.stack);
    return false;
  }
};

module.exports = sendInvoice;