import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import AdminDashboard from "./AdminDashboard";
import AdminProtected from "./AdminProtected";





export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/admin" element={<AdminProtected><AdminDashboard /></AdminProtected>} />
      
      </Routes>
    </BrowserRouter>
  );
}
