
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'rh' | 'gestionnaire' | 'agent';
  fonction: string;
  unitId?: string;
  unitName?: string;
  phone?: string;
  address?: string;
  hireDate: string;
  salary?: number;
  photoUrl?: string;
  // Nouveaux champs professionnels
  voipNumber?: string;
  professionalEmail?: string;
  professionalAddress?: string;
  // MFA properties
  mfaEnabled?: boolean;
  mfaSecret?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, mfaCode?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<User>) => Promise<void>;
  enableMFA: (secret: string) => Promise<void>;
  disableMFA: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string, mfaCode?: string): Promise<boolean> => {
    // Simulation d'une authentification
    if (email === 'admin@cse.sn' && password === 'admin') {
      const adminUser: User = {
        id: '1',
        name: 'Cheikh MBOW',
        email: 'cheikh.mbow@cse.sn',
        role: 'admin',
        fonction: 'Directeur Général',
        unitId: '2',
        unitName: 'Directeur Général (DG)',
        phone: '+221 33 123 45 67',
        address: 'Dakar, Sénégal',
        hireDate: '2020-01-15',
        salary: 8000,
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        voipNumber: '2001',
        professionalEmail: 'cheikh.mbow@cse.sn',
        professionalAddress: 'Dakar, Sénégal',
        mfaEnabled: false
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (profile: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...profile };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const enableMFA = async (secret: string) => {
    if (user) {
      const updatedUser = { ...user, mfaEnabled: true, mfaSecret: secret };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const disableMFA = async () => {
    if (user) {
      const updatedUser = { ...user, mfaEnabled: false, mfaSecret: undefined };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, enableMFA, disableMFA }}>
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
