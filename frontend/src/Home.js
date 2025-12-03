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
  const [showMenu, setShowMenu] = useState(false); // 👈 Dropdown state
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

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear login
    window.location.reload(); // Refresh UI
  };

  return (
    <div
      className="home-root fade-in"
      style={{
        backgroundImage: 'url("/pet-directory.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* NAVBAR */}
     {/* NAVBAR */}
<nav className="pc-nav">
  <div className="pc-logo">🐾 PetCare+</div>

  <ul className="pc-links">
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/services">Services</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>

  {/* AUTH / AVATAR */}
  <div className="pc-auth" style={{ position: "relative" }}>
    {!isLoggedIn() ? (
      <>
        <button className="btn-outline" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="btn-primary" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </>
    ) : (
      <>
        {(() => {
          const user = JSON.parse(localStorage.getItem("user"));
          const avatar = user?.avatar;
          const name = user?.name || "User";

          return (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Avatar or Initial */}
              {avatar ? (
                <img
                  src={avatar}
                  alt="avatar"
                  onClick={() => setShowMenu(!showMenu)}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <div
                  onClick={() => setShowMenu(!showMenu)}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#ffb84c",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Dropdown */}
              {showMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "55px",
                    right: 0,
                    width: "180px",
                    background: "white",
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                    zIndex: 20,
                    padding: "10px 0",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 15px",
                      borderBottom: "1px solid #eee",
                      fontSize: "14px",
                      color: "#555",
                    }}
                  >
                    Signed in as <br />
                    <strong>{name}</strong>
                  </div>

                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      window.location.reload();
                    }}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "none",
                      background: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: "15px",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.background = "#f5f5f5")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.background = "transparent")
                    }
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </>
    )}
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
          <div className="hero-ctas"></div>
        </div>

        <div className="hero-right slide-in-right"></div>
      </header>

      {/* MODAL */}
      {modalService && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal slide-up" onClick={(e) => e.stopPropagation()}>
            <h3>{modalService.title}</h3>
            <p>{modalService.details}</p>
            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => handleBookNow(modalService)}
              >
                Book Now
              </button>
              <button className="btn-outline" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
