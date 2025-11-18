import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false); // popup visibility
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.status === "success") {
        navigate("/home"); // successful login
      } else {
        // wrong login → show popup
        setShowPopup(true);
      }
    } catch {
      setShowPopup(true);
    }
  };

  const handleSignInRedirect = () => {
    navigate("/"); // redirect back to login page
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="auth-container">
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
        <button className="auth-btn" type="submit">Login</button>
      </form>

      {/* Sliding popup */}
      <div className={`popup-slide ${showPopup ? "show" : ""}`}>
        <p>Invalid login!</p>
        <div style={{ marginTop: "15px" }}>
          <button className="popup-btn" onClick={handleSignInRedirect}>
            Sign In
          </button>
          <button className="popup-btn" onClick={handleClosePopup}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
