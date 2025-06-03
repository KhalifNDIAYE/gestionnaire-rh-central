
import { User } from '../contexts/AuthContext';

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface PasswordChangeRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

class UserService {
  private storageKey = 'rh_system_users';

  private getUsers(): User[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }

    // Mock users for demo if storage is empty
    const mockUsers: User[] = [
      { id: '1', name: 'Admin System', email: 'admin@rh.com', role: 'admin', fonction: 'Administrateur Système', phone: '+123456789', address: '123 Admin Street' },
      { id: '2', name: 'Marie Dupont', email: 'marie.dupont@rh.com', role: 'rh', fonction: 'Responsable RH', department: 'RH', phone: '+331234567', address: '45 Rue des RH' },
      { id: '3', name: 'Jean Martin', email: 'jean.martin@finance.com', role: 'gestionnaire', fonction: 'Chef de Département', department: 'Finance', phone: '+337654321', address: '78 Avenue Finance' },
      { id: '4', name: 'Sophie Bernard', email: 'sophie.bernard@dev.com', role: 'agent', fonction: 'Développeur Senior', employeeId: 'EMP001', department: 'IT', phone: '+339876543', address: '90 Boulevard Tech' },
    ];
    
    this.saveUsers(mockUsers);
    return mockUsers;
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  async getUserById(id: string): Promise<User | null> {
    await this.simulateDelay();
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  async updateProfile(userId: string, profileData: UserProfile): Promise<User> {
    await this.simulateDelay();
    
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === userId);
    
    if (index === -1) {
      throw new Error('Utilisateur non trouvé');
    }

    users[index] = {
      ...users[index],
      ...profileData,
    };

    this.saveUsers(users);
    return users[index];
  }

  async changePassword(request: PasswordChangeRequest): Promise<boolean> {
    await this.simulateDelay();
    
    // Dans un vrai système, on vérifierait le mot de passe actuel
    // et on hacherait le nouveau mot de passe
    if (request.currentPassword !== 'password') {
      throw new Error('Mot de passe actuel incorrect');
    }

    // Simule un changement de mot de passe réussi
    return true;
  }

  private simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const userService = new UserService();
