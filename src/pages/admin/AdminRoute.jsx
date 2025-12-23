// AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminRoute({ children }) {
  const { profile } = useAuth();

  if (!profile || profile.userType !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}
