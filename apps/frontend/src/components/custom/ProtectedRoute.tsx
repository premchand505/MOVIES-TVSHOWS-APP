import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Artificially hold loading for up to 5 seconds only while checking authentication
    if (isLoading) {
      const timer = setTimeout(() => setShowLoading(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [isLoading]);

  if (showLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-linear-to-b from-gray-900 to-black text-white text-center">
        <div className="w-16 h-16 border-4 border-t-transparent border-purple-500 rounded-full animate-spin mb-6"></div>
        <p className="text-lg font-medium tracking-wide">🎬 Authenticating your movie world...</p>
        <p className="text-sm mt-2 opacity-70">Grab your popcorn, this will be quick.</p>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
