
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole } from '../types';

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

// Create the authentication context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component that will wrap the application
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check for saved user in localStorage to persist session
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login function determines user role based on email and sets user state
  const login = (email: string) => {
    let role: UserRole;

    if (email === 'admin@company.com') {
      role = UserRole.Admin;
    } else if (email.endsWith('@company.com')) {
      role = UserRole.Employee;
    } else {
      role = UserRole.Customer;
    }
    
    const newUser: User = { email, role };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  // Logout function clears user state
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
