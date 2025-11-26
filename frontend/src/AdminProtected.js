import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminProtected({ children }) {
  const stored = localStorage.getItem("user");
  if (!stored) return <Navigate to="/login" />;
  try {
    const user = JSON.parse(stored);
    if (user.role !== "admin") return <Navigate to="/" />;
  } catch (e) {
    return <Navigate to="/login" />;
  }
  return children;
}
