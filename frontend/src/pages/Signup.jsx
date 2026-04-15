import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("mobile");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const handleSignup = async () => {
    try {
      const payload =
        mode === "mobile" ? { mobile } : { email };

      const response = await axios.post(
        "https://backend-1bfu.onrender.com/api/auth/signup/send-otp",
        payload
      );

      navigate("/otp", {
        state: {
          value: mode === "mobile" ? mobile : email,
          type: mode,
          purpose: "signup"
        }
      });

    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const isValid =
    mode === "mobile"
      ? mobile.length === 10
      : email.includes("@");

  return (
    <div className="signup-wrapper">

      <div className="signup-left">
       
      </div>
      <div className="signup-right">

        <div className="skip" onClick={() => navigate("/home")}>
          Skip
        </div>

        <div className="signup-content">

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/00/Nykaa_New_Logo.svg"
            alt="Nykaa"
            className="nykaa-logo"
          />

          <h2>Sign Up</h2>

          <p className="subtitle">
            Create your account to explore beauty products!
          </p>

          {mode === "mobile" && (
            <div className="input-row">
              <input
                type="text"
                placeholder="Enter Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          )}

          {mode === "email" && (
            <div className="input-row">
              <input
                type="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <button
            className={isValid ? "active-btn" : "disabled-btn"}
            onClick={handleSignup}
            disabled={!isValid}
          >
            Continue
          </button>

          <div
            className="toggle-link"
            onClick={() =>
              setMode(mode === "mobile" ? "email" : "mobile")
            }
          >
            {mode === "mobile"
              ? "Use Email Instead"
              : "Use Mobile Instead"}
          </div>

          <div
            className="login-link"
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
            
          </div>

        </div>
      </div>
    </div>
  );
}

export default Signup;