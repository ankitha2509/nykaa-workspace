const { Resend } = require("resend");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendInvoice = async (email, order) => {
  try {
    console.log("sendInvoice STARTED");

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
      doc.image(logoPath, 50, 40, { width: 90 });
    }

    doc
      .fontSize(10)
      .fillColor("gray")
      .text("Nykaa Pvt Ltd", 400, 40)
      .text("Mumbai, India", 400, 55)
      .text("GSTIN: 27AAACN1234A1Z5", 400, 70);

    doc
      .fontSize(20)
      .fillColor("#fc2779")
      .text("GST INVOICE", 0, 120, { align: "center" });

    const date = new Date().toLocaleDateString();

    doc
      .fontSize(11)
      .fillColor("black")
      .text(`Invoice No: INV-${order._id}`, 50, 160)
      .text(`Date: ${date}`, 400, 160);

    doc.moveTo(50, 185).lineTo(550, 185).stroke();

    doc.fontSize(12).text("Bill To:", 50, 200);

    doc
      .fontSize(11)
      .text(order.name, 50, 220)
      .text(order.address, 50, 235)
      .text(order.phone, 50, 250);

    const tableTop = 300;

    doc
      .fontSize(12)
      .fillColor("#fc2779")
      .text("Item", 50, tableTop)
      .text("Qty", 250, tableTop)
      .text("Price", 350, tableTop)
      .text("Total", 450, tableTop);

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    let y = tableTop + 30;

    doc.fillColor("black");

    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        doc.text(item.name, 50, y);
        doc.text(item.quantity || 1, 250, y);
        doc.text(`₹${item.price}`, 350, y);
        doc.text(`₹${item.price * (item.quantity || 1)}`, 450, y);

        y += 25;
      });
    } else {
      doc.text("Product", 50, y);
      doc.text("1", 250, y);
      doc.text(`₹${order.totalAmount}`, 350, y);
      doc.text(`₹${order.totalAmount}`, 450, y);
      y += 25;
    }

    y += 20;

    doc.moveTo(300, y).lineTo(550, y).stroke();

    y += 10;

    doc.text("Subtotal", 350, y);
    doc.text(`₹${order.totalAmount}`, 450, y);

    y += 20;

    doc.text("GST (18%)", 350, y);
    doc.text(`₹${gst.toFixed(2)}`, 450, y);

    y += 20;

    doc.moveTo(300, y).lineTo(550, y).stroke();

    y += 10;

    doc
      .fontSize(13)
      .fillColor("#fc2779")
      .text("Total", 350, y)
      .text(`₹${finalTotal.toFixed(2)}`, 450, y);

    doc
      .fontSize(12)
      .fillColor("#fc2779")
      .text("Thank you for shopping with Nykaa", 0, y + 60, {
        align: "center",
      });

    doc
      .fontSize(9)
      .fillColor("gray")
      .text("This is a computer generated invoice.", {
        align: "center",
      });

    doc.end();

    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    console.log("PDF GENERATED");

    await resend.emails.send({
      from: "Nykaa <onboarding@resend.dev>",
      to: email,
      subject: "Your GST Invoice - Nykaa",
      text: "Your invoice is attached.",
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
    console.log("ERROR:", err);
    return false;
  }
};

module.exports = sendInvoice;