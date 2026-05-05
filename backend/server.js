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
const dashboardRoutes = require("./routes/dashboard");


const app = express();

app.use(cors({
  origin: true, 
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);


app.post("/api/test", (req, res) => {
  res.send("Test POST route working");
});


app.get("/", (req, res) => {
  res.send("Backend Running Successfully ");
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
    process.exit(1);
  });


mongoose.connection.on("connected", () => {
  console.log("📡 Mongoose CONNECTED");
});

mongoose.connection.on("error", (err) => {
  console.log(" Mongoose ERROR:", err);
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

