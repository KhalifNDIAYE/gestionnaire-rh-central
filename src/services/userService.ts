
import { User } from '../contexts/AuthContext';
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
  private storageKey = 'users_data';

  private getInitialUsers(): User[] {
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

  private getUsersFromStorage(): User[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.getInitialUsers();
    } catch {
      return this.getInitialUsers();
    }
  }

  private saveUsersToStorage(users: User[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    await this.simulateDelay();
    const users = this.getUsersFromStorage();
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

  async updateUserProfile(userId: string, profile: UserProfile): Promise<void> {
    await this.simulateDelay();
    const users = this.getUsersFromStorage();
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) {
      throw new Error('Utilisateur non trouvé');
    }

    users[index] = {
      ...users[index],
      ...profile
    };

    this.saveUsersToStorage(users);
  }

  async getUsersWithUnits(): Promise<UserWithUnit[]> {
    await this.simulateDelay();
    const users = this.getUsersFromStorage();
    const units = await organigrammeService.getUnits();
    
    return users.map(user => ({
      ...user,
      unit: user.unitId ? units.find(u => u.id === user.unitId) : undefined
    }));
  }

  async getUsersByUnit(unitId: string): Promise<User[]> {
    await this.simulateDelay();
    const users = this.getUsersFromStorage();
    return users.filter(user => user.unitId === unitId);
  }

  async assignUserToUnit(userId: string, unitId: string): Promise<void> {
    await this.simulateDelay();
    const users = this.getUsersFromStorage();
    const units = await organigrammeService.getUnits();
    
    const userIndex = users.findIndex(u => u.id === userId);
    const unit = units.find(u => u.id === unitId);
    
    if (userIndex === -1) {
      throw new Error('Utilisateur non trouvé');
    }
    
    if (!unit) {
      throw new Error('Unité organisationnelle non trouvée');
    }

    users[userIndex].unitId = unitId;
    users[userIndex].unitName = unit.name;
    
    this.saveUsersToStorage(users);
  }

  private simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const userService = new UserService();
