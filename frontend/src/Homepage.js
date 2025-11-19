import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      {/* ✅ Top Navigation Bar */}
      <nav className="navbar">
        <div className="logo">PetCare+</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <div className="auth-buttons">
          <button onClick={() => navigate("/login")} className="btn-login">Login</button>
          <button onClick={() => navigate("/signup")} className="btn-signup">Sign Up</button>
        </div>
      </nav>

      {/* ✅ Hero Section */}
      <section id="home" className="hero-section fade-in">
        <div className="hero-text">
          <h1>Your Pet’s Health, Our Priority</h1>
          <p>Professional daycare and hostel services for your furry loved ones.</p>
          <button onClick={() => navigate("/services")} className="hero-btn">
            Explore Services
          </button>
        </div>

        <div className="hero-image">
          <img
            src="https://cdn.pixabay.com/photo/2017/02/20/18/03/dog-2088424_1280.png"
            alt="Pet Care"
          />
        </div>
      </section>

      {/* ✅ About Us */}
      <section id="about" className="about-section slide-up">
        <h2>About Us</h2>
        <p>
          We provide trusted and professional care for your pets. With modern facilities, 
          trained staff, and a passion for animals, we ensure your pet feels safe and loved.
        </p>
      </section>

      {/* ✅ Services */}
      <section id="services" className="services-section slide-up">
        <h2>Our Services</h2>

        <div className="services-grid">

          <div className="service-card">
            <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Daycare" />
            <h3>Daycare Booking</h3>
            <p>Safe & playful environment for your pets during the day.</p>
          </div>

          <div className="service-card">
            <img src="https://cdn-icons-png.flaticon.com/512/194/194279.png" alt="Hostel" />
            <h3>Hostel Booking</h3>
            <p>Comfortable & supervised overnight stays.</p>
          </div>

          <div className="service-card">
            <img src="https://cdn-icons-png.flaticon.com/512/616/616430.png" alt="Grooming" />
            <h3>Grooming</h3>
            <p>Professional grooming for cats & dogs.</p>
          </div>

        </div>
      </section>

      {/* ✅ Contact */}
      <section id="contact" className="contact-section slide-up">
        <h2>Contact Us</h2>

        <div className="contact-box">
          <p><strong>Email:</strong> support@petcare.com</p>
          <p><strong>Phone:</strong> +123 456 7890</p>
          <p><strong>Location:</strong> Dublin, Ireland</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 PetCare+. All Rights Reserved.</p>
      </footer>

    </div>
  );
}
