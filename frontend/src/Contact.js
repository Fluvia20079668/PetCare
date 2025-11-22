import React from "react";
import { useNavigate } from "react-router-dom";
import "./Contact.css";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="contact-page fade-in">

      {/* NAVBAR */}
      <nav className="pc-nav">
        <div className="pc-logo" onClick={() => navigate("/")}>🐾 PetCare+</div>
        <ul className="pc-links">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/about")}>About</li>
          <li onClick={() => navigate("/services")}>Services</li>
        </ul>
      </nav>

      <header className="contact-header slide-in-left">
        <h1>Contact Us</h1>
        <p>We're here to help your pets anytime.</p>
      </header>

      <section className="contact-details fade-in">
        <p><strong>Email:</strong> support@petcare.com</p>
        <p><strong>Phone:</strong> +353 01 234 5678</p>
        <p><strong>Address:</strong> Dublin, Ireland</p>
      </section>

      <footer className="pc-footer">
        © {new Date().getFullYear()} PetCare+. All rights reserved.
      </footer>
    </div>
  );
}
