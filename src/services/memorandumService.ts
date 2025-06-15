
import { apiService } from './apiService';
import { API_ENDPOINTS } from '../config/api';

export interface Memorandum {
  id: string;
  title: string;
  content: string;
  category: 'information' | 'directive' | 'rappel' | 'urgent';
  priority: 'low' | 'medium' | 'high';
  authorId: string;
  authorName: string;
  createdAt: string;
  status: 'draft' | 'level1_pending' | 'level2_pending' | 'level3_pending' | 'approved' | 'rejected';
  validationHistory: ValidationStep[];
  targetAudience: string[];
}

export interface ValidationStep {
  level: 1 | 2 | 3;
  validatorId: string;
  validatorName: string;
  validatorRole: string;
  action: 'approved' | 'rejected';
  comment?: string;
  timestamp: string;
}

// Mock data pour fallback
let mockMemorandums: Memorandum[] = [
  {
    id: '1',
    title: 'N°001/2024/CSE/DT/XX - Nouvelle procédure de pointage',
    content: `N°001/2024/CSE/DT/XX

Dakar, le 15/01/2024

Objet : Nouvelle procédure de pointage

Monsieur le Directeur Général,

À compter du 1er janvier 2024, tous les employés devront utiliser le nouveau système de pointage électronique...

En espérant qu'une suite favorable sera réservée à ma demande, je vous prie d'agréer Monsieur le Directeur Général l'assurance de mes sincères salutations.

Marie Dubois
Directrice Technique

Visa DAF		Visa DT			Approbation DG
☐ oui		☐ oui			☐ oui
☐ non		☐ non			☐ non
Motif :		Motif :			Motif :`,
    category: 'directive',
    priority: 'high',
    authorId: 'user1',
    authorName: 'Marie Dubois',
    createdAt: '2024-01-15T10:00:00Z',
    status: 'approved',
    validationHistory: [
      {
        level: 1,
        validatorId: 'supervisor1',
        validatorName: 'Jean Martin',
        validatorRole: 'Superviseur',
        action: 'approved',
        comment: 'Procédure claire et nécessaire',
        timestamp: '2024-01-15T14:00:00Z'
      },
      {
        level: 2,
        validatorId: 'manager1',
        validatorName: 'Sophie Laurent',
        validatorRole: 'Manager RH',
        action: 'approved',
        timestamp: '2024-01-16T09:00:00Z'
      },
      {
        level: 3,
        validatorId: 'director1',
        validatorName: 'Pierre Durand',
        validatorRole: 'Directeur',
        action: 'approved',
        timestamp: '2024-01-16T15:00:00Z'
      }
    ],
    targetAudience: ['tous']
  },
  {
    id: '2',
    title: 'N°002/2024/CSE/U1/PM - Rappel - Règles de sécurité',
    content: `N°002/2024/CSE/U1/PM

Dakar, le 10/01/2024

Objet : Rappel - Règles de sécurité

Monsieur le Directeur Général,

Nous rappelons à tous les employés l'importance de respecter les consignes de sécurité...

En espérant qu'une suite favorable sera réservée à ma demande, je vous prie d'agréer Monsieur le Directeur Général l'assurance de mes sincères salutations.

Paul Martin
Chef d'Unité 1

Visa DAF		Visa DT			Approbation DG
☐ oui		☐ oui			☐ oui
☐ non		☐ non			☐ non
Motif :		Motif :			Motif :`,
    category: 'rappel',
    priority: 'medium',
    authorId: 'user2',
    authorName: 'Paul Martin',
    createdAt: '2024-01-10T08:30:00Z',
    status: 'level2_pending',
    validationHistory: [
      {
        level: 1,
        validatorId: 'supervisor1',
        validatorName: 'Jean Martin',
        validatorRole: 'Superviseur',
        action: 'approved',
        comment: 'Rappel important',
        timestamp: '2024-01-10T16:00:00Z'
      }
    ],
    targetAudience: ['tous']
  }
];

// Service de stockage local pour simuler la persistance
const STORAGE_KEY = 'cse_memorandums';

const loadFromStorage = (): Memorandum[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading memorandums from storage:', error);
  }
  return [...mockMemorandums];
};

const saveToStorage = (memorandums: Memorandum[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memorandums));
    mockMemorandums = [...memorandums];
  } catch (error) {
    console.error('Error saving memorandums to storage:', error);
  }
};

const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const memorandumService = {
  async getMemorandums(): Promise<Memorandum[]> {
    try {
      const memorandums = await apiService.get<Memorandum[]>(API_ENDPOINTS.memorandums);
      return memorandums;
    } catch (error) {
      console.error('Error fetching memorandums from API, using local storage:', error);
      return loadFromStorage();
    }
  },

  async createMemorandum(memorandum: Omit<Memorandum, 'id' | 'createdAt' | 'status' | 'validationHistory'>): Promise<Memorandum> {
    try {
      const newMemorandum = await apiService.post<Memorandum>(API_ENDPOINTS.memorandums, memorandum);
      return newMemorandum;
    } catch (error) {
      console.error('Error creating memorandum via API, using local storage:', error);
      
      // Créer le mémorandum en local
      const newMemorandum: Memorandum = {
        ...memorandum,
        id: generateId(),
        createdAt: new Date().toISOString(),
        status: 'level1_pending',
        validationHistory: []
      };

      const currentMemorandums = loadFromStorage();
      const updatedMemorandums = [newMemorandum, ...currentMemorandums];
      saveToStorage(updatedMemorandums);

      console.log('Memorandum created locally:', newMemorandum);
      return newMemorandum;
    }
  },

  async validateMemorandum(
    id: string, 
    level: 1 | 2 | 3, 
    action: 'approved' | 'rejected', 
    validatorInfo: { id: string; name: string; role: string },
    comment?: string
  ): Promise<Memorandum> {
    try {
      const validationData = {
        level,
        action,
        validatorInfo,
        comment
      };
      const updatedMemorandum = await apiService.patch<Memorandum>(
        `${API_ENDPOINTS.memorandum(id)}/validate`, 
        validationData
      );
      return updatedMemorandum;
    } catch (error) {
      console.error('Error validating memorandum via API, using local storage:', error);
      
      // Valider le mémorandum en local
      const currentMemorandums = loadFromStorage();
      const memorandumIndex = currentMemorandums.findIndex(m => m.id === id);
      
      if (memorandumIndex === -1) {
        throw new Error('Mémorandum non trouvé');
      }

      const memorandum = { ...currentMemorandums[memorandumIndex] };
      
      // Ajouter l'étape de validation
      const validationStep: ValidationStep = {
        level,
        validatorId: validatorInfo.id,
        validatorName: validatorInfo.name,
        validatorRole: validatorInfo.role,
        action,
        comment,
        timestamp: new Date().toISOString()
      };

      memorandum.validationHistory.push(validationStep);

      // Mettre à jour le statut
      if (action === 'rejected') {
        memorandum.status = 'rejected';
      } else if (level === 3) {
        memorandum.status = 'approved';
      } else {
        memorandum.status = `level${level + 1}_pending` as any;
      }

      // Sauvegarder
      currentMemorandums[memorandumIndex] = memorandum;
      saveToStorage(currentMemorandums);

      console.log('Memorandum validated locally:', memorandum);
      return memorandum;
    }
  },

  async getMemorandumsByStatus(status: Memorandum['status']): Promise<Memorandum[]> {
    try {
      const memorandums = await apiService.get<Memorandum[]>(`${API_ENDPOINTS.memorandums}?status=${status}`);
      return memorandums;
    } catch (error) {
      console.error('Error fetching memorandums by status from API, using local storage:', error);
      const allMemorandums = loadFromStorage();
      return allMemorandums.filter(m => m.status === status);
    }
  },

  async updateMemorandum(id: string, updates: Partial<Memorandum>): Promise<Memorandum> {
    try {
      const updatedMemorandum = await apiService.patch<Memorandum>(
        API_ENDPOINTS.memorandum(id), 
        updates
      );
      return updatedMemorandum;
    } catch (error) {
      console.error('Error updating memorandum via API, using local storage:', error);
      
      const currentMemorandums = loadFromStorage();
      const memorandumIndex = currentMemorandums.findIndex(m => m.id === id);
      
      if (memorandumIndex === -1) {
        throw new Error('Mémorandum non trouvé');
      }

      const updatedMemorandum = { ...currentMemorandums[memorandumIndex], ...updates };
      currentMemorandums[memorandumIndex] = updatedMemorandum;
      saveToStorage(currentMemorandums);

      console.log('Memorandum updated locally:', updatedMemorandum);
      return updatedMemorandum;
    }
  },

  async deleteMemorandum(id: string): Promise<void> {
    try {
      await apiService.delete(API_ENDPOINTS.memorandum(id));
    } catch (error) {
      console.error('Error deleting memorandum via API, using local storage:', error);
      
      const currentMemorandums = loadFromStorage();
      const filteredMemorandums = currentMemorandums.filter(m => m.id !== id);
      saveToStorage(filteredMemorandums);

      console.log('Memorandum deleted locally:', id);
    }
  }
};
