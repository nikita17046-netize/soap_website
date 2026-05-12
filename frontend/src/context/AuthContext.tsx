'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id?: string;
  email: string;
  name: string;
  isAdmin: boolean;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const API_URL = 'http://127.0.0.1:8000/api';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if it's the first time in this session
    const savedUser = sessionStorage.getItem('aura-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      
      setUser(data);
      sessionStorage.setItem('aura-user', JSON.stringify(data));
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      
      setUser(data);
      sessionStorage.setItem('aura-user', JSON.stringify(data));
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('aura-user');
  };

  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoggedIn: !!user, 
      isAdmin, 
      isLoading 
    }}>
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
