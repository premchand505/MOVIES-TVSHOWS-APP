import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/custom/ProtectedRoute';
import MainLayout from './components/custom/MainLayout';

// Import the real page components
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import DashboardPage from './pages/Dashboard'; // Import the dashboard

const NotFoundPage = () => <div className="p-4">404 - Page Not Found</div>;

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}> {/* Wrap protected routes with the layout */}
            <Route path="/" element={<DashboardPage />} />
            {/* More protected routes like /profile can be added here */}
          </Route>
        </Route>
        
        {/* Catch-all for 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;