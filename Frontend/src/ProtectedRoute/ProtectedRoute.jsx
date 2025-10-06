import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ authRequired = true, allowedRoles = [] }) => {
  // Get token and payload from localStorage
  const token = localStorage.getItem("token");
  const payloadStr = localStorage.getItem("payload");
  const payload = payloadStr ? JSON.parse(payloadStr) : null;

  // If authRequired is true and no token -> redirect to login
  if (authRequired && !token) {
    return <Navigate to="/login" replace />;
  }

  // If authRequired is false (login/signup page) and user is logged in -> redirect to dashboard
  if (!authRequired && token) {
    return <Navigate to="/" replace />;
  }

  // Role-based restriction
  if (allowedRoles.length > 0 && payload) {
    if (!allowedRoles.includes(payload.role)) {
      // Not allowed -> redirect to home or dashboard
      return <Navigate to="/" replace />;
    }
  }

  // If everything is fine, render child components
  return <Outlet />;
};

export default ProtectedRoute;
