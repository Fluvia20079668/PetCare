import React, { useState } from "react";
import "./AuthForm.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

   // Show flash message from Login
  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch {
      setMessage("Server error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>

      <form onSubmit={handleSignup}>
        <input className="auth-input" type="text" placeholder="Name"
          value={name} onChange={(e) => setName(e.target.value)} />

        <input className="auth-input" type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <input className="auth-input" type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="auth-btn" type="submit">Signup</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
