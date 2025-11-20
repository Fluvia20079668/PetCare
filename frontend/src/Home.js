// Home.js - Clean Vibrant Pet-Themed UI
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "./utils/auth";
import "./Home.css";

const SERVICES = [
  {
    id: "daycare",
    title: "Daycare",
    short: "Safe & playful day environment for pets.",
    details:
      "Full-day supervision, playtime, feeding, and short walks. Staffed by trained carers."
  },
  {
    id: "hostel",
    title: "Hostel",
    short: "Comfortable overnight stays with supervision.",
    details:
      "Overnight accommodation, regular feeding, temperature-controlled rooms and nightly checks."
  },
  {
    id: "grooming",
    title: "Grooming",
    short: "Professional grooming for cats & dogs.",
    details:
      "Bathing, brushing, nail trimming and coat styling performed by experienced groomers."
  },
  {
    id: "walking",
    title: "Pet Walking",
    short: "Daily walks tailored to your pet’s needs.",
    details:
      "Short/long walks, solo or group, enrichment activities and GPS-tracked routes (optional)."
  },
  {
    id: "vetcheck",
    title: "Veterinary Checkup",
    short: "Routine health check and vaccinations.",
    details:
      "Qualified vets for routine checkups, vaccination checks and basic medical advice."
  },
  {
    id: "food",
    title: "Food Delivery",
    short: "Healthy pet food delivered to your door.",
    details:
      "Premium food brands, subscription or one-off deliveries. Custom diet plans available."
  }
];

export default function Home() {
  const [modalService, setModalService] = useState(null);
  const navigate = useNavigate();

  const openService = (svc) => setModalService(svc);
  const closeModal = () => setModalService(null);

  const handleBookNow = (svc) => {
    if (!isLoggedIn()) {
      navigate("/login", { state: { redirect: "/booking", service: svc.id } });
      return;
    }
    navigate(`/booking?service=${encodeURIComponent(svc.id)}`);
  };

  return (
    <div className="home-root fade-in">
      {/* NAVBAR */}
      <nav className="pc-nav">
        <div className="pc-logo">🐾 PetCare+</div>
        <ul className="pc-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="pc-auth">
          <button className="btn-outline" onClick={() => navigate("/login")}>Login</button>
          <button className="btn-primary" onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header id="home" className="hero">
        <div className="hero-left slide-in-left">
          <h1>Your Pet’s Health, Our Priority</h1>
          <p>
            Professional daycare, safe hostels, grooming and premium services —
            everything your pet needs.
          </p>
          <div className="hero-ctas">
            <button
              className="btn-primary big"
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Services
            </button>
          </div>
        </div>

        <div className="hero-right slide-in-right">
          <img
            alt="happy dog"
            src="https://cdn.pixabay.com/photo/2016/02/19/11/19/dog-1209283_1280.png"
          />
        </div>
      </header>

      {/* ABOUT */}
      <section id="about" className="section about fade-in">
        <h2>About Us</h2>
        <p>
          With years of trusted experience, PetCare+ provides a warm and caring environment
          for pets of all kinds. Your pet’s comfort and safety are our top priorities.
        </p>
      </section>

      {/* SERVICES */}
      <section id="services" className="section services fade-in">
        <h2>Our Services</h2>

        <div className="services-grid">
          {SERVICES.map((s) => (
            <article key={s.id} className="service-card zoom-in">
              <h3>{s.title}</h3>
              <p className="muted">{s.short}</p>
              <div className="service-actions">
                <button className="btn-link" onClick={() => openService(s)}>Learn More</button>
                <button className="btn-primary small" onClick={() => handleBookNow(s)}>Book</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section contact fade-in">
        <h2>Contact Us</h2>
        <div className="contact-card">
          <p><strong>Email:</strong> support@petcare.com</p>
          <p><strong>Phone:</strong> +353 01 234 5678</p>
          <p><strong>Address:</strong> Dublin, Ireland</p>
        </div>
      </section>

      <footer className="pc-footer">
        © {new Date().getFullYear()} PetCare+. All rights reserved.
      </footer>

      {/* MODAL */}
      {modalService && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal slide-up" onClick={(e) => e.stopPropagation()}>
            <h3>{modalService.title}</h3>
            <p>{modalService.details}</p>
            <div className="modal-actions">
              <button className="btn-primary" onClick={() => handleBookNow(modalService)}>Book Now</button>
              <button className="btn-outline" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}