const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

console.log("📦 sendInvoice module loaded");

// ✅ Transporter (Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
});

const sendInvoice = async (email, order) => {
  try {
    console.log("📩 sendInvoice STARTED");
    console.log("TO:", email);

    if (!email) {
      throw new Error("No email provided");
    }

    if (!order) {
      throw new Error("No order data provided");
    }

    // 📄 File path (Render-safe)
    const fileName = `invoice-${order._id}.pdf`;
    const filePath = path.join("/tmp", fileName);

    // 📊 Calculate GST
    const gst = order.totalAmount * 0.18;
    const finalTotal = order.totalAmount + gst;

    // 📄 Create PDF
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // 🧾 PDF CONTENT
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

    // ❗ END PDF
    doc.end();

    // ⏳ Wait for PDF to finish writing
    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    console.log("📄 PDF GENERATED at:", filePath);

    // 📧 SEND EMAIL
    const info = await transporter.sendMail({
      from: `"Nykaa Clone" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your GST Invoice",
      text: "Thanks for your order. Please find your invoice attached.",
      attachments: [
        {
          filename: fileName,
          path: filePath,
        },
      ],
    });

    console.log("📧 EMAIL SENT SUCCESS:", info.messageId);
    console.log("📧 FULL RESPONSE:", info);

    // 🧹 Cleanup file
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