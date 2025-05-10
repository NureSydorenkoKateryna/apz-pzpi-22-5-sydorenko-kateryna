'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | null;
  setRole?: (role: string) => void;
  getRole?: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = window.localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const setRole = (role: string) => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem('role', role);
  };

  const getRole = () => {
    if (typeof window === 'undefined') return '';

    return window.localStorage?.getItem('role');
  };

  const getToken = () => {
    if (typeof window === 'undefined') return '';

    return window.localStorage?.getItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        getToken,
        setRole,
        getRole,
      }}
    >
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
