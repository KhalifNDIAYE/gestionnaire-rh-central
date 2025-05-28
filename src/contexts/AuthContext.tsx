
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'rh' | 'gestionnaire' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  { id: '1', name: 'Admin System', email: 'admin@rh.com', role: 'admin' },
  { id: '2', name: 'Marie Dupont', email: 'marie.dupont@rh.com', role: 'rh', department: 'RH' },
  { id: '3', name: 'Jean Martin', email: 'jean.martin@finance.com', role: 'gestionnaire', department: 'Finance' },
  { id: '4', name: 'Sophie Bernard', email: 'sophie.bernard@dev.com', role: 'agent', employeeId: 'EMP001', department: 'IT' },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
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
