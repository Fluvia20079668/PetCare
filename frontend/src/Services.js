// Services.js
import React, { useState } from "react";
import "./Services.css";
import { useNavigate } from "react-router-dom";

/* ICONS */
import { 
  FaDog, 
  FaCat, 
  FaBath, 
  FaWalking,
  FaClinicMedical, 
  FaBone 
} from "react-icons/fa";

export default function Services() {
  const navigate = useNavigate();
  const [bookingService, setBookingService] = useState(null);

  const SERVICES = [
    {
      id: "hostel",
      title: "Pet Hostel",
      desc: "Safe and comfortable overnight stay.",
      icon: <FaDog size={40} color="#008c95" />
    },
    {
      id: "daycare",
      title: "Pet Daycare",
      desc: "Play, rest, and supervision all day.",
      icon: <FaCat size={40} color="#008c95" />
    },
    {
      id: "grooming",
      title: "Grooming",
      desc: "Bath, nail trim & coat care.",
      icon: <FaBath size={40} color="#008c95" />
    },
    {
      id: "walking",
      title: "Pet Walking",
      desc: "Daily walks with trained staff.",
      icon: <FaWalking size={40} color="#008c95" />
    },
    {
      id: "vet",
      title: "Vet Checkup",
      desc: "Basic health assessment & advice.",
      icon: <FaClinicMedical size={40} color="#008c95" />
    },
    {
      id: "food",
      title: "Pet Food Delivery",
      desc: "Healthy meals delivered to your home.",
      icon: <FaBone size={40} color="#008c95" />
    }
  ];

  const openBooking = (svc) => setBookingService(svc);
  const closeBooking = () => setBookingService(null);

  return (
    <div className="services-page">

      {/* ======================= NAVBAR ======================= */}
      <nav className="pc-nav">
        <div className="pc-logo">🐾 PetCare+</div>

        <ul className="pc-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
      {/* ====================================================== */}

      <h1 className="services-title">Our Services</h1>
      <p className="services-subtitle">
        Choose the best care for your furry friend
      </p>

      <div className="services-grid">
        {SERVICES.map((svc) => (
          <div key={svc.id} className="service-card">
  <div className="service-icon">{svc.icon}</div>

  <h3>{svc.title}</h3>
  <p className="service-desc">{svc.desc}</p>

  {/* Learn More Toggle */}
  <p 
    className="learn-more" 
    onClick={() => setExpanded(expanded === svc.id ? null : svc.id)}
  >
    {expanded === svc.id ? "Hide details ▲" : "Learn more ▼"}
  </p>

  {/* Expanded Details */}
  {expanded === svc.id && (
    <div className="service-more">
      <p>{svc.details}</p>
    </div>
  )}

  <button 
    className="book-btn"
    onClick={() => openBooking(svc)}
  >
    Book Now
  </button>
</div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingService && (
        <div className="booking-overlay" onClick={closeBooking}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Book {bookingService.title}</h2>

            <input 
              type="text"
              className="booking-input"
              placeholder="Your Name"
            />

            <input 
              type="text"
              className="booking-input"
              placeholder="Your Pet's Name"
            />

            <input 
              type="date"
              className="booking-input"
            />

            <button className="booking-submit">Confirm Booking</button>
            <button className="booking-close" onClick={closeBooking}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
