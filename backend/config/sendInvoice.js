const { Resend } = require("resend");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendInvoice = async (email, order) => {
  try {
    console.log("📩 sendInvoice STARTED");
    console.log("TO:", email);

    if (!email) throw new Error("No email provided");
    if (!order) throw new Error("No order data provided");

    // 📄 File setup
    const fileName = `invoice-${order._id}.pdf`;
    const filePath = path.join("/tmp", fileName);

    // 📊 Calculations
    const gst = order.totalAmount * 0.18;
    const finalTotal = order.totalAmount + gst;

    // 📄 Create PDF
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // 🧾 Content
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

    // ⏳ wait for PDF
    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    console.log("📄 PDF GENERATED:", filePath);

    // 📧 SEND EMAIL (RESEND)
    await resend.emails.send({
      from: "onboarding@resend.dev", // ⚠️ use your verified email later
      to: email,
      subject: "Your GST Invoice",
      html: `
        <h2>Thank you for your order 💖</h2>
        <p>Your invoice is attached below.</p>
      `,
      attachments: [
        {
          filename: fileName,
          content: fs.readFileSync(filePath), // ✅ buffer (no base64 needed)
        },
      ],
    });

    console.log("📧 EMAIL SENT SUCCESS");

    // 🧹 cleanup
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return true;

  } catch (err) {
    console.log("❌ SEND INVOICE ERROR:", err);
    return false;
  }
};

module.exports = sendInvoice;