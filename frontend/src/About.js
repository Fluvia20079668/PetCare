import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-root fade-in">
      
      {/* NAVBAR */}
      <nav className="pc-nav">
        <div className="pc-logo" onClick={() => navigate("/")}>🐾 PetCare+</div>
        <ul className="pc-links">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/services")}>Services</li>
          <li onClick={() => navigate("/contact")}>Contact</li>
        </ul>
      </nav>

      {/* HEADER */}
      <header className="about-header slide-in-left">
        <h1>About Us</h1>
        <p>Your pet's comfort, safety and happiness is our mission.</p>
      </header>

      {/* CONTENT */}
      <section className="about-section fade-in">
        <h2>Who We Are</h2>
        <p>
          PetCare+ provides world-class services including daycare, grooming,
          boarding, walking and veterinary care. Our trained pet-carers ensure
          every pet feels safe and loved.
        </p>
      </section>

      <section className="about-section fade-in">
        <h2>Our Mission</h2>
        <p>
          To create a safe, fun and trusted environment where pets receive the
          best care possible.
        </p>
      </section>

      <section className="about-section fade-in">
        <h2>Why Choose Us?</h2>
        <ul>
          <li>🐾 Trained and verified staff</li>
          <li>🐾 Safe and hygienic environment</li>
          <li>🐾 Play zones and activity areas</li>
          <li>🐾 24/7 on-site support</li>
        </ul>
      </section>

      <footer className="pc-footer">
        © {new Date().getFullYear()} PetCare+. All rights reserved.
      </footer>
    </div>
  );
}
