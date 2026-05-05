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


    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

  
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
    doc.text("Thank you for shopping with us");

    doc.end();

  
    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    console.log("📄 PDF GENERATED:", filePath);

    await resend.emails.send({
      from: "Nykaa <ankkithaapujari093001@gmail.com>", 
      to: email,
      subject: "Your GST Invoice - Nykaa",

      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 20px;">
        
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          
          <!-- HEADER WITH LOGO -->
          <div style="background: #fc2779; padding: 20px; text-align: center;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Nykaa_Logo.png" width="120" />
          </div>

          <!-- BODY -->
          <div style="padding: 20px;">
            <h2 style="color: #333;">Thank you for your order! 💖</h2>
            <p style="color: #555;">
              Hi ${order.name || "Customer"},<br><br>
              We’ve received your order successfully. Your GST invoice is attached with this email.
            </p>

            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${order._id}</p>
              <p><strong>Total Amount:</strong> ₹${finalTotal.toFixed(2)}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: #fc2779; color: white; padding: 12px 20px; border-radius: 5px; text-decoration: none;">
                View Order
              </a>
            </div>
          </div>

          <!-- FOOTER -->
          <div style="background: #fafafa; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            <p>© 2026 Nykaa Clone. All rights reserved.</p>
            <p>Support: support@nykaa.com</p>
          </div>

        </div>
      </div>
      `,

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