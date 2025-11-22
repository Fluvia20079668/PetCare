import React from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";

export default function Services() {
  const navigate = useNavigate();

  const SERVICES = [
    { id:"daycare", title:"Daycare", desc:"Safe & fun environment." },
    { id:"hostel", title:"Hostel", desc:"Comfortable overnight stay." },
    { id:"grooming", title:"Grooming", desc:"Professional pet grooming." },
    { id:"walking", title:"Walking", desc:"Daily walks & exercise." },
    { id:"vetcheck", title:"Vet Checkup", desc:"Routine health check." },
    { id:"food", title:"Food Delivery", desc:"Healthy food to your door." }
  ];

  return (
    <div className="services-page fade-in">

      {/* NAVBAR */}
      <nav className="pc-nav">
        <div className="pc-logo" onClick={() => navigate("/")}>🐾 PetCare+</div>
        <ul className="pc-links">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/about")}>About</li>
          <li onClick={() => navigate("/contact")}>Contact</li>
        </ul>
      </nav>

      <header className="services-header slide-in-right">
        <h1>Our Services</h1>
        <p>Premium care for your pets.</p>
      </header>

      <section className="services-grid">
        {SERVICES.map((s) => (
          <div className="service-card zoom-in" key={s.id}>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <button className="btn-primary small">Learn More</button>
          </div>
        ))}
      </section>

      <footer className="pc-footer">
        © {new Date().getFullYear()} PetCare+. All rights reserved.
      </footer>
    </div>
  );
}
