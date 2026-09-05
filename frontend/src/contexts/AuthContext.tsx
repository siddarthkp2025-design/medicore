import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginResponse } from '@/types';

interface AuthContextType {
  token: string | null;
  user: Omit<LoginResponse, 'token'> | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDoctor: boolean;
  isPatient: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<Omit<LoginResponse, 'token'> | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (data: LoginResponse) => {
    const { token, ...userData } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isDoctor = user?.role === 'DOCTOR';
  const isPatient = user?.role === 'PATIENT';

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, isAdmin, isDoctor, isPatient, login, logout }}>
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
