import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  signup: (name: string, email: string) => Promise<void>;
  logout: () => void;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const savedUser = localStorage.getItem('mindbridge_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockUser: User = {
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=0A66FF&color=fff`
    };
    setUser(mockUser);
    localStorage.setItem('mindbridge_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const signup = async (name: string, email: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockUser: User = {
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=0A66FF&color=fff`
    };
    setUser(mockUser);
    localStorage.setItem('mindbridge_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mindbridge_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signup, 
      logout,
      isGuest: !user 
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