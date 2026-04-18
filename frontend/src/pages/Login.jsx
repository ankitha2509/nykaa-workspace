import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    try {
      setLoading(true);

      await axios.post(
        `${API}/api/auth/login/send-otp`,
        { email }
      );

      navigate("/otp", {
        state: {
          value: email,
          type: "email",
          purpose: "login"
        }
      });

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const valid = email.includes("@");

  return (
    <div className="login-wrapper">

      <div className="login-left">
        <h1>Welcome Back</h1>
      </div>

      <div className="login-right">

        <div
          className="skip"
          onClick={() => navigate("/home")}
        >
          Skip
        </div>

        <div className="login-content">

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/00/Nykaa_New_Logo.svg"
            alt="Nykaa"
            className="nykaa-logo"
          />

          <h2>Login</h2>

          <p className="subtitle">
            Enter your email & receive OTP
          </p>

          <input
            type="email"
            placeholder="Enter Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <button
            className={valid ? "active-btn" : "disabled-btn"}
            disabled={!valid || loading}
            onClick={handleProceed}
          >
            {loading ? "Sending OTP..." : "Continue"}
          </button>

          <div
            className="signup-link"
            onClick={() => navigate("/signup")}
          >
            New user? Sign Up
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;