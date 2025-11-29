import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AuthForm.css";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const returnUrl = params.get("return") || "/login";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("http://localhost:8080/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (data.status === "success") {
        navigate(`/login?return=${encodeURIComponent(returnUrl)}`);
      } else {
        setMsg(data.message || "Signup error");
      }
    } catch (err) {
      setMsg("Server error");
    }
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
        <input
          className="auth-input"
          type="Phone"
          placeholder="Phone"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="auth-btn" type="submit">Sign Up</button>
      </form>

      <p className="back-home-link" onClick={() => navigate("/")}>
        ← Back to Home
      </p>

      {msg && <p className="message">{msg}</p>}
    </div>
  );
}
