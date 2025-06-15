import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { API_ENDPOINTS } from '../config/api';

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
  token?: string;
  mfaSecret?: string;
  mfaEnabled?: boolean;
  backupCodes?: string[];
  mfaLastUsed?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, mfaToken?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  enableMFA: (secret: string) => Promise<void>;
  disableMFA: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users pour fallback
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Système',
    email: 'admin@cse.sn',
    role: 'admin',
    fonction: 'Administrateur Système',
    unitId: '2',
    unitName: 'Directeur Général (DG)',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de la Paix, Paris',
    hireDate: '2020-01-15',
    salary: 5000,
    mfaEnabled: false
  },
  {
    id: '2',
    name: 'Marie Dubois',
    email: 'marie.dubois@cse.sn',
    role: 'rh',
    fonction: 'Responsable RH',
    unitId: '5',
    unitName: 'Directeur Administratif et Financier (DAF)',
    phone: '+33 1 23 45 67 90',
    address: '456 Avenue des Champs, Lyon',
    hireDate: '2021-03-10',
    salary: 4000,
    mfaEnabled: false
  },
  {
    id: '3',
    name: 'Pierre Martin',
    email: 'pierre.martin@cse.sn',
    role: 'gestionnaire',
    fonction: 'Chef de Projet',
    unitId: '6',
    unitName: 'UNITÉ 1 - Veille Environnementale, Recherche et Formation (VERF)',
    phone: '+33 1 23 45 67 91',
    address: '789 Boulevard Saint-Michel, Marseille',
    hireDate: '2019-09-20',
    salary: 3500,
    mfaEnabled: false
  },
  {
    id: '4',
    name: 'Sophie Leroy',
    email: 'sophie.leroy@cse.sn',
    role: 'agent',
    fonction: 'Analyste',
    unitId: '7',
    unitName: 'UNITÉ 2 - Biodiversité et écosystèmes Terrestres et Marins (BETM)',
    phone: '+33 1 23 45 67 92',
    address: '321 Rue de Rivoli, Toulouse',
    hireDate: '2022-05-15',
    salary: 2800,
    mfaEnabled: false
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string, mfaToken?: string): Promise<boolean> => {
    try {
      // Tentative de connexion via l'API
      const response = await apiService.post<{ user: User; token: string }>(
        API_ENDPOINTS.login, 
        { email, password, mfaToken }
      );
      
      const userWithToken = { ...response.user, token: response.token };
      setUser(userWithToken);
      localStorage.setItem('currentUser', JSON.stringify(userWithToken));
      return true;
    } catch (error) {
      console.error('API login failed, using fallback:', error);
      
      // Fallback vers l'authentification mock
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser && password === 'password') {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        return true;
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      if (user?.token) {
        await apiService.post(API_ENDPOINTS.logout);
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('currentUser');
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (user) {
      try {
        const updatedUser = await apiService.put<User>(
          API_ENDPOINTS.userProfile(user.id), 
          updates
        );
        
        const userWithToken = { ...updatedUser, token: user.token };
        setUser(userWithToken);
        localStorage.setItem('currentUser', JSON.stringify(userWithToken));
      } catch (error) {
        console.error('Profile update via API failed:', error);
        
        // Fallback vers mise à jour locale
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }
  };

  const enableMFA = async (secret: string): Promise<void> => {
    if (user) {
      const updates = {
        mfaSecret: secret,
        mfaEnabled: true,
        mfaLastUsed: new Date().toISOString()
      };
      await updateProfile(updates);
    }
  };

  const disableMFA = async (): Promise<void> => {
    if (user) {
      const updates = {
        mfaSecret: undefined,
        mfaEnabled: false,
        backupCodes: undefined,
        mfaLastUsed: undefined
      };
      await updateProfile(updates);
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
