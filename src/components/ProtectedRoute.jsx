// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, profile } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(profile?.role)) return <Navigate to="/" />;

  return children;
}
