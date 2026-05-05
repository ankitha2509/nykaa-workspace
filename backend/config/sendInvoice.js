const { Resend } = require("resend");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendInvoice = async (email, order) => {
  try {
    console.log("sendInvoice STARTED");
    console.log("TO:", email);

    if (!email) throw new Error("No email provided");
    if (!order) throw new Error("No order data provided");

    const fileName = `invoice-${order._id}.pdf`;
    const filePath = path.join("/tmp", fileName);

    const gst = order.totalAmount * 0.18;
    const finalTotal = order.totalAmount + gst;

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // ✅ LOGO (CENTERED PROPERLY)
    const logoPath = path.join(__dirname, "../assets/nykaa-logo.png");

    if (fs.existsSync(logoPath)) {
      doc.image(
        logoPath,
        doc.page.width / 2 - 60, // center horizontally
        20,
        { width: 120 }
      );
      doc.moveDown(4);
    } else {
      console.log("❌ Logo not found at:", logoPath);
    }

    // ✅ HEADER
    doc
      .fontSize(18)
      .fillColor("#fc2779")
      .text("NYKAA GST INVOICE", { align: "center" });

    doc.moveDown(1);

    // Divider
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // ✅ CUSTOMER DETAILS
    doc.fontSize(12).fillColor("black");
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Name: ${order.name}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Address: ${order.address}`);
    doc.moveDown(1);

    // Divider
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // ✅ TABLE HEADER
    doc.fontSize(13).fillColor("#fc2779").text("Order Summary");
    doc.moveDown(0.5);

    doc.fillColor("black");
    doc.text("Description", 50, doc.y);
    doc.text("Amount", 400, doc.y);
    doc.moveDown(0.5);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // ✅ VALUES
    doc.text("Subtotal", 50, doc.y);
    doc.text(`₹${order.totalAmount}`, 400, doc.y);
    doc.moveDown();

    doc.text("GST (18%)", 50, doc.y);
    doc.text(`₹${gst.toFixed(2)}`, 400, doc.y);
    doc.moveDown();

    // Divider
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // ✅ TOTAL HIGHLIGHT
    doc.fontSize(14).fillColor("#fc2779");
    doc.text("Total", 50, doc.y);
    doc.text(`₹${finalTotal.toFixed(2)}`, 400, doc.y);

    doc.moveDown(2);

    // ✅ FOOTER
    doc
      .fontSize(10)
      .fillColor("gray")
      .text("Thank you for shopping with Nykaa 💖", {
        align: "center",
      });

    doc.end();

    // wait for PDF
    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    console.log("📄 PDF GENERATED:", filePath);

    // ✅ EMAIL
    await resend.emails.send({
      from: "Nykaa <onboarding@resend.dev>",
      to: "ankkithaapujari093001@gmail.com",
      subject: "Your GST Invoice - Nykaa",
      text: "Your invoice is attached. Thank you for shopping with Nykaa.",
      attachments: [
        {
          filename: fileName,
          content: fs.readFileSync(filePath),
        },
      ],
    });

    console.log("EMAIL SENT SUCCESS");

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return true;

  } catch (err) {
    console.log("SEND INVOICE ERROR:", err);
    return false;
  }
};

module.exports = sendInvoice;