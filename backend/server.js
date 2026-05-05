require("dotenv").config();
process.env.NODE_OPTIONS = "--dns-result-order=ipv4first";

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const addressRoutes = require("./routes/address");
const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/order");
const adminRoutes = require("./routes/admin");

const app = express();


// ✅ FIXED CORS (VERY IMPORTANT)
app.use(cors({
  origin: true, // allow all (fixes Vercel + localhost)
  credentials: true
}));


// ✅ Middleware
app.use(express.json());


// ✅ Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin", adminRoutes);


// ✅ Test route
app.post("/api/test", (req, res) => {
  res.send("Test POST route working");
});


// ✅ Root route
app.get("/", (req, res) => {
  res.send("Backend Running Successfully 🚀");
});


// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });


// Optional logs
mongoose.connection.on("connected", () => {
  console.log("📡 Mongoose CONNECTED");
});

mongoose.connection.on("error", (err) => {
  console.log("⚠️ Mongoose ERROR:", err);
});


// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

