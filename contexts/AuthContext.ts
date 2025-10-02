import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  loading: boolean;
  login: () => void; // Simplified for simulation
  logout: () => void;
  selectRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [role, setRole] = useLocalStorage<Role | null>('role', null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    setLoading(false);
  }, []);

  const login = () => {
    setLoading(true);
    // Simulate Google Sign-In API call
    setTimeout(() => {
      const mockUser: User = { 
        id: '12345', 
        name: 'Alex Doe', 
        email: 'alex.doe@example.com',
        picture: `https://i.pravatar.cc/150?u=alexdoe` // A placeholder image
      };
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    // For simplicity, we don't clear history on logout,
    // so a user can log back in and see their work.
  };

  const selectRole = (selectedRole: Role) => {
    setRole(selectedRole);
  };

  // FIX: The AuthProvider component was not returning a valid React element because it contained JSX within a .ts file, which is invalid.
  // The return statement has been converted to use React.createElement to resolve the compilation errors.
  return React.createElement(AuthContext.Provider, { value: { user, role, loading, login, logout, selectRole } }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
