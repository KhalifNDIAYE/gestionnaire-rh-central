
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
  expirationDate?: string;
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

// Mock data
const mockMemorandums: Memorandum[] = [
  {
    id: '1',
    title: 'Nouvelle procédure de pointage',
    content: 'À compter du 1er janvier 2024, tous les employés devront utiliser le nouveau système de pointage électronique...',
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
    targetAudience: ['tous'],
    expirationDate: '2024-12-31'
  },
  {
    id: '2',
    title: 'Rappel - Règles de sécurité',
    content: 'Nous rappelons à tous les employés l\'importance de respecter les consignes de sécurité...',
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

export const memorandumService = {
  async getMemorandums(): Promise<Memorandum[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockMemorandums), 300);
    });
  },

  async createMemorandum(memorandum: Omit<Memorandum, 'id' | 'createdAt' | 'status' | 'validationHistory'>): Promise<Memorandum> {
    return new Promise((resolve) => {
      const newMemorandum: Memorandum = {
        ...memorandum,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'level1_pending',
        validationHistory: []
      };
      mockMemorandums.unshift(newMemorandum);
      setTimeout(() => resolve(newMemorandum), 300);
    });
  },

  async validateMemorandum(
    id: string, 
    level: 1 | 2 | 3, 
    action: 'approved' | 'rejected', 
    validatorInfo: { id: string; name: string; role: string },
    comment?: string
  ): Promise<Memorandum> {
    return new Promise((resolve) => {
      const memorandum = mockMemorandums.find(m => m.id === id);
      if (memorandum) {
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

        if (action === 'rejected') {
          memorandum.status = 'rejected';
        } else if (level === 3) {
          memorandum.status = 'approved';
        } else {
          memorandum.status = `level${level + 1}_pending` as any;
        }
      }
      setTimeout(() => resolve(memorandum!), 300);
    });
  },

  async getMemorandumsByStatus(status: Memorandum['status']): Promise<Memorandum[]> {
    return new Promise((resolve) => {
      const filtered = mockMemorandums.filter(m => m.status === status);
      setTimeout(() => resolve(filtered), 300);
    });
  }
};
