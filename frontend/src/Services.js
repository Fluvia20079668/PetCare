// Services.js (Hybrid: banner + grid + filtering + side-by-side details + booking modal)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";

/* icons */
import {
  FaDog,
  FaCat,
  FaBath,
  FaWalking,
  FaClinicMedical,
  FaBone,
  FaThLarge,
  FaFilter,
} from "react-icons/fa";

const BANNER_IMAGE = "/mnt/data/all_pets_image.png"; // uploaded local file path

const ALL_SERVICES = [
  {
    id: "daycare",
    title: "Daycare",
    short: "Safe & playful day environment for pets.",
    details:
      "Full-day supervision, playtime, feeding, enrichment activities and short walks. Staffed by trained carers to keep your pet safe and happy.",
    category: "daycare",
    icon: <FaCat size={36} color="#008c95" />,
    image: BANNER_IMAGE,
  },
  {
    id: "hostel",
    title: "Hostel",
    short: "Comfortable overnight stays with supervision.",
    details:
      "Overnight accommodation with temperature-control, nightly checks, personalized feeding and supervised rest times. Happy, secure stays for overnight guests.",
    category: "hostel",
    icon: <FaDog size={36} color="#008c95" />,
    image: BANNER_IMAGE,
  },
  {
    id: "grooming",
    title: "Grooming",
    short: "Professional grooming for cats & dogs.",
    details:
      "Bathing, brushing, nail trimming, ear cleaning and coat styling performed by experienced groomers with pet-safe products.",
    category: "grooming",
    icon: <FaBath size={36} color="#008c95" />,
    image: BANNER_IMAGE,
  },
  {
    id: "walking",
    title: "Pet Walking",
    short: "Daily walks tailored to your pet’s needs.",
    details:
      "Short/long walks, solo or group, enrichment and optional GPS-tracked routes for owner peace of mind.",
    category: "walking",
    icon: <FaWalking size={36} color="#008c95" />,
    image: BANNER_IMAGE,
  },
  {
    id: "vetcheck",
    title: "Veterinary Checkup",
    short: "Routine health check and vaccinations.",
    details:
      "Qualified vets for routine checkups, vaccination reviews, minor treatments and professional advice for at-home care.",
    category: "vet",
    icon: <FaClinicMedical size={36} color="#008c95" />,
    image: BANNER_IMAGE,
  },
  {
    id: "food",
    title: "Food Delivery",
    short: "Healthy pet food delivered to your door.",
    details:
      "Premium food brands, subscription or one-off deliveries with custom diet plans and recommended portion sizes.",
    category: "food",
    icon: <FaBone size={36} color="#008c95" />,
    image: BANNER_IMAGE,
  },
];

export default function Services() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [bookingService, setBookingService] = useState(null);
  const [detailsService, setDetailsService] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [form, setForm] = useState({ name: "", petName: "", date: "" });

  const categories = [
    { id: "all", label: "All" },
    { id: "hostel", label: "Hostel" },
    { id: "daycare", label: "Daycare" },
    { id: "grooming", label: "Grooming" },
    { id: "walking", label: "Walking" },
    { id: "vet", label: "Vet" },
    { id: "food", label: "Food" },
  ];

  const visibleServices =
    filter === "all"
      ? ALL_SERVICES
      : ALL_SERVICES.filter((s) => s.category === filter);

  const openBooking = (svc) => {
    setBookingService(svc);
    setForm({ name: "", petName: "", date: "" });
  };
  const closeBooking = () => setBookingService(null);

  const openDetails = (svc) => {
    setDetailsService(svc);
    // scroll to details panel smoothly
    setTimeout(() => {
      document.getElementById("service-details")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };
  const closeDetails = () => setDetailsService(null);

  const confirmBooking = () => {
    // placeholder - hook into backend here
    alert(`Booking confirmed for ${bookingService.title}\nName: ${form.name}\nPet: ${form.petName}\nDate: ${form.date}`);
    closeBooking();
  };

  return (
    <div className="services-page">

      {/* TOP BANNER */}
      <section className="services-banner">
        <div className="banner-inner">
          <div className="banner-text">
            <h1>Services for Every Pet</h1>
            <p>Daycare, hostels, grooming, vet checkups and food delivery — everything under one roof.</p>
            <div className="banner-ctas">
              <button className="btn-primary" onClick={() => document.getElementById("services-grid")?.scrollIntoView({behavior: "smooth"})}>
                Explore Services
              </button>
              <button className="btn-outline" onClick={() => navigate("/contact")}>
                Contact Us
              </button>
            </div>
          </div>

          <div className="banner-image">
            <img src={BANNER_IMAGE} alt="pets banner" />
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <div className="filter-bar">
        <div className="filter-left">
          <FaFilter style={{ marginRight: 8 }} />
          <strong>Filter</strong>
        </div>

        <div className="filter-buttons">
          {categories.map((c) => (
            <button
              key={c.id}
              className={`filter-btn ${filter === c.id ? "active" : ""}`}
              onClick={() => setFilter(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="filter-right">
          <FaThLarge style={{ marginRight: 8 }} />
          <span>{visibleServices.length} services</span>
        </div>
      </div>

      {/* GRID */}
      <section id="services-grid" className="services-grid">
        {visibleServices.map((svc) => (
          <article key={svc.id} className={`service-card fade-up`}>
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
                  // also show details panel
                  openDetails(svc);
                }}
              >
                {expandedId === svc.id ? "Hide details ▲" : "Learn more ▼"}
              </button>

              <button className="book-btn" onClick={() => openBooking(svc)}>
                Book Now
              </button>
            </div>

            {/* inline expand (short) */}
            {expandedId === svc.id && (
              <div className="service-more small">
                <p>{svc.details}</p>
              </div>
            )}
          </article>
        ))}
      </section>

      {/* SIDE-BY-SIDE DETAILS PANEL (appears when user clicks learn more) */}
      {detailsService && (
        <section id="service-details" className="details-panel">
          <div className="details-inner">
            <div className="details-image">
              <img src={detailsService.image} alt={detailsService.title} />
            </div>

            <div className="details-content">
              <h2>{detailsService.title}</h2>
              <p className="muted">{detailsService.details}</p>

              <div className="details-actions">
                <button className="btn-primary" onClick={() => openBooking(detailsService)}>
                  Book {detailsService.title}
                </button>
                <button className="btn-outline" onClick={closeDetails}>
                  Close
                </button>
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

            <input
              className="booking-input"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />

            <input
              className="booking-input"
              placeholder="Your pet's name"
              value={form.petName}
              onChange={(e) => setForm((p) => ({ ...p, petName: e.target.value }))}
            />

            <input
              type="date"
              className="booking-input"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            />

            <button className="booking-submit" onClick={confirmBooking}>
              Confirm Booking
            </button>
            <button className="booking-close" onClick={closeBooking}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
