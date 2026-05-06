const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Order = require("../models/Order");

router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const orders = await Order.find();

    const totalOrders = orders.length;

    const totalSales = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    const totalGST = totalSales * 0.18;
    const totalRevenue = totalSales + totalGST;

    const statusCount = {
      Completed: 0,
      Pending: 0,
      Cancelled: 0,
    };

    orders.forEach((order) => {
      const status = order.status?.toLowerCase();

      if (status === "completed") statusCount.Completed++;
      else if (status === "pending") statusCount.Pending++;
      else if (status === "cancelled") statusCount.Cancelled++;
    });

    const monthlySales = {};

    orders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleString("default", {
        month: "short",
      });

      if (!monthlySales[month]) monthlySales[month] = 0;

      monthlySales[month] += order.totalAmount || 0;
    });

    const salesData = Object.keys(monthlySales).map((month) => ({
      month,
      sales: monthlySales[month],
    }));

    console.log("STATUS COUNT:", statusCount); 

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