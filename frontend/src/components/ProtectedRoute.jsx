import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { auth } = useContext(AuthContext);

  
  if (!auth.token) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && auth.user.role !== requiredRole) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
