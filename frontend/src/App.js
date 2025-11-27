import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Services from "./Services";              // ✅ ADD THIS
import Login from "./Login";
import Signup from "./Signup";
import Contact from "./Contact";
import About from "./About";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminProtected from "./AdminProtected";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />   {/* ✅ working now */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* ✅ Admin Protected Route */}
        <Route
          path="/admin"
          element={
            <AdminProtected>
              <AdminDashboard />
            </AdminProtected>
          }
        />

      </Routes>
    </Router>
  );
}
