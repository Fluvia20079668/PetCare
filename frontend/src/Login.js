import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./AuthForm.css";

const API_BASE = process.env.REACT_APP_API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  
  // This will be the path the user wanted to access before being sent to login.
  const params = new URLSearchParams(location.search);
  const returnUrl = params.get("return") || "/"; // Default to home if no return path

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Try user login first
      const res = await fetch(`${API_BASE}/users/login`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("token", data.token);

        // Save user in context
        login({
          id: data.user.id, 
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        });

        // Redirect based on role
        if (data.user.role === "admin") navigate("/admin");
        // Redirect to the stored returnUrl
        else navigate(returnUrl); 

        return;
      }

      // If user login fails, try admin login
      const adminRes = await fetch(`${API_BASE}/admin/login`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const adminData = await adminRes.json();

      if (adminData.status === "success") {
        localStorage.setItem("token", adminData.token);

        login({
          id: adminData.user.id,
          name: adminData.user.name,
          email: adminData.user.email,
          role: adminData.user.role,
        });

        navigate("/admin");
        return;
      }

      setShowPopup(true);
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

      {showPopup && (
        <div className="popup-slide show">
          <h3>Invalid Credentials</h3>
          <p>Email or password is incorrect.</p>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
}