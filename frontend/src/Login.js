import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setUser } from "./utils/auth";
import "./AuthForm.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.state?.redirect; // e.g. "/booking"
  const service = location.state?.service; // e.g. "daycare"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.status === "success") {
        // store user
        setUser({ id: data.user.id, name: data.user.name, email: data.user.email });
        // if redirect requested, attach service query if needed
        if (redirect) {
          if (redirect === "/booking" && service) {
            navigate(`/booking?service=${encodeURIComponent(service)}`);
          } else {
            navigate(redirect);
          }
        } else {
          navigate("/"); // go to homepage by default
        }
      } else {
        setMsg(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error");
    }
  };

  return (
    <div className="auth-container slide-in-left">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input className="auth-input" type="email" placeholder="Email" value={email}
          onChange={(e)=>setEmail(e.target.value)} required />
        <input className="auth-input" type="password" placeholder="Password" value={password}
          onChange={(e)=>setPassword(e.target.value)} required />
        <button className="auth-btn" type="submit">Login</button>
      </form>
      {msg && <p className="message">{msg}</p>}
    </div>
  );
}
