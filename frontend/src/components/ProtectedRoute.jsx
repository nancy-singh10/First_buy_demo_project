import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Check if the user has an access token in localStorage
  const isAuthenticated = !!localStorage.getItem('access_token');

  if (!isAuthenticated) {
    // If not logged in, redirect them to the sign-in page
    return <Navigate to="/signin" replace />;
  }

  // If logged in, allow them to view the protected component
  return children;
}
