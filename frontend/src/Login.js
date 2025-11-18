import React, { useState } from "react";
import "./AuthForm.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setMessage(data.status === "success"
        ? `Welcome back, ${data.user.name}!`
        : data.message
      );
    } catch {
      setMessage("Server error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input className="auth-input" type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} required />

        <input className="auth-input" type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button className="auth-btn" type="submit">Login</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
