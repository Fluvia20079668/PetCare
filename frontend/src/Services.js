import React, { useState } from "react";
import "./Services.css";

export default function Services() {
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const handleBooking = (service) => {
    setSelectedService(service);
    setOpen(true);
  };

  return (
    <div className="services-page">
      <h1 className="services-title">Our Services</h1>

      <div className="services-grid">
        <div className="service-card">
          <h3>Pet Boarding</h3>
          <p>Safe and comfortable stay for your pets.</p>
          <button className="book-btn" onClick={() => handleBooking("Pet Boarding")}>
            Book Now
          </button>
        </div>

        <div className="service-card">
          <h3>Veterinary Care</h3>
          <p>Qualified vets for all your pet’s health needs.</p>
          <button className="book-btn" onClick={() => handleBooking("Veterinary Care")}>
            Book Now
          </button>
        </div>

        <div className="service-card">
          <h3>Pet Grooming</h3>
          <p>Professional grooming to keep your pet happy & fresh.</p>
          <button className="book-btn" onClick={() => handleBooking("Pet Grooming")}>
            Book Now
          </button>
        </div>

        <div className="service-card">
          <h3>Pet Training</h3>
          <p>Expert trainers for behavior and obedience training.</p>
          <button className="book-btn" onClick={() => handleBooking("Pet Training")}>
            Book Now
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {open && (
        <div className="booking-overlay">
          <div className="booking-modal">
            <h2>Book: {selectedService}</h2>

            <input type="text" placeholder="Your Name" className="booking-input" />
            <input type="text" placeholder="Your Phone" className="booking-input" />
            <input type="date" className="booking-input" />

            <button className="booking-submit">Confirm Booking</button>
            <button className="booking-close" onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
