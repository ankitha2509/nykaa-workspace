const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Order = require("../models/Order");

router.get("/stats", async (req, res) => {
  try {
    // 🔥 USERS
    const totalUsers = await User.countDocuments();

    // 🔥 ORDERS
    const orders = await Order.find();
    const totalOrders = orders.length;

    // 🔥 SALES
    const totalSales = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    const totalGST = totalSales * 0.18;
    const totalRevenue = totalSales + totalGST;

    // 🔥 FIXED STATUS COUNT (IMPORTANT)
    const statusCount = {
      Completed: 0,
      Pending: 0,
      Cancelled: 0,
    };

    orders.forEach((order) => {
      const status = (order.status || "").toLowerCase();

      if (status === "completed") statusCount.Completed++;
      else if (status === "pending") statusCount.Pending++;
      else if (status === "cancelled") statusCount.Cancelled++;
    });

    console.log("STATUS COUNT:", statusCount); // DEBUG

    // 🔥 MONTHLY SALES
    const monthlySales = {};

    orders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleString("default", {
        month: "short",
      });

      if (!monthlySales[month]) {
        monthlySales[month] = 0;
      }

      monthlySales[month] += order.totalAmount || 0;
    });

    const salesData = Object.keys(monthlySales).map((month) => ({
      month,
      sales: monthlySales[month],
    }));

    res.json({
      totalUsers,
      totalOrders,
      totalSales,
      totalRevenue,
      statusCount,
      salesData,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Dashboard error" });
  }
});

module.exports = router;