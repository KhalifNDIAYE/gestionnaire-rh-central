import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'rh' | 'gestionnaire' | 'agent';
  fonction: string;
  unitId?: string; // ID de l'unité organisationnelle
  unitName?: string; // Nom de l'unité organisationnelle
  phone?: string;
  address?: string;
  hireDate?: string;
  salary?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Système',
    email: 'admin@company.com',
    role: 'admin',
    fonction: 'Administrateur Système',
    unitId: '2',
    unitName: 'Directeur Général (DG)',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de la Paix, Paris',
    hireDate: '2020-01-15',
    salary: 5000
  },
  {
    id: '2',
    name: 'Marie Dubois',
    email: 'marie.dubois@company.com',
    role: 'rh',
    fonction: 'Responsable RH',
    unitId: '5',
    unitName: 'Directeur Administratif et Financier (DAF)',
    phone: '+33 1 23 45 67 90',
    address: '456 Avenue des Champs, Lyon',
    hireDate: '2021-03-10',
    salary: 4000
  },
  {
    id: '3',
    name: 'Pierre Martin',
    email: 'pierre.martin@company.com',
    role: 'gestionnaire',
    fonction: 'Chef de Projet',
    unitId: '6',
    unitName: 'UNITÉ 1 - Veille Environnementale, Recherche et Formation (VERF)',
    phone: '+33 1 23 45 67 91',
    address: '789 Boulevard Saint-Michel, Marseille',
    hireDate: '2019-09-20',
    salary: 3500
  },
  {
    id: '4',
    name: 'Sophie Leroy',
    email: 'sophie.leroy@company.com',
    role: 'agent',
    fonction: 'Analyste',
    unitId: '7',
    unitName: 'UNITÉ 2 - Biodiversité et écosystèmes Terrestres et Marins (BETM)',
    phone: '+33 1 23 45 67 92',
    address: '321 Rue de Rivoli, Toulouse',
    hireDate: '2022-05-15',
    salary: 2800
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

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Simuler une mise à jour côté serveur
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
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
