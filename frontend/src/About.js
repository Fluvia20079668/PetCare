import React from "react";
import "./About.css";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page fade-in">

      {/* ---- TOP NAVBAR ---- */}
      <nav className="about-nav">
        <div className="about-logo" onClick={() => navigate("/")}>
          🐾 PetCare+
        </div>

        <ul className="about-links">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/services")}>Services</li>
          <li onClick={() => navigate("/contact")}>Contact</li>
        </ul>
      </nav>

      {/* ---- HEADER ---- */}
      <header className="about-header">
        <h1>About PetCare+</h1>
        <p>Your trusted partner in pet wellness and comfort.</p>
      </header>

      {/* ---- CONTENT ---- */}
      <section className="about-section">
        <h2>Who We Are</h2>
        <p>
          PetCare+ was created with one mission — to provide the highest level of care,
          comfort, and attention to pets of all types. From grooming and daycare to
          walking services and veterinary support, we ensure your pet always feels safe,
          healthy, and loved.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          To deliver exceptional pet care with compassion, professionalism, and a
          focus on creating a joyful experience for every pet and owner.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Vision</h2>
        <p>
          To become the most trusted pet-care provider in the region, known for
          safety, reliability, and heartfelt service.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Values</h2>
        <ul>
          <li>🐾 Compassion for all animals</li>
          <li>🐾 Professional and reliable services</li>
          <li>🐾 A safe and comfortable environment</li>
          <li>🐾 Trust and transparency with owners</li>
        </ul>
      </section>

    </div>
  );
}
