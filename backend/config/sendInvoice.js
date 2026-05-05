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

    // ================= LOGO =================
    const logoPath = path.join(__dirname, "../assets/nykaa-logo.png");
    console.log("Checking logo:", logoPath);

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 90 });
    } else {
      console.log("❌ Logo NOT FOUND");
    }

    // ================= COMPANY INFO =================
    doc
      .fontSize(10)
      .fillColor("gray")
      .text("Nykaa Pvt Ltd", 350, 40)
      .text("Mumbai, India")
      .text("GSTIN: 27AAACN1234A1Z5");

    // ================= TITLE =================
    doc.moveDown(3);
    doc
      .fontSize(20)
      .fillColor("#fc2779")
      .text("GST INVOICE", { align: "center" });

    doc.moveDown(1);

    // ================= META =================
    const date = new Date().toLocaleDateString();

    doc
      .fontSize(11)
      .fillColor("black")
      .text(`Invoice No: INV-${order._id}`, 50)
      .text(`Date: ${date}`, 400);

    doc.moveDown();

    // divider
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // ================= CUSTOMER =================
    doc.fontSize(12).text("Bill To:");
    doc.fontSize(11).text(order.name);
    doc.text(order.address);
    doc.text(order.phone);

    doc.moveDown();

    // ================= TABLE HEADER =================
    doc
      .fontSize(12)
      .fillColor("#fc2779")
      .text("Item", 50)
      .text("Qty", 300)
      .text("Price", 370)
      .text("Total", 450);

    doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
    doc.moveDown();

    doc.fillColor("black");

    // ================= PRODUCTS =================
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        doc.text(item.name, 50);
        doc.text(item.quantity || 1, 300, doc.y - 15);
        doc.text(`₹${item.price}`, 370, doc.y - 15);
        doc.text(`₹${item.price * (item.quantity || 1)}`, 450, doc.y - 15);

        doc.moveDown();
      });
    } else {
      doc.text("Product", 50);
      doc.text("1", 300, doc.y - 15);
      doc.text(`₹${order.totalAmount}`, 370, doc.y - 15);
      doc.text(`₹${order.totalAmount}`, 450, doc.y - 15);
      doc.moveDown();
    }

    // ================= TOTAL SECTION =================
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    doc.text("Subtotal", 350);
    doc.text(`₹${order.totalAmount}`, 450, doc.y - 15);

    doc.moveDown();

    doc.text("GST (18%)", 350);
    doc.text(`₹${gst.toFixed(2)}`, 450, doc.y - 15);

    doc.moveDown();

    doc.moveTo(350, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    doc
      .fontSize(13)
      .fillColor("#fc2779")
      .text("Total", 350)
      .text(`₹${finalTotal.toFixed(2)}`, 450, doc.y - 15);

    doc.moveDown(3);

    // ================= FOOTER =================
    doc
      .fontSize(12)
      .fillColor("#fc2779")
      .text("Thank you for shopping with Nykaa 💖", {
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

    // ================= EMAIL =================
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