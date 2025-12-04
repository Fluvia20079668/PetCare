// Login.js

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AuthForm.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const returnUrl = params.get("return") || "/services";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (data.status === "success") {
        // Save token
        localStorage.setItem("token", data.token);

        // Save full user (THIS WAS THE ISSUE!)
        const userData = {
          _id: data.user._id,          // REQUIRED FOR BOOKINGS
          name: data.user.name,
          email: data.user.email,
          role: data.user.role || "user",
          avatar: data.user.avatar || "/default-avatar.png"
        };

        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect based on role
        if (userData.role === "admin") {
          navigate("/admin");
        } else {
          navigate(returnUrl || "/services");
        }
      } 
      else {
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setShowPopup(true);
    }
  };

  return (
    <div className="auth-container slide-in-left">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          className="auth-input"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" type="submit">Login</button>
      </form>

      <p className="back-home-link" onClick={() => navigate("/")}>
        ← Back to Home
      </p>

      <div className={`popup-slide ${showPopup ? "show" : ""}`}>
        <h3>Invalid Credentials</h3>
        <p>Email or password is incorrect.</p>

        <button
          className="popup-btn"
          onClick={() =>
            navigate(`/signup?return=${encodeURIComponent(`/login?return=${returnUrl}`)}`)
          }
        >
          Go to Sign Up
        </button>

        <button
          className="popup-btn"
          style={{ backgroundColor: "gray", marginTop: "10px" }}
          onClick={() => setShowPopup(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
