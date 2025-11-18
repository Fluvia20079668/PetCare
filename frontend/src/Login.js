import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
    } catch {
      setMessage("Server error, please try again later");
    }
  };

  const handleBackToLogin = () => {
    const container = document.querySelector(".auth-container");
    container.classList.add("slide-out-right");
    setTimeout(() => navigate("/"), 500); // wait for slide-out
  };

  return (
    <div className="auth-container slide-in-right">
      <h2>Create Account</h2>
      <form onSubmit={handleSignup}>
        <input
          className="auth-input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button className="auth-btn" type="submit">Sign Up</button>
      </form>

      {message && <p style={{ marginTop: "15px", color: "red" }}>{message}</p>}

      {/* Back to Login */}
      <button
        className="auth-btn"
        style={{ marginTop: "20px", backgroundColor: "#007bff" }}
        onClick={handleBackToLogin}
      >
        Back to Login
      </button>
    </div>
  );
}
