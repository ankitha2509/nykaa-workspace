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

    const logoPath = path.join(__dirname, "../assets/nykaa-logo.png");

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 100 });
    } else {
      console.log("Logo not found at:", logoPath);
    }
    doc
      .fontSize(10)
      .fillColor("gray")
      .text("Nykaa Pvt Ltd", 350, 40)
      .text("Mumbai, India")
      .text("GSTIN: 27AAACN1234A1Z5");

      doc.moveDown(3);
    doc
      .fontSize(18)
      .fillColor("#fc2779")
      .text("GST INVOICE", { align: "center" });

    doc.moveDown(1);

    const invoiceDate = new Date().toLocaleDateString();

    doc
      .fontSize(11)
      .fillColor("black")
      .text(`Invoice No: INV-${order._id}`, 50)
      .text(`Date: ${invoiceDate}`, 400);

    doc.moveDown(1);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    doc.fontSize(12).text("Bill To:", 50);
    doc.fontSize(11).text(order.name);
    doc.text(order.address);
    doc.text(order.phone);

    doc.moveDown(1);

    const tableTop = doc.y;

    doc
      .fontSize(12)
      .fillColor("#fc2779")
      .text("Description", 50, tableTop)
      .text("Amount", 450, tableTop, { align: "right" });

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    doc.moveDown(1);

    doc.fillColor("black");

    doc.text("Subtotal", 50);
    doc.text(`₹${order.totalAmount}`, 450, doc.y - 15, { align: "right" });

    doc.moveDown();

    doc.text("GST (18%)", 50);
    doc.text(`₹${gst.toFixed(2)}`, 450, doc.y - 15, { align: "right" });

    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    doc
      .fontSize(13)
      .fillColor("#fc2779")
      .text("Total", 50)
      .text(`₹${finalTotal.toFixed(2)}`, 450, doc.y - 15, { align: "right" });

    doc.moveDown(2);

    doc
      .fontSize(10)
      .fillColor("gray")
      .text("Thank you for shopping with Nykaa", {
        align: "center",
      });

    doc
      .fontSize(9)
      .text("This is a computer generated invoice.", {
        align: "center",
      });

    doc.end();

    
    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    console.log("PDF GENERATED:", filePath);

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