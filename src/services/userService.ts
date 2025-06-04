import { User } from '../contexts/AuthContext';
import { apiService } from './apiService';
import { API_ENDPOINTS } from '../config/api';
import { organigrammeService, OrganizationalUnit } from './organigrammeService';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  unitId?: string;
  unitName?: string;
}

export interface UserWithUnit extends User {
  unit?: OrganizationalUnit;
}

class UserService {
  // Fallback vers les données locales si l'API n'est pas disponible
  private getFallbackUsers(): User[] {
    return [
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
      },
      {
        id: '5',
        name: 'Jean Dupont',
        email: 'jean.dupont@company.com',
        role: 'agent',
        fonction: 'Technicien',
        unitId: '8',
        unitName: 'UNITÉ 3 - Évaluation environnementale et sociale et gestion des Risques (EESGR)',
        phone: '+33 1 23 45 67 93',
        address: '654 Rue du Commerce, Nice',
        hireDate: '2023-01-10',
        salary: 2500
      }
    ];
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const user = await apiService.get<User>(API_ENDPOINTS.userProfile(userId));
      
      return {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        unitId: user.unitId,
        unitName: user.unitName
      };
    } catch (error) {
      console.error('Error fetching user profile from API, using fallback:', error);
      
      // Fallback vers les données locales
      const users = this.getFallbackUsers();
      const user = users.find(u => u.id === userId);
      
      if (!user) return null;

      return {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        unitId: user.unitId,
        unitName: user.unitName
      };
    }
  }

  async updateUserProfile(userId: string, profile: UserProfile): Promise<void> {
    try {
      await apiService.put(API_ENDPOINTS.userProfile(userId), profile);
    } catch (error) {
      console.error('Error updating user profile via API:', error);
      // En cas d'erreur API, on simule juste un délai
      await new Promise(resolve => setTimeout(resolve, 300));
      throw new Error('Impossible de mettre à jour le profil utilisateur');
    }
  }

  async getUsersWithUnits(): Promise<UserWithUnit[]> {
    try {
      const users = await apiService.get<User[]>(API_ENDPOINTS.users);
      const units = await organigrammeService.getUnits();
      
      return users.map(user => ({
        ...user,
        unit: user.unitId ? units.find(u => u.id === user.unitId) : undefined
      }));
    } catch (error) {
      console.error('Error fetching users from API, using fallback:', error);
      
      // Fallback vers les données locales
      const users = this.getFallbackUsers();
      const units = await organigrammeService.getUnits();
      
      return users.map(user => ({
        ...user,
        unit: user.unitId ? units.find(u => u.id === user.unitId) : undefined
      }));
    }
  }

  async getUsersByUnit(unitId: string): Promise<User[]> {
    try {
      const users = await apiService.get<User[]>(`${API_ENDPOINTS.users}?unitId=${unitId}`);
      return users;
    } catch (error) {
      console.error('Error fetching users by unit from API:', error);
      
      // Fallback
      const users = this.getFallbackUsers();
      return users.filter(user => user.unitId === unitId);
    }
  }

  async assignUserToUnit(userId: string, unitId: string): Promise<void> {
    try {
      await apiService.patch(API_ENDPOINTS.userProfile(userId), { unitId });
    } catch (error) {
      console.error('Error assigning user to unit via API:', error);
      throw new Error('Impossible d\'assigner l\'utilisateur à l\'unité');
    }
  }
}

export const userService = new UserService();
