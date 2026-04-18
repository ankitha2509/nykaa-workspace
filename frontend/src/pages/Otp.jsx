import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Otp.css";

function OTPPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const value = location.state?.value;
  const type = location.state?.type;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!value || !type) {
      navigate("/login");
    }
  }, []);

  const handleChange = (e, index) => {
    const val = e.target.value;

    if (isNaN(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError("");

      const finalOtp = otp.join("");

      const payload =
        type === "email"
          ? { email: value, otp: finalOtp }
          : { mobile: value, otp: finalOtp };

      const res = await axios.post(
        "https://backend-1bfu.onrender.com/api/auth/verify-otp",
        payload
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("isLoggedIn", "true");

      alert("Login Successful");
      navigate("/home");

    } catch (err) {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-wrapper">

      <div className="otp-left"></div>

      <div className="otp-right">

        <div className="skip" onClick={() => navigate("/home")}>
          Skip
        </div>

        <div className="otp-card">

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/00/Nykaa_New_Logo.svg"
            className="nykaa-logo"
          />

          <h2>OTP Verification</h2>

          <p>Enter OTP sent to</p>
          <strong>{value}</strong>

          <div className="otp-box-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                maxLength="1"
                value={digit}
                className="otp-box"
                onChange={(e) => handleChange(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="verify-btn" onClick={handleVerify}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <p className="resend">Resend OTP</p>

        </div>

      </div>
    </div>
  );
}

export default OTPPage;