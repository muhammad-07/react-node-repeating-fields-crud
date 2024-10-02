import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ component: Component, ...rest }) {
  const token = localStorage.getItem('token');

  // If the user has a valid token, render the component, otherwise navigate to login
  return token ? <Component {...rest} /> : <Navigate to="/login" />;
}
