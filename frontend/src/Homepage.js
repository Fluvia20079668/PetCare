import React from "react";
import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to PetCare</h1>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/about" style={{ marginRight: 10 }}>About Us</Link>
        <Link to="/contact" style={{ marginRight: 10 }}>Contact Us</Link>
        <Link to="/services" style={{ marginRight: 10 }}>Services</Link>
      </nav>
      <p>This is your homepage. You can navigate to other pages using the links above.</p>
    </div>
  );
}
