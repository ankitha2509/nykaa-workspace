const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // ✅ VERY IMPORTANT (fixes your network error)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendInvoice = async (email, order) => {
  try {
    const fileName = `invoice-${order._id}.pdf`;
    const filePath = path.join(__dirname, fileName);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    const gst = order.totalAmount * 0.18;
    const finalTotal = order.totalAmount + gst;

    doc.fontSize(20).text("Nykaa GST Invoice");
    doc.moveDown();

    doc.text(`Order ID: ${order._id}`);
    doc.text(`Customer: ${order.name}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Address: ${order.address}`);
    doc.moveDown();

    doc.text(`Subtotal: ₹${order.totalAmount}`);
    doc.text(`GST (18%): ₹${gst.toFixed(2)}`);
    doc.text(`Grand Total: ₹${finalTotal.toFixed(2)}`);

    doc.end();

      await new Promise((resolve) => {
      doc.on("finish", resolve);
    });

   
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Nykaa GST Invoice",
      text: "Thank you for shopping. Your invoice is attached.",
      attachments: [
        {
          filename: fileName,
          path: filePath
        }
      ]
    });

    // ✅ Safe delete
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

  } catch (err) {
    console.log("Invoice Error:", err.message);
  }
};

module.exports = sendInvoice;