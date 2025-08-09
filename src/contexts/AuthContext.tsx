import React, { createContext, useContext } from 'react';
import { useSupabaseAuth } from './SupabaseAuthContext';

// Interface de compatibilité avec l'ancien système
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
  voipNumber?: string;
  professionalEmail?: string;
  professionalAddress?: string;
  mfaEnabled?: boolean;
  mfaSecret?: string;
}

interface AuthContextType {
  user: User | null;
  profile: User | null; // Alias pour compatibilité
  loading: boolean;
  login: (email: string, password: string, mfaCode?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<User>) => Promise<void>;
  enableMFA: (secret: string) => Promise<void>;
  disableMFA: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: supabaseUser, profile, signIn, signOut, updateProfile: updateSupabaseProfile, loading } = useSupabaseAuth();

  // Mapper les données Supabase vers l'ancien format
  const user: User | null = supabaseUser && profile ? {
    id: supabaseUser.id,
    name: supabaseUser.email?.split('@')[0] || 'User',
    email: supabaseUser.email || '',
    role: profile.role as any,
    fonction: profile.role === 'admin' ? 'Administrateur' : 'Employé',
    unitId: '1',
    unitName: 'Default Unit',
    phone: '',
    address: '',
    hireDate: new Date().toISOString(),
    salary: 0,
    photoUrl: '',
    voipNumber: '',
    professionalEmail: supabaseUser.email || '',
    professionalAddress: '',
    mfaEnabled: false,
    mfaSecret: ''
  } : null;

  const login = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    return !error;
  };

  const logout = async () => {
    await signOut();
  };

  const wrappedUpdateProfile = async (updates: Partial<User>) => {
    // Mapper vers le format Supabase si nécessaire
    if (updates.role) {
      const supabaseUpdates = {
        role: updates.role as any
      };
      await updateSupabaseProfile(supabaseUpdates);
    }
  };

  const enableMFA = async () => {
    // Placeholder pour compatibilité
  };

  const disableMFA = async () => {
    // Placeholder pour compatibilité
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile: user, // Alias pour compatibilité
      loading,
      login, 
      logout, 
      updateProfile: wrappedUpdateProfile, 
      enableMFA, 
      disableMFA 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};