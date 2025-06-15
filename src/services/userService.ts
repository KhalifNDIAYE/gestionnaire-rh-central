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
  photoUrl?: string;
  // Nouveaux champs professionnels
  voipNumber?: string;
  professionalEmail?: string;
  professionalAddress?: string;
  fonction?: string;
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
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '2',
        name: 'Marème DIALLO',
        email: 'mareme.diallo@cse.sn',
        role: 'gestionnaire',
        fonction: 'Directrice Technique',
        unitId: '3',
        unitName: 'Directeur Technique (DT)',
        phone: '+221 33 123 45 68',
        address: 'Dakar, Sénégal',
        hireDate: '2020-03-10',
        salary: 7000,
        photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '3',
        name: 'Lamine NDIAYE',
        email: 'lamine.ndiaye@cse.sn',
        role: 'gestionnaire',
        fonction: 'Conseiller',
        unitId: '4',
        unitName: 'Conseillers',
        phone: '+221 33 123 45 69',
        address: 'Dakar, Sénégal',
        hireDate: '2021-01-15',
        salary: 5000,
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '4',
        name: 'Amadou SALL',
        email: 'amadou.sall@cse.sn',
        role: 'gestionnaire',
        fonction: 'Conseiller',
        unitId: '4',
        unitName: 'Conseillers',
        phone: '+221 33 123 45 70',
        address: 'Dakar, Sénégal',
        hireDate: '2021-02-20',
        salary: 5000,
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '5',
        name: 'Moussa DIAW',
        email: 'moussa.diaw@cse.sn',
        role: 'gestionnaire',
        fonction: 'Directeur Administratif et Financier',
        unitId: '5',
        unitName: 'Directeur Administratif et Financier (DAF)',
        phone: '+221 33 123 45 71',
        address: 'Dakar, Sénégal',
        hireDate: '2020-05-10',
        salary: 7000,
        photoUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '6',
        name: 'Abissatou SADJI',
        email: 'abissatou.sadji@cse.sn',
        role: 'rh',
        fonction: 'Responsable Ressources Humaines',
        unitId: '5',
        unitName: 'Directeur Administratif et Financier (DAF)',
        phone: '+221 33 123 45 72',
        address: 'Dakar, Sénégal',
        hireDate: '2021-03-15',
        salary: 4500,
        photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '7',
        name: 'Abdoul Aziz DIOUF',
        email: 'abdoulaziz.diouf@cse.sn',
        role: 'agent',
        fonction: 'Responsable VERF',
        unitId: '6',
        unitName: 'UNITÉ 1 - Veille Environnementale, Recherche et Formation (VERF)',
        phone: '+221 33 123 45 73',
        address: 'Dakar, Sénégal',
        hireDate: '2021-06-01',
        salary: 4000,
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '8',
        name: 'Adja Aissatou SY',
        email: 'adja.sy@cse.sn',
        role: 'agent',
        fonction: 'Responsable Biodiversité',
        unitId: '7',
        unitName: 'UNITÉ 2 - Biodiversité et écosystèmes Terrestres et Marins (BETM)',
        phone: '+221 33 123 45 74',
        address: 'Dakar, Sénégal',
        hireDate: '2021-07-15',
        salary: 4000,
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '9',
        name: 'Mariéme Soda DIALLO',
        email: 'marieme.diallo@cse.sn',
        role: 'agent',
        fonction: 'Responsable Évaluation Environnementale',
        unitId: '8',
        unitName: 'UNITÉ 3 - Évaluation environnementale et sociale et gestion des Risques (EESGR)',
        phone: '+221 33 123 45 75',
        address: 'Dakar, Sénégal',
        hireDate: '2021-08-10',
        salary: 4000,
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '10',
        name: 'Mamadou Lamine NDIAYE',
        email: 'mamadou.ndiaye@cse.sn',
        role: 'agent',
        fonction: 'Responsable Océan-Littoral',
        unitId: '12',
        unitName: 'UNITÉ 4 - Océan-Littoral et Ecosystèmes Aquatiques',
        phone: '+221 33 123 45 76',
        address: 'Dakar, Sénégal',
        hireDate: '2021-09-01',
        salary: 4000,
        photoUrl: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '11',
        name: 'Dieynaba SECK',
        email: 'dieynaba.seck@cse.sn',
        role: 'agent',
        fonction: 'Responsable Sécurité Alimentaire',
        unitId: '13',
        unitName: 'UNITE 5 - Sécurité Alimentaire et Systèmes de Production Durable',
        phone: '+221 33 123 45 77',
        address: 'Dakar, Sénégal',
        hireDate: '2021-10-15',
        salary: 4000,
        photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '12',
        name: 'Aissata Boubou SALL',
        email: 'aissata.sall@cse.sn',
        role: 'agent',
        fonction: 'Responsable Finances Climatiques',
        unitId: '14',
        unitName: 'UNITE 6 - Finances et Réponses Climatiques',
        phone: '+221 33 123 45 78',
        address: 'Dakar, Sénégal',
        hireDate: '2021-11-01',
        salary: 4000,
        photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '13',
        name: 'Thioro Codou NIANG',
        email: 'thioro.niang@cse.sn',
        role: 'agent',
        fonction: 'Responsable Communication',
        unitId: '9',
        unitName: 'CELLULE - Communication et gestion des Ressources Documentaires',
        phone: '+221 33 123 45 79',
        address: 'Dakar, Sénégal',
        hireDate: '2022-01-15',
        salary: 3500,
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '14',
        name: 'Ibrahima Mamadou NDIAYE',
        email: 'ibrahima.ndiaye@cse.sn',
        role: 'agent',
        fonction: 'Responsable Informatique',
        unitId: '10',
        unitName: 'CELLULE - Informatique, gestion de données et services techniques',
        phone: '+221 33 123 45 80',
        address: 'Dakar, Sénégal',
        hireDate: '2022-02-01',
        salary: 3500,
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '15',
        name: 'Mouhamed LY',
        email: 'mouhamed.ly@cse.sn',
        role: 'agent',
        fonction: 'Chargé Mobilisation Ressources',
        unitId: '11',
        unitName: 'CELLULE - Mobilisation des ressources financières',
        phone: '+221 33 123 45 81',
        address: 'Dakar, Sénégal',
        hireDate: '2022-03-10',
        salary: 3500,
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '16',
        name: 'Fatou Binetou TRAORE',
        email: 'fatou.traore@cse.sn',
        role: 'agent',
        fonction: 'Responsable Suivi Evaluation',
        unitId: '15',
        unitName: 'CELLULE - Suivi Evaluation et Qualité',
        phone: '+221 33 123 45 82',
        address: 'Dakar, Sénégal',
        hireDate: '2022-04-01',
        salary: 3500,
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
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
        unitName: user.unitName,
        photoUrl: user.photoUrl,
        voipNumber: user.voipNumber,
        professionalEmail: user.professionalEmail,
        professionalAddress: user.professionalAddress,
        fonction: user.fonction
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
        unitName: user.unitName,
        photoUrl: user.photoUrl,
        voipNumber: user.voipNumber,
        professionalEmail: user.professionalEmail,
        professionalAddress: user.professionalAddress,
        fonction: user.fonction
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
