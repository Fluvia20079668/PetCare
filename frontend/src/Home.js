// src/Home.js
import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Home.css";

export default function Home() {
  const { user, logout } = useContext(AuthContext); // ✅ useContext inside component
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const circleRef = useRef(null);

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!showDropdown) return;
      if (dropdownRef.current?.contains(e.target)) return;
      if (circleRef.current?.contains(e.target)) return;
      setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

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
      {/* NAVBAR */}
      <nav className="pc-nav">
        <div className="pc-logo">🐾 PetCare+</div>

        <ul className="pc-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>

        <div className="pc-auth">
          {!user ? (
            <>
              <button className="btn-outline" onClick={() => navigate("/login")}>Login</button>
              <button className="btn-primary" onClick={() => navigate("/signup")}>Sign Up</button>
            </>
          ) : (
            <div className="user-dropdown-container">
              <div
                ref={circleRef}
                className="user-initial-circle"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="username">{user.name}</span>

              {showDropdown && (
                <div ref={dropdownRef} className="dropdown-menu">
                  <p className="dropdown-item" onClick={() => { setShowDropdown(false); navigate("/mybookings"); }}>
                    My Bookings
                  </p>
                  <p className="dropdown-item" onClick={() => { logout(); setShowDropdown(false); }}>
                    Logout
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <header id="home" className="hero">
        <div className="hero-left slide-in-left">
          <h1>Your Pet’s Health, Our Priority</h1>
          <p>Professional daycare, grooming and premium services.</p>
        </div>
        <div className="hero-right slide-in-right" />
      </header>
    </div>
  );
}
