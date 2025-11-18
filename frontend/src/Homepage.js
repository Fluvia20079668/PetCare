import React from "react";
import { Link } from "react-router-dom";
import "./AuthForm.css"; // optional styling for simplicity

export default function Homepage() {
  return (
    <div style={{ maxWidth: 600, margin: "50px auto", textAlign: "center" }}>
      <h1>Welcome to PetCare!</h1>
      <p>Select a page to learn more:</p>
      <div style={{ marginTop: 30 }}>
        <Link to="/about" style={{ margin: "0 10px" }}>About Us</Link>
        <Link to="/contact" style={{ margin: "0 10px" }}>Contact Us</Link>
        <Link to="/services" style={{ margin: "0 10px" }}>Services</Link>
      </div>
    </div>
  );
}
