import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
  ResponsiveContainer
} from "recharts";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "https://backend-1bfu.onrender.com/api/dashboard/stats"
        );
        console.log("STATS:", res.data); // DEBUG
        setStats(res.data);
      } catch (err) {
        console.log("Dashboard error:", err);
      }
    };

    fetchStats();
  }, []);

  const COLORS = ["#fc2779", "#36A2EB", "#FFCE56"];

  const ordersData = [
    {
      name: "Completed",
      value: stats?.statusCount?.Completed || 0,
    },
    {
      name: "Pending",
      value: stats?.statusCount?.Pending || 0,
    },
    {
      name: "Cancelled",
      value: stats?.statusCount?.Cancelled || 0,
    },
  ];

  return (
    <div className="admin-wrapper">

      <header className="admin-header">
        <div className="logo">💄 NYKAA ADMIN PANEL</div>
      </header>

      <div className="admin-body">

        {/* SIDEBAR */}
        <div className="sidebar">
          <div>
            <div className="menu-section">
              <p className="menu-title">GENERAL</p>
              <ul>
                <li onClick={() => navigate("/admindashboard")}>Dashboard</li>
                <li onClick={() => navigate("/admin/add-product")}>Add Product</li>
                <li onClick={() => navigate("/admin/view-products")}>View Products</li>
              </ul>
            </div>

            <div className="menu-section">
              <p className="menu-title">ACCOUNT</p>
              <ul>
                <li onClick={() => navigate("/admin/manage-orders")}>Manage Orders</li>
                <li onClick={() => navigate("/admin/manage-users")}>Manage Users</li>
              </ul>
            </div>
          </div>

          <div className="logout-section">
            <button className="logout-btn" onClick={logoutAdmin}>
              Logout
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div className="main-content">
          <h1>Dashboard Overview</h1>

          {/* CARDS */}
          <div className="dashboard-cards">
            <div className="card">
              <h3>💰 Total Sales</h3>
              <p>₹{stats?.totalSales || 0}</p>
            </div>

            <div className="card">
              <h3>📦 Orders</h3>
              <p>{stats?.totalOrders || 0}</p>
            </div>

            <div className="card">
              <h3>👤 Users</h3>
              <p>{stats?.totalUsers || 0}</p>
            </div>

            <div className="card">
              <h3>💳 Revenue</h3>
              <p>₹{stats?.totalRevenue || 0}</p>
            </div>
          </div>

          {/* CHARTS */}
          <div className="charts-grid">

            {/* LINE */}
            <div className="chart-card">
              <h3>Sales Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stats?.salesData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#fc2779" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* PIE */}
            <div className="chart-card">
              <h3>Orders Status</h3>

              {ordersData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={ordersData}
                      dataKey="value"
                      outerRadius={80}
                      label
                    >
                      {ordersData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: "center", marginTop: "50px" }}>
                  No order data available
                </p>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;