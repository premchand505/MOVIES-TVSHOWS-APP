// src/components/custom/MainLayout.tsx
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/services/api';
import { Button } from '@/components/ui/button';
import { Film, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle'; // Import the new component

const MainLayout = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-sm px-5 ">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Film className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              MyMovies
            </span>
          </div>
          <div className="flex items-center gap-2"> {/* Reduced gap for tighter grouping */}
            <span className="hidden text-sm text-muted-foreground sm:inline mr-2">
              Welcome, {user?.name || 'User'}
            </span>
            <ThemeToggle /> {/* Add the toggle button here */}
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet /> 
      </main> 
    </div>
  );
};

export default MainLayout;