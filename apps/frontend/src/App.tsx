// src/App.tsx
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
    // 💡 THE FIX: Wrap the application in a div that explicitly uses the theme's background and text colors.
    // This ensures the theme cascades correctly regardless of external browser/system styles.
    <div className="min-h-screen bg-background text-foreground">
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            [cite_start]<Route element={<MainLayout />}> {/* Wrap protected routes with the layout [cite: 31] */}
              [cite_start]<Route path="/" element={<DashboardPage />} /> {/* [cite: 32] */}
              {/* More protected routes like /profile can be added here */}
            </Route>
          </Route>
          
          [cite_start]{/* Catch-all for 404 Not Found [cite: 32] */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;