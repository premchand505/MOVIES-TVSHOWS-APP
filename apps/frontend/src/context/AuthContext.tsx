import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import apiClient from '@/services/api';

// ... (User and AuthContextType interfaces remain the same) ...
interface User {
  id: number;
  name: string | null;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // This useEffect will now check for a session on initial component mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await apiClient.get<User>('/auth/me');
        setUser(response.data);
      } catch (_error) { // <--- CHANGE IS HERE
        // The underscore tells ESLint we are intentionally not using the error object.
        console.log('No active session found.');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []); // The empty dependency array means this runs only once on mount

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};