import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async () => {
    try {
      setLoading(true);

      await axios.post(`${API}/api/auth/signup/send-otp`, form);

      navigate("/otp", {
        state: {
          value: form.email,
          type: "email",
          purpose: "signup",
        },
      });

    } catch (error) {
      alert(error.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    form.name &&
    form.mobile.length === 10 &&
    form.email.includes("@");

  return (
    <div className="signup-wrapper">

      <div className="signup-left">
        <h1>Join Nykaa Beauty</h1>
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

          <h2>Create Account</h2>
          <p className="subtitle">
            Sign up with email & get OTP in inbox
          </p>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />

          <button
            className={isValid ? "active-btn" : "disabled-btn"}
            disabled={!isValid || loading}
            onClick={handleSignup}
          >
            {loading ? "Sending OTP..." : "Continue"}
          </button>

          <div
            className="login-link"
            onClick={() => navigate("/login")}
          >
            Already have account? Login
          </div>

        </div>
      </div>
    </div>
  );
}

export default Signup;