import React, { useState } from "react";
import "./authform.css"; // Using same CSS file for popup styles
import { FaDog, FaClinicMedical, FaWalking, FaUtensils, FaHome, FaBath } from "react-icons/fa";

export default function Home() {
  const [popupData, setPopupData] = useState(null);

  const services = [
    { id: 1, title: "Daycare", icon: <FaHome size={40} /> },
    { id: 2, title: "Hostel", icon: <FaDog size={40} /> },
    { id: 3, title: "Grooming", icon: <FaBath size={40} /> },
    { id: 4, title: "Pet Walking", icon: <FaWalking size={40} /> },
    { id: 5, title: "Veterinary Checkup", icon: <FaClinicMedical size={40} /> },
    { id: 6, title: "Food Delivery", icon: <FaUtensils size={40} /> }
  ];

  const openPopup = (service) => {
    setPopupData(service);
  };

  const closePopup = () => {
    setPopupData(null);
  };

  return (
    <div className="home-container" style={styles.container}>
      <h1 style={styles.heading}>Our Services</h1>

      <div style={styles.grid}>
        {services.map((service) => (
          <div key={service.id} style={styles.card} className="slide-in-right">
            <div style={styles.icon}>{service.icon}</div>
            <h3>{service.title}</h3>
            <button style={styles.button} onClick={() => openPopup(service)}>
              Book Now
            </button>
          </div>
        ))}
      </div>

      {popupData && (
        <div className={`popup-slide show`}> 
          <h2>{popupData.title}</h2>
          <p>Click below to proceed with booking.</p>

          <button className="popup-btn">Proceed</button>
          <button className="popup-btn" onClick={closePopup} style={{ background: "#e74c3c" }}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    textAlign: "center",
    animation: "slideInLeft 0.5s ease"
  },
  heading: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "25px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    padding: "10px"
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    transition: "0.3s",
    cursor: "pointer"
  },
  icon: {
    marginBottom: "10px"
  },
  button: {
    marginTop: "10px",
    background: "#4caf50",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};
