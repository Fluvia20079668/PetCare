import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser, isLoggedIn } from "./utils/auth";
import "./Home.css";

//reads URL query parameter using react Router
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Booking() {
  const query = useQuery();
  const serviceId = query.get("service");
  const navigate = useNavigate();
  const [serviceName, setServiceName] = useState(serviceId || "");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      // not logged in -> redirect to login preserving redirect info
      navigate("/login", { state: { redirect: "/booking", service: serviceId } });
      return;
    }
    setUser(getUser());
  }, [navigate, serviceId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Booking created for ${serviceName} (user: ${user?.name || "Unknown"})`);
    navigate("/");
  };

  if (!isLoggedIn()) {
    return null; // while redirecting
  }

  return (
    <div className="booking-page">
      <div className="auth-container">
        <h2>Book: {serviceName || "Service"}</h2>
        <form onSubmit={handleSubmit}>
          <input className="auth-input" placeholder="Pet name" required />
          <input className="auth-input" placeholder="Owner contact" required />
          <button className="auth-btn" type="submit">Confirm Booking</button>
        </form>
      </div>
    </div>
  );
}
