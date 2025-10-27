import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/services/api';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const MainLayout = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
      setUser(null); // Clear user from global state
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear user state even if API call fails
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container h-14 flex items-center">
          <div className="mr-4 font-bold text-lg">MyMovies</div>
          <div className="flex-1">
            {/* Future navigation links can go here */}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.name || 'User'}
            </span>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <Outlet /> {/* This will render the nested child route (our dashboard) */}
      </main>
    </div>
  );
};

export default MainLayout;