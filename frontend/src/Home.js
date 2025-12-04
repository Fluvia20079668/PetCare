// Import React and hooks for component behavior
import React, { useState, useRef, useEffect } from "react";

// Used for programmatic navigation (redirects)
import { useNavigate } from "react-router-dom";

// Custom function to get logged-in user from localStorage
import { getUser } from "./utils/auth";

// Importing styles
import "./Home.css";

// Predefined service list for modal display
const SERVICES = [
  {
    id: "daycare",
    title: "Daycare",
    short: "Safe & playful environment.",
    details: "Full-day supervision, playtime, feeding, and walks."
  },
  {
    id: "hostel",
    title: "Hostel",
    short: "Comfortable overnight stays.",
    details: "Temperature-controlled rooms and nightly checks."
  },
  {
    id: "grooming",
    title: "Grooming",
    short: "Professional pet grooming.",
    details: "Bathing, nail trimming and styling."
  },
  {
    id: "walking",
    title: "Pet Walking",
    short: "Daily walks for your pet.",
    details: "GPS-tracked routes and enrichment activities."
  },
  {
    id: "vetcheck",
    title: "Veterinary Checkup",
    short: "Routine health checks.",
    details: "Vaccinations and general health assessment."
  },
  {
    id: "food",
    title: "Food Delivery",
    short: "Healthy pet food delivered.",
    details: "Premium brands, home delivery."
  }
];

export default function Home() {
  // Tracks which service modal is currently open
  const [modalService, setModalService] = useState(null);

  // Tracks whether user dropdown (My Bookings, Logout) is visible
  const [showDropdown, setShowDropdown] = useState(false);

  // react-router navigation hook
  const navigate = useNavigate();

  // Get logged-in user (null if not logged in)
  const user = getUser();

  // Refs help detect clicks outside dropdown UI
  const dropdownRef = useRef(null);
  const circleRef = useRef(null);

  // Close dropdown when user clicks outside
  useEffect(() => {
    function handleClickOutside(e) {
      // Only act if dropdown is open
      if (!showDropdown) return;

      // If click is inside dropdown → ignore
      if (dropdownRef.current && dropdownRef.current.contains(e.target)) return;

      // If click is on the user circle → ignore (toggle handled separately)
      if (circleRef.current && circleRef.current.contains(e.target)) return;

      // Otherwise → close dropdown
      setShowDropdown(false);
    }

    // Attach listener for outside click detection
    document.addEventListener("mousedown", handleClickOutside);

    // Remove listener when component unmounts
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]); // re-run when dropdown visibility changes

  // Opens modal for selected service
  const openService = (svc) => setModalService(svc);

  // Close modal
  const closeModal = () => setModalService(null);

  // "Book Now" button handler
  const handleBookNow = (svc) => {
    // If user not logged in → redirect to login
    if (!user) {
      navigate("/login", { state: { redirect: "/booking", service: svc.id } });
      return;
    }

    // If logged in → go directly to booking page with service ID
    navigate(`/booking?service=${encodeURIComponent(svc.id)}`);
  };

  // Logout: remove user + token, close dropdown, reload home screen
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setShowDropdown(false); // close menu
    navigate("/");          // go home
    window.location.reload(); // force refresh auth state
  };

  return (
    <div
      className="home-root fade-in"
      style={{
        backgroundImage: 'url("/pet-directory.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >

      {/* --------------- NAVBAR SECTION --------------- */}
      <nav className="pc-nav">
        
        {/* Left side logo */}
        <div className="pc-logo">🐾 PetCare+</div>

        {/* Middle navigation links */}
        <ul className="pc-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>

        {/* Right side → login/signup OR user dropdown */}
        <div className="pc-auth">

          {/* If user NOT logged in → show login + signup */}
          {!user ? (
            <>
              <button className="btn-outline" onClick={() => navigate("/login")}>Login</button>
              <button className="btn-primary" onClick={() => navigate("/signup")}>Sign Up</button>
            </>
          ) : (

            /* If logged in → show user dropdown menu */
            <div className="user-dropdown-container">

              {/* Circle with first letter of user name */}
              <div
                ref={circleRef}
                className="user-initial-circle"
                onClick={() => setShowDropdown(prev => !prev)} // toggle dropdown
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              {/* Show username beside circle */}
              <span className="username">{user.name || "User"}</span>

              {/* Actual dropdown menu */}
              {showDropdown && (
                <div ref={dropdownRef} className="dropdown-menu">
                  
                  {/* "My Bookings" → go to bookings page */}
                  <p
                    className="dropdown-item"
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/mybookings");
                    }}
                  >
                    My Bookings
                  </p>

                  {/* Logout */}
                  <p
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    Logout
                  </p>

                </div>
              )}
            </div>
          )}
        </div>
      </nav>


      {/* --------------- HERO SECTION --------------- */}
      <header id="home" className="hero">
        <div className="hero-left slide-in-left">
          <h1>Your Pet’s Health, Our Priority</h1>
          <p>Professional daycare, grooming and premium services.</p>
        </div>

        <div className="hero-right slide-in-right" />
      </header>


      {/* --------------- SERVICES MODAL --------------- */}
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
