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
const adminRoutes = require("./routes/admin");

const app = express();


app.use(cors({
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);

    if (
      origin === "http://localhost:5173" ||
      origin === "https://nykaa-workspace.vercel.app" ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    return callback(new Error("CORS blocked"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin", adminRoutes);


app.post("/api/test", (req, res) => {
  res.send("Test POST route working");
});

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
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
  console.log("Mongoose connection event: CONNECTED");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose runtime error:", err);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});