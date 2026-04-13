import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("mobile");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const handleProceed = async () => {
    try {
      const payload = mode === "mobile" ? { mobile } : { email };

      const response = await axios.post(
        "http://localhost:5000/api/auth/login/send-otp",
        payload
      );

      navigate("/otp", {
        state: {
          value: mode === "mobile" ? mobile : email,
          type: mode
        }
      });

    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left"></div>

      <div className="login-right">
        
        <div className="skip" onClick={() => navigate("/home")}>
          Skip
        </div>

        <div className="login-content">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/00/Nykaa_New_Logo.svg"
            alt="Nykaa"
            className="nykaa-logo"
          />

          <h2>Login or Signup</h2>

          <p className="subtitle">
            Get started & grab best offers on top brands!
          </p>

          {mode === "mobile" && (
            <div className="otp-row">
              <input
                type="text"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <button onClick={handleProceed}>
                Get OTP
              </button>
            </div>
          )}

          {mode === "email" && (
            <div className="otp-row">
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={handleProceed}>
                Proceed
              </button>
            </div>
          )}

          <div className="signup-btn" onClick={() => navigate("/signup")}>
            Sign up 
          </div>

          <div
            className="email-link"
            onClick={() => setMode(mode === "mobile" ? "email" : "mobile")}
          >
            {mode === "mobile"
              ? "Use Email ID"
              : "Use Mobile Number"}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;