import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const login = useCallback(async (email: string, password: string) => {
    try {
      // TODO: Implement actual API call
      const user: User = { id: '1', email, name: 'John Doe', role: 'customer' };
      const authData = { user, isAuthenticated: true };
      localStorage.setItem('auth', JSON.stringify(authData));
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, isAuthenticated: false, isLoading: false });
    localStorage.removeItem('auth'); // Clear auth data from localStorage
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      // TODO: Implement actual API call
      const user: User = { id: '1', email, name, role: 'customer' };
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        setState({
          user: parsedAuth.user,
          isAuthenticated: parsedAuth.isAuthenticated,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
