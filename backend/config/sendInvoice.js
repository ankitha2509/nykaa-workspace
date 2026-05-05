const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
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
    doc.text(`Name: ${order.name}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Address: ${order.address}`);
    doc.moveDown();

    doc.text(`Subtotal: ₹${order.totalAmount}`);
    doc.text(`GST (18%): ₹${gst.toFixed(2)}`);
    doc.text(`Total: ₹${finalTotal.toFixed(2)}`);

    doc.end();

    await new Promise((resolve) => doc.on("finish", resolve));

    await transporter.sendMail({
      from: `"Nykaa Clone" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your GST Invoice",
      text: "Thanks for your order. Invoice attached.",
      attachments: [
        {
          filename: fileName,
          path: filePath
        }
      ]
    });

    fs.unlinkSync(filePath);

    console.log("Invoice sent successfully");

  } catch (err) {
    console.log("Email Error:", err.message);
  }
};

module.exports = sendInvoice;