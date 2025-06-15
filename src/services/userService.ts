
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
  photoUrl?: string;
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
        salary: 5000,
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
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
        salary: 4000,
        photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
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
        salary: 3500,
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
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
        salary: 2800,
        photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
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
        salary: 2500,
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '6',
        name: 'Laurent Moreau',
        email: 'laurent.moreau@company.com',
        role: 'gestionnaire',
        fonction: 'Directeur Technique',
        unitId: '3',
        unitName: 'Directeur Technique (DT)',
        phone: '+33 1 23 45 67 94',
        address: '987 Avenue Montaigne, Bordeaux',
        hireDate: '2019-06-01',
        salary: 4500,
        photoUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '7',
        name: 'Camille Bernard',
        email: 'camille.bernard@company.com',
        role: 'gestionnaire',
        fonction: 'Conseiller Stratégique',
        unitId: '4',
        unitName: 'Conseillers',
        phone: '+33 1 23 45 67 95',
        address: '456 Rue Saint-Honoré, Lille',
        hireDate: '2021-11-15',
        salary: 3800,
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '8',
        name: 'Thomas Petit',
        email: 'thomas.petit@company.com',
        role: 'agent',
        fonction: 'Responsable Communication',
        unitId: '9',
        unitName: 'CELLULE - Communication et gestion des Ressources Documentaires',
        phone: '+33 1 23 45 67 96',
        address: '159 Boulevard Haussmann, Nantes',
        hireDate: '2022-08-20',
        salary: 3200,
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '9',
        name: 'Julie Rousseau',
        email: 'julie.rousseau@company.com',
        role: 'agent',
        fonction: 'Administrateur Système',
        unitId: '10',
        unitName: 'CELLULE - Informatique, gestion de données et services techniques',
        phone: '+33 1 23 45 67 97',
        address: '753 Rue de la République, Strasbourg',
        hireDate: '2023-02-10',
        salary: 3000,
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '10',
        name: 'Nicolas Garcia',
        email: 'nicolas.garcia@company.com',
        role: 'agent',
        fonction: 'Chargé de Financement',
        unitId: '11',
        unitName: 'CELLULE - Mobilisation des ressources financières',
        phone: '+33 1 23 45 67 98',
        address: '852 Avenue de la Liberté, Montpellier',
        hireDate: '2022-12-05',
        salary: 2900,
        photoUrl: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face'
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
