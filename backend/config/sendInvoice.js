const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

console.log("📦 sendInvoice module loaded");

// ✅ Better SMTP config for Gmail + Render
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendInvoice = async (email, order) => {
  try {
    console.log("📩 sendInvoice STARTED");
    console.log("TO:", email);

    if (!email) {
      throw new Error("No email provided");
    }

    // 📄 Create PDF
    const fileName = `invoice-${order._id}.pdf`;
    const filePath = path.join(__dirname, fileName);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    const gst = order.totalAmount * 0.18;
    const finalTotal = order.totalAmount + gst;

    doc.fontSize(20).text("Nykaa GST Invoice");
    doc.moveDown();

    doc.text(`Order ID: ${order._id}`);
    doc.text(`Name: ${order.name}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Address: ${order.address}`);
    doc.moveDown();

    doc.text(`Subtotal: ₹${order.totalAmount}`);
    doc.text(`GST (18%): ₹${gst.toFixed(2)}`);
    doc.text(`Total: ₹${finalTotal.toFixed(2)}`);

    doc.end();

    await new Promise((resolve, reject) => {
      doc.on("finish", resolve);
      doc.on("error", reject);
    });

    console.log("📄 PDF GENERATED");

    // 📧 SEND EMAIL
    const info = await transporter.sendMail({
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

    console.log("📧 EMAIL SENT SUCCESS:", info.messageId);

    // 🧹 delete file safely
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return true;
  } catch (err) {
    console.log("❌ SEND INVOICE ERROR:", err.message);
    return false;
  }
};

module.exports = sendInvoice;