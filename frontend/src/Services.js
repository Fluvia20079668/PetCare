import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Services.css";
import { FaDog, FaCat, FaBath, FaWalking, FaClinicMedical, FaBone } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";


const BANNER_IMAGE = "/dogbanner.jpg";

const ALL_SERVICES = [
  { id: "daycare", title: "Daycare", short: "Safe & playful environment.", details: "Full-day supervision, playtime, feeding and enrichment.", icon: <FaCat size={36} color="#008c95" />, image: BANNER_IMAGE,showCheckout: false },
  { id: "hostel", title: "Pet Hostel", short: "Comfortable overnight stay.", details: "Temperature-controlled rooms, 24/7 supervision, feeding schedules.", icon: <FaDog size={36} color="#008c95" />, image: BANNER_IMAGE,showCheckout: true },
  { id: "grooming", title: "Grooming", short: "Bathing, nail trimming & coat styling.", details: "Professional groomers providing spa treatments.", icon: <FaBath size={36} color="#008c95" />, image: BANNER_IMAGE, showCheckout: false },
  { id: "walking", title: "Pet Walking", short: "Daily walks for exercise.", details: "GPS tracking, solo or group walking.", icon: <FaWalking size={36} color="#008c95" />, image: BANNER_IMAGE, showCheckout: false },
  { id: "vetcheck", title: "Vet Checkup", short: "Routine health check.", details: "Vaccinations, minor treatments, advice.", icon: <FaClinicMedical size={36} color="#008c95" />, image: BANNER_IMAGE, showCheckout: false },
  { id: "food", title: "Food Delivery", short: "Healthy food delivered.", details: "Premium diet plans, fast delivery.", icon: <FaBone size={36} color="#008c95" />, image: BANNER_IMAGE,showCheckout: false }
];

export default function Services() {
  const [bookingService, setBookingService] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [form, setForm] = useState({ name: "", petName: "", petType: "", slot: "", description: "" });
  const [detailsService, setDetailsService] = useState(null);

  // Check-in & Check-out
  const [checkinDate, setCheckinDate] = useState(null);
  const [checkinDay, setCheckinDay] = useState("");
  const [checkoutDate, setCheckoutDate] = useState(null);
  const [checkoutDay, setCheckoutDay] = useState("");

  const { user, logout } = useContext(AuthContext);
  const isLoggedIn = !!user?.id;

  const navigate = useNavigate();
  const location = useLocation();

  // Handle query param "book"
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const svcId = params.get("book");
    if (!svcId) return;
    const svc = ALL_SERVICES.find((x) => x.id === svcId);
    if (svc) openBooking(svc);
  }, [location.search]);

  // Auto-fill user name
  useEffect(() => {
    if (bookingService && user) {
      setForm(prev => ({ ...prev, name: user.name || "" }));
    }
  }, [bookingService, user]);

  // Auto-scroll details
  useEffect(() => {
    if (detailsService) {
      document.getElementById("service-details")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [detailsService]);

  // Open booking modal
  const openBooking = (svc) => {
    if (!isLoggedIn) {
      const returnUrl = `/services?book=${svc.id}`;
      navigate(`/login?return=${encodeURIComponent(returnUrl)}`);
      return;
    }
    setBookingService(svc);
    setForm({ name: user.name || "", petName: "", petType: "", slot: "", description: "" });
    setCheckinDate(null);
    setCheckinDay("");
    setCheckoutDate(null);
    setCheckoutDay("");
  };

  // Close booking modal
  const closeBooking = () => {
    setBookingService(null);
    setCheckinDate(null);
    setCheckinDay("");
    setCheckoutDate(null);
    setCheckoutDay("");
  };

  // Open & close service details
  const openDetails = (svc) => setDetailsService(svc);
  const closeDetails = () => setDetailsService(null);

  // Handle date selection
  const handleCheckinSelect = (date) => {
    setCheckinDate(date);
    setCheckinDay(date ? date.toLocaleDateString("en-US", { weekday: "long" }) : "");
  };

  const handleCheckoutSelect = (date) => {
    setCheckoutDate(date);
    setCheckoutDay(date ? date.toLocaleDateString("en-US", { weekday: "long" }) : "");
  };

  // Confirm booking (async!)
  const confirmBooking = async () => {
    if (!isLoggedIn) {
      alert("You must be logged in to book.");
      return;
    }

    if (!checkinDate) {
      alert("Please select a check-in date!");
      return;
    }

    if (bookingService.showCheckout && !checkoutDate) 
 {
      alert("Please select a check-out date for Pet Hostel!");
      return;
    }

    const payload = {
      userId: user.id,
      serviceType: bookingService.id,
      name: form.name,
      petName: form.petName,
      petType: form.petType,
      slot: bookingService.showCheckout ? null : form.slot, // slot only if not Pet Hostel
      ddate: checkinDate.toISOString().split("T")[0],
      day: checkinDay,
      description: form.description,
      checkoutDate: bookingService.showCheckout && checkoutDate
  ? checkoutDate.toISOString().split("T")[0]
  : null,

checkoutDay: bookingService.showCheckout ? checkoutDay : null

    };
console.log("Payload:", payload);


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
      console.error(err);
      alert("Server error. Try again.");
    }
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
            <span className="logout-btn" onClick={logout}>Logout</span>
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
                <button className="btn-primary" onClick={() => openBooking(detailsService)}>Book Now</button>
                <button className="btn-outline" onClick={closeDetails}>Close</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {bookingService && (
        <div className="booking-overlay" onClick={closeBooking}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Book: {bookingService.title}</h2>

            <input className="booking-input" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="booking-input" placeholder="Pet Name" value={form.petName} onChange={(e) => setForm({ ...form, petName: e.target.value })} />
            <input className="booking-input" placeholder="Pet Type" value={form.petType} onChange={(e) => setForm({ ...form, petType: e.target.value })} />

            <label className="booking-label">Check-In Date</label>
            <DatePicker
              selected={checkinDate}
              onChange={handleCheckinSelect}
              minDate={new Date()}
              placeholderText="Choose check-in date"
              className="booking-input"
              dateFormat="yyyy-MM-dd"
            />
            <input className="booking-input" value={checkinDay} placeholder="Day" disabled />

            {bookingService.showCheckout && (
              <>
                <label className="booking-label">Check-Out Date</label>
                <DatePicker
                  selected={checkoutDate}
                  onChange={handleCheckoutSelect}
                  minDate={checkinDate || new Date()}
                  placeholderText="Choose check-out date"
                  className="booking-input"
                  dateFormat="yyyy-MM-dd"
                />
                <input className="booking-input" value={checkoutDay} placeholder="Day" disabled />
              </>
            )}

            {!bookingService.showCheckout && (
  <select
    className="booking-input"
    value={form.slot}
    onChange={(e) => setForm({ ...form, slot: e.target.value })}
  >
    <option value="">Select Slot</option>
    <option>9 AM - 11 AM</option>
    <option>11 AM - 1 PM</option>
    <option>3 PM - 5 PM</option>
  </select>
)}


            <textarea
              className="booking-input"
              placeholder="Pet Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
            />

            <button className="booking-submit" onClick={confirmBooking}>Confirm</button>
            <button className="booking-close" onClick={closeBooking}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
