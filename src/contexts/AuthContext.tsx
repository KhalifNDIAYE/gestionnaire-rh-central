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
    
    // Compte Admin avec mot de passe "password"
    if (email === 'admin@company.com' && password === 'password') {
      const adminUser: User = {
        id: '1',
        name: 'Cheikh MBOW',
        email: email,
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
        professionalEmail: email,
        professionalAddress: 'Dakar, Sénégal',
        mfaEnabled: false
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }
    
    // Autres comptes de démonstration avec mot de passe "password"
    if (password === 'password') {
      let demoUser: User | null = null;
      
      switch (email) {
        case 'marie.dubois@company.com':
          demoUser = {
            id: '2',
            name: 'Marie Dubois',
            email: email,
            role: 'rh',
            fonction: 'Responsable RH',
            unitId: '3',
            unitName: 'Ressources Humaines',
            phone: '+221 33 234 56 78',
            address: 'Dakar, Sénégal',
            hireDate: '2021-03-10',
            salary: 6000,
            photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            voipNumber: '2002',
            professionalEmail: email,
            professionalAddress: 'Dakar, Sénégal',
            mfaEnabled: false
          };
          break;
        case 'pierre.martin@company.com':
          demoUser = {
            id: '3',
            name: 'Pierre Martin',
            email: email,
            role: 'gestionnaire',
            fonction: 'Gestionnaire de Projets',
            unitId: '4',
            unitName: 'Gestion de Projets',
            phone: '+221 33 345 67 89',
            address: 'Dakar, Sénégal',
            hireDate: '2022-01-15',
            salary: 5500,
            photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            voipNumber: '2003',
            professionalEmail: email,
            professionalAddress: 'Dakar, Sénégal',
            mfaEnabled: false
          };
          break;
        case 'sophie.leroy@company.com':
          demoUser = {
            id: '4',
            name: 'Sophie Leroy',
            email: email,
            role: 'agent',
            fonction: 'Agent Administratif',
            unitId: '5',
            unitName: 'Administration',
            phone: '+221 33 456 78 90',
            address: 'Dakar, Sénégal',
            hireDate: '2023-05-20',
            salary: 4500,
            photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            voipNumber: '2004',
            professionalEmail: email,
            professionalAddress: 'Dakar, Sénégal',
            mfaEnabled: false
          };
          break;
      }
      
      if (demoUser) {
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        return true;
      }
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
