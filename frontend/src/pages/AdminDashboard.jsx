import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar,
  PieChart, Pie, Cell,
  ResponsiveContainer
} from "recharts";

function AdminDashboard() {
  const navigate = useNavigate();

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4500 },
  ];

  const ordersData = [
    { name: "Completed", value: 70 },
    { name: "Pending", value: 20 },
    { name: "Cancelled", value: 10 },
  ];

  const usersData = [
    { month: "Jan", users: 50 },
    { month: "Feb", users: 80 },
    { month: "Mar", users: 120 },
    { month: "Apr", users: 150 },
  ];

  const COLORS = ["#fc2779", "#36A2EB", "#FFCE56"];

  return (
    <div className="admin-wrapper">

      <header className="admin-header">
        <div className="logo">NYKAA ADMIN</div>
      </header>

      <div className="admin-body">

        <div className="sidebar">

          <div>
            <div className="menu-section">
              <p className="menu-title">GENERAL</p>
              <ul>
                <li onClick={() => navigate("/admin/dashboard")}>Dashboard</li>
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

          <button className="logout-btn" onClick={logoutAdmin}>
            Logout
          </button>

        </div>

        <div className="main-content">

          <h1>Dashboard Overview</h1>

          {/* CARDS */}
          <div className="dashboard-cards">
            <div className="card"><h3>Total Sales</h3><h2>₹50,000</h2></div>
            <div className="card"><h3>Total Orders</h3><h2>120</h2></div>
            <div className="card"><h3>Users</h3><h2>85</h2></div>
            <div className="card"><h3>Revenue</h3><h2>₹75,000</h2></div>
          </div>

          {/* CHARTS */}
          <div className="charts-grid">

            <div className="chart-card">
              <h3>Sales Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#fc2779" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>User Growth</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={usersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#36A2EB" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Orders Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={ordersData} dataKey="value" outerRadius={80}>
                    {ordersData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;