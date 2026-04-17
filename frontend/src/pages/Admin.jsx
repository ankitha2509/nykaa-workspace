import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();

  const STATIC_EMAIL = "admin@nykaa.com";
  const STATIC_PASSWORD = "Admin@123";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === STATIC_EMAIL && password === STATIC_PASSWORD) {
      alert("Login Successful");
      navigate("/admindashboard");
    } else {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-left"></div>

      <div className="admin-login-right">
        <div className="admin-login-content">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/00/Nykaa_New_Logo.svg"
            alt="Nykaa"
            className="nykaa-logo"
          />

          <h2>Admin Login</h2>
          <div className="otp-row">
            <input
              type="email"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="otp-row">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="submit-btn" onClick={handleLogin}>
            Login
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;