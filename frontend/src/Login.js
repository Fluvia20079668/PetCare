import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false); // default: false
  const [slideIn, setSlideIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSlideIn(true); // slide in effect on mount
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setShowPopup(false); // reset popup on new login attempt

    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // Show popup only if credentials are invalid
      if (data.status === "success") {
        navigate("/home");
      } else if (data.status === "fail") {
        setShowPopup(true);
      } else {
        console.error("Unexpected response:", data);
      }
    } catch (err) {
      console.error(err);
      setShowPopup(true);
    }
  };

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className={`auth-container ${slideIn ? "slide-in-left" : ""}`}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="auth-btn" type="submit">
          Login
        </button>
      </form>

      {/* Sliding popup shows only on invalid login */}
      {showPopup && (
        <div className="popup-slide show">
          <p>Invalid login! Please register if you don't have an account.</p>
          <div style={{ marginTop: "15px" }}>
            <button className="popup-btn" onClick={handleSignUpRedirect}>
              Sign Up
            </button>
            <button className="popup-btn" onClick={handleClosePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
