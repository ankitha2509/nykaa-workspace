const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendInvoice = async (email, order) => {
  try {
    const doc = new PDFDocument();

    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));

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

    await new Promise((resolve) => doc.on("end", resolve));

    const pdfBuffer = Buffer.concat(buffers);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Nykaa GST Invoice",
      text: "Thank you for shopping. Your invoice is attached.",
      attachments: [
        {
          filename: `invoice-${order._id}.pdf`,
          content: pdfBuffer
        }
      ]
    });

  } catch (err) {
    console.log("Invoice Error:", err.message);
  }
};

module.exports = sendInvoice;