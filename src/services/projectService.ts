
export interface Task {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  duration: number; // en jours
  progress: number; // pourcentage
  dependencies: string[]; // IDs des tâches dépendantes
  assignedTo: string[]; // IDs des employés/consultants assignés
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
}

export interface Deliverable {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  completedDate?: string;
  assignedTo?: string[]; // IDs des responsables
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  budget: number;
  actualCost: number;
  projectManager: string; // ID de l'employé
  team: string[]; // IDs des membres de l'équipe
  consultants: string[]; // IDs des consultants
  tasks: Task[];
  milestones: Milestone[];
  deliverables: Deliverable[];
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  description: string;
  isCompleted: boolean;
}

export interface ProjectNotification {
  id: string;
  projectId: string;
  deliverableId: string;
  type: 'deadline-warning' | 'overdue' | 'completed';
  message: string;
  createdDate: string;
  read: boolean;
}

// Mock data pour les projets
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Migration ERP',
    description: 'Migration du système ERP existant vers une nouvelle plateforme',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    status: 'active',
    budget: 150000,
    actualCost: 85000,
    projectManager: '3',
    team: ['2', '4'],
    consultants: ['consultant-1'],
    tasks: [
      {
        id: 'task-1',
        name: 'Analyse des besoins',
        description: 'Analyser les besoins métier',
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        duration: 31,
        progress: 100,
        dependencies: [],
        assignedTo: ['consultant-1'],
        priority: 'high',
        status: 'completed'
      },
      {
        id: 'task-2',
        name: 'Configuration système',
        description: 'Configurer le nouveau système ERP',
        startDate: '2024-02-16',
        endDate: '2024-04-30',
        duration: 74,
        progress: 65,
        dependencies: ['task-1'],
        assignedTo: ['2', '4'],
        priority: 'high',
        status: 'in-progress'
      }
    ],
    milestones: [
      {
        id: 'milestone-1',
        name: 'Fin de l\'analyse',
        date: '2024-02-15',
        description: 'Validation de l\'analyse des besoins',
        isCompleted: true
      }
    ],
    deliverables: [
      {
        id: 'deliverable-1',
        name: 'Rapport d\'analyse',
        description: 'Document complet d\'analyse des besoins',
        dueDate: '2024-02-15',
        status: 'completed',
        priority: 'high',
        completedDate: '2024-02-14',
        assignedTo: ['consultant-1']
      },
      {
        id: 'deliverable-2',
        name: 'Configuration de test',
        description: 'Environnement de test configuré',
        dueDate: '2024-04-30',
        status: 'in-progress',
        priority: 'high',
        assignedTo: ['2', '4']
      }
    ]
  },
  {
    id: '2',
    name: 'Refonte site web',
    description: 'Modernisation du site web corporate',
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    status: 'planning',
    budget: 50000,
    actualCost: 0,
    projectManager: '4',
    team: ['4'],
    consultants: ['consultant-2'],
    tasks: [],
    milestones: [],
    deliverables: [
      {
        id: 'deliverable-3',
        name: 'Maquettes UI/UX',
        description: 'Conception des interfaces utilisateur',
        dueDate: '2024-03-15',
        status: 'pending',
        priority: 'medium',
        assignedTo: ['consultant-2']
      }
    ]
  }
];

const mockNotifications: ProjectNotification[] = [];

export const projectService = {
  getProjects: (): Promise<Project[]> => {
    return Promise.resolve(mockProjects);
  },

  getProject: (id: string): Promise<Project | null> => {
    const project = mockProjects.find(p => p.id === id);
    return Promise.resolve(project || null);
  },

  createProject: (project: Omit<Project, 'id'>): Promise<Project> => {
    const newProject = {
      ...project,
      id: `project-${Date.now()}`
    };
    mockProjects.push(newProject);
    return Promise.resolve(newProject);
  },

  updateProject: (id: string, updates: Partial<Project>): Promise<Project | null> => {
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) return Promise.resolve(null);
    
    mockProjects[index] = { ...mockProjects[index], ...updates };
    return Promise.resolve(mockProjects[index]);
  },

  deleteProject: (id: string): Promise<boolean> => {
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) return Promise.resolve(false);
    
    mockProjects.splice(index, 1);
    return Promise.resolve(true);
  },

  addTask: (projectId: string, task: Omit<Task, 'id'>): Promise<Task | null> => {
    const project = mockProjects.find(p => p.id === projectId);
    if (!project) return Promise.resolve(null);

    const newTask = {
      ...task,
      id: `task-${Date.now()}`
    };
    
    project.tasks.push(newTask);
    return Promise.resolve(newTask);
  },

  updateTaskProgress: (projectId: string, taskId: string, progress: number): Promise<boolean> => {
    const project = mockProjects.find(p => p.id === projectId);
    if (!project) return Promise.resolve(false);

    const task = project.tasks.find(t => t.id === taskId);
    if (!task) return Promise.resolve(false);

    task.progress = progress;
    if (progress === 100) task.status = 'completed';
    else if (progress > 0) task.status = 'in-progress';

    return Promise.resolve(true);
  },

  // Nouvelles méthodes pour les livrables
  addDeliverable: (projectId: string, deliverable: Omit<Deliverable, 'id'>): Promise<Deliverable | null> => {
    const project = mockProjects.find(p => p.id === projectId);
    if (!project) return Promise.resolve(null);

    const newDeliverable = {
      ...deliverable,
      id: `deliverable-${Date.now()}`
    };
    
    project.deliverables.push(newDeliverable);
    return Promise.resolve(newDeliverable);
  },

  updateDeliverable: (projectId: string, deliverableId: string, updates: Partial<Deliverable>): Promise<boolean> => {
    const project = mockProjects.find(p => p.id === projectId);
    if (!project) return Promise.resolve(false);

    const deliverableIndex = project.deliverables.findIndex(d => d.id === deliverableId);
    if (deliverableIndex === -1) return Promise.resolve(false);

    project.deliverables[deliverableIndex] = { 
      ...project.deliverables[deliverableIndex], 
      ...updates 
    };

    // Si le livrable est marqué comme terminé, ajouter la date de completion
    if (updates.status === 'completed' && !project.deliverables[deliverableIndex].completedDate) {
      project.deliverables[deliverableIndex].completedDate = new Date().toISOString().split('T')[0];
    }

    return Promise.resolve(true);
  },

  getOverdueDeliverables: (): Promise<{ project: Project; deliverable: Deliverable }[]> => {
    const today = new Date().toISOString().split('T')[0];
    const overdueDeliverables: { project: Project; deliverable: Deliverable }[] = [];

    mockProjects.forEach(project => {
      project.deliverables.forEach(deliverable => {
        if (deliverable.dueDate < today && deliverable.status !== 'completed') {
          // Marquer automatiquement comme en retard
          deliverable.status = 'overdue';
          overdueDeliverables.push({ project, deliverable });
        }
      });
    });

    return Promise.resolve(overdueDeliverables);
  },

  getUpcomingDeadlines: (days: number = 7): Promise<{ project: Project; deliverable: Deliverable }[]> => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    const todayStr = today.toISOString().split('T')[0];
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    const upcomingDeliverables: { project: Project; deliverable: Deliverable }[] = [];

    mockProjects.forEach(project => {
      project.deliverables.forEach(deliverable => {
        if (deliverable.dueDate >= todayStr && 
            deliverable.dueDate <= futureDateStr && 
            deliverable.status !== 'completed') {
          upcomingDeliverables.push({ project, deliverable });
        }
      });
    });

    return Promise.resolve(upcomingDeliverables);
  },

  // Gestion des notifications
  getNotifications: (): Promise<ProjectNotification[]> => {
    return Promise.resolve(mockNotifications);
  },

  createNotification: (notification: Omit<ProjectNotification, 'id' | 'createdDate' | 'read'>): Promise<ProjectNotification> => {
    const newNotification: ProjectNotification = {
      ...notification,
      id: `notification-${Date.now()}`,
      createdDate: new Date().toISOString(),
      read: false
    };
    
    mockNotifications.push(newNotification);
    return Promise.resolve(newNotification);
  },

  markNotificationAsRead: (notificationId: string): Promise<boolean> => {
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (!notification) return Promise.resolve(false);
    
    notification.read = true;
    return Promise.resolve(true);
  }
};
