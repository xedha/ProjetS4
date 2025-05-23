import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import authService from './login/authService'; // Adjust the import path as necessary

interface User {
  email: string;
  id?: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    console.log('AuthProvider mounted, checking auth status...');
    checkAuth();
  }, []);

  const checkAuth = () => {
    const hasToken = authService.isAuthenticated();
    console.log('Checking auth, has token:', hasToken);
    setIsAuthenticated(hasToken);
    
    // If you have stored user info, retrieve it here
    if (hasToken) {
      // Try to get user info from localStorage if you stored it
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse stored user:', e);
        }
      }
    }
    
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const response = await authService.login({ email, password });
      console.log('Login response:', response);
      
      // Store user info
      const userInfo = { 
        email, 
        id: response.user?.id 
      };
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      setIsAuthenticated(true);
      setUser(userInfo);
      console.log('Login successful, isAuthenticated set to true');
    } catch (error) {
      console.error('Login failed in AuthContext:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      console.log('Attempting registration for:', email);
      const response = await authService.register({ email, password });
      console.log('Registration response:', response);
      
      // Store user info
      const userInfo = { 
        email, 
        id: response.user?.id 
      };
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      setIsAuthenticated(true);
      setUser(userInfo);
      console.log('Registration successful, isAuthenticated set to true');
    } catch (error) {
      console.error('Registration failed in AuthContext:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      console.log('Logout complete, isAuthenticated set to false');
    }
  };

  console.log('AuthContext render - isAuthenticated:', isAuthenticated, 'loading:', loading);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};