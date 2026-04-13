import React, { useState, useRef } from "react";
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

  const inputRefs = useRef([]);

  if (!value || !type) {
    navigate("/");
  }

  const handleChange = (e, index) => {
    if (isNaN(e.target.value)) return;

    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    if (e.target.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

   const handleVerify = async () => {
   const finalOtp = otp.join("");

  try {
    const payload =
      type === "mobile"
        ? { mobile: value, otp: finalOtp }
        : { email: value, otp: finalOtp };

    const response = await axios.post(
      "http://localhost:5000/api/auth/verify-otp",
      payload
    );

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("token", response.data.token);

    alert(response.data.message);

    navigate("/home");
  } catch (err) {
    setError("OTP is incorrect or expired. Please try again.");
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
            alt="Nykaa"
            className="nykaa-logo"
          />

          <h2>OTP Verification</h2>

          <p>
            Enter OTP received on <strong>{value}</strong>
          </p>

          <div className="otp-box-container">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="otp-box"
              />
            ))}
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="verify-btn" onClick={handleVerify}>
            Verify
          </button>

          <p className="resend">Resend OTP</p>

          <p className="terms">
            By continuing, I agree to Nykaa's T&Cs
          </p>
        </div>
      </div>
    </div>
  );
}

export default OTPPage;