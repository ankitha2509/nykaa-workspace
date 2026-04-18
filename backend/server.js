const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const addressRoutes = require("./routes/address");
const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/order");

const app = express();

// ✅ MIDDLEWARE
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://nykaa-workspace.vercel.app",
    "https://nykaa-workspace-ar3dah8fp-ankitha2509s-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));
// static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/order", orderRoutes);

// test route
app.post("/api/test", (req, res) => {
  res.send("Test POST route working");
});

// home route
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

// 🔥 FIXED MONGODB CONNECTION (IMPORTANT PART)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
    process.exit(1); // 🔴 STOP SERVER if DB fails
  });

// extra debug logs (VERY USEFUL IN RENDER)
mongoose.connection.on("connected", () => {
  console.log("📦 Mongoose connection event: CONNECTED");
});

mongoose.connection.on("error", (err) => {
  console.log("❌ Mongoose runtime error:", err);
});

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});