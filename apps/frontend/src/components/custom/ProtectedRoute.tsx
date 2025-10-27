import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show a loading indicator while checking authentication status
  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // If authenticated, render the child routes. Otherwise, redirect to login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;