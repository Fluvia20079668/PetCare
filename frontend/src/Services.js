import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Services.css";
import { FaDog, FaCat, FaBath, FaWalking, FaClinicMedical, FaBone } from "react-icons/fa";

const BANNER_IMAGE = "/dogbanner.jpg";

const ALL_SERVICES = [
  { id: "daycare", title: "Daycare", short: "Safe & playful environment for pets.", details: "Full-day supervision, playtime, feeding and enrichment activities with trained caretakers.", icon: <FaCat size={36} color="#008c95" />, image: BANNER_IMAGE },
  { id: "hostel", title: "Pet Hostel", short: "Comfortable overnight stay for your pet.", details: "Temperature-controlled rooms, 24/7 supervision, feeding schedules, comfort bedding and playtime.", icon: <FaDog size={36} color="#008c95" />, image: BANNER_IMAGE },
  { id: "grooming", title: "Grooming", short: "Bathing, nail trimming & coat styling.", details: "Professional groomers providing washing, ear cleaning, coat trimming and spa treatments.", icon: <FaBath size={36} color="#008c95" />, image: BANNER_IMAGE },
  { id: "walking", title: "Pet Walking", short: "Daily walks for exercise & happiness.", details: "Short or long walks, GPS tracking, solo or group walking options available.", icon: <FaWalking size={36} color="#008c95" />, image: BANNER_IMAGE },
  { id: "vetcheck", title: "Vet Checkup", short: "Routine health check & treatments.", details: "Vaccinations, general checkups, minor treatments and professional health advice.", icon: <FaClinicMedical size={36} color="#008c95" />, image: BANNER_IMAGE },
  { id: "food", title: "Pet Food Delivery", short: "Healthy food delivered to your doorstep.", details: "Premium diet plans, fast delivery & monthly subscription options.", icon: <FaBone size={36} color="#008c95" />, image: BANNER_IMAGE }
];

export default function Services() {
  const [bookingService, setBookingService] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [form, setForm] = useState({ name: "", petName: "", petType: "", slot: "", day: "", description: "" });
  const [detailsService, setDetailsService] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  const isLoggedIn = user && user.id;

  // Restore service from URL (?book=xxx)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const svcId = params.get("book");
    if (!svcId) return;
    const svc = ALL_SERVICES.find((x) => x.id === svcId);
    if (svc) setBookingService(svc);
  }, [location.search]);

  useEffect(() => {
    if (bookingService && user) {
      setForm((p) => ({ ...p, name: user.name || "" }));
    }
  }, [bookingService, user]);

  const openBooking = (svc) => {
    if (!isLoggedIn) {
      const returnUrl = `/services?book=${svc.id}`;
      navigate(`/login?return=${encodeURIComponent(returnUrl)}`);
      return;
    }

    setBookingService(svc);
    setForm({
      name: user.name,
      petName: "",
      petType: "",
      slot: "",
      day: "",
      description: ""
    });
  };

  const closeBooking = () => setBookingService(null);
  const openDetails = (svc) => {
    setDetailsService(svc);
    useEffect(() => {
  if (detailsService) {
    document.getElementById("service-details")?.scrollIntoView({ behavior: "smooth" });
  }
}, [detailsService]);

  };
  const closeDetails = () => setDetailsService(null);

  // ⭐ Universal Booking API
  const confirmBooking = async () => {
    if (!user || !user.id) {
      alert("You must be logged in to book.");
      return;
    }

    const payload = {
      userId: user.id,
      serviceType: bookingService.id,
      name: form.name,
      petName: form.petName,
      petType: form.petType,
      slot: form.slot,
      day: form.day,
      description: form.description
    };

    try {
      const res = await fetch("http://localhost:8080/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.status === "success") {
        alert("Booking done successfully!");
        closeBooking();
      } else {
        alert(data.message || "Booking failed. Try again.");
      }
    } catch (err) {
      alert("Server error. Try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="services-page">
      <nav className="services-navbar">
        <div className="nav-left">PetCare+</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/services" className="active">Services</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {isLoggedIn ? (
            <span className="logout-btn" onClick={handleLogout}>Logout</span>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>

      <div className="small-banner">
        <img src={BANNER_IMAGE} alt="banner" />
        <div className="banner-overlay">
          <h1>Our Services</h1>
          <p>Everything your pet needs, in one place.</p>
        </div>
      </div>

      <div className="services-grid">
        {ALL_SERVICES.map((svc) => (
          <div key={svc.id} className="service-card fade-up">
            <div className="service-card-top">
              <div className="service-icon">{svc.icon}</div>
              <h3>{svc.title}</h3>
            </div>

            <p className="service-desc">{svc.short}</p>

            <div className="card-actions">
              <button
                className="learn-btn"
                onClick={() => {
                  setExpandedId(expandedId === svc.id ? null : svc.id);
                  openDetails(svc);
                }}
              >
                {expandedId === svc.id ? "Hide ▲" : "Learn More ▼"}
              </button>

              <button className="book-btn" onClick={() => openBooking(svc)}>Book</button>
            </div>

            {expandedId === svc.id && (
              <div className="service-more small">
                <p>{svc.details}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SERVICE DETAILS PANEL */}
      {detailsService && (
        <section id="service-details" className="details-panel">
          <div className="details-inner">
            <div className="details-image">
              <img src={detailsService.image} alt={detailsService.title} />
            </div>
            <div className="details-content">
              <h2>{detailsService.title}</h2>
              <p>{detailsService.details}</p>

              <div className="details-actions">
                <button className="btn-primary" onClick={() => openBooking(detailsService)}>
                  Book Now
                </button>
                <button className="btn-outline" onClick={closeDetails}>Close</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* BOOKING MODAL */}
      {bookingService && (
        <div className="booking-overlay" onClick={closeBooking}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Book: {bookingService.title}</h2>

            <input className="booking-input" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="booking-input" placeholder="Pet Name" value={form.petName} onChange={(e) => setForm({ ...form, petName: e.target.value })} />
            <input className="booking-input" placeholder="Pet Type" value={form.petType} onChange={(e) => setForm({ ...form, petType: e.target.value })} />

            <select className="booking-input" value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })}>
              <option value="">Select Slot</option>
              <option>9 AM - 11 AM</option>
              <option>11 AM - 1 PM</option>
              <option>3 PM - 5 PM</option>
            </select>

            <select className="booking-input" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
              <option value="">Select Day</option>
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
              <option>Saturday</option>
            </select>

            <textarea className="booking-input" placeholder="Pet Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <button className="booking-submit" onClick={confirmBooking}>Confirm</button>
            <button className="booking-close" onClick={closeBooking}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
