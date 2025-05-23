import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'loading:', loading, 'path:', location.pathname);

  if (loading) {
    // You can replace this with a proper loading component
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    // Redirect to login page but save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
};