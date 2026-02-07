import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { dummyUsers } from '../data/users';

interface AuthContextType {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        const foundUser = dummyUsers.find((u) => u.id === storedUserId);
        if (foundUser) {
          setUser(foundUser);
        } else {
          localStorage.removeItem('userId');
        }
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }, []);

  const login = (userId: string) => {
    try {
      const foundUser = dummyUsers.find((u) => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('userId', userId);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('userId');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
