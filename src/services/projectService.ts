
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
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  description: string;
  isCompleted: boolean;
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
    milestones: []
  }
];

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
  }
};
