import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="admin-wrapper">

      <header className="admin-header">
        <div className="logo">NYKAA ADMIN</div>
      </header>

      <div className="admin-body">

        <div className="sidebar">

          <div className="menu-section">
            <p className="menu-title">GENERAL</p>

            <ul>
              <li onClick={() => navigate("/admin/dashboard")}>
                Dashboard
              </li>

              <li onClick={() => navigate("/admin/add-product")}>
                Add Product
              </li>

              <li onClick={() => navigate("/admin/view-products")}>
                View Products
              </li>

              <li onClick={() => navigate("/admin/view-admin")}>
                View Admin
              </li>
            </ul>
          </div>

        
          <div className="menu-section">
            <p className="menu-title">ACCOUNT</p>

            <ul>
              <li onClick={() => navigate("/admin/settings")}>
                Settings
              </li>

              <li onClick={() => navigate("/admin/manage-orders")}>
                Manage Orders
              </li>

              <li onClick={() => navigate("/admin/manage-users")}>
                Manage Users
              </li>
            </ul>
          </div>

          <div className="menu-section">
            <p className="menu-title">SUPPORT</p>

            <ul>
              <li onClick={() => navigate("/admin/help")}>
                Help Center
              </li>
            </ul>
          </div>

          <div className="logout-section">
            <button onClick={logoutAdmin}>
              Logout
            </button>
          </div>

        </div>

     
        <div className="main-content">

          <h1>Welcome to Dashboard </h1>

          <p>
            Manage Products, Orders, Users and Settings
            from sidebar.
          </p>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;