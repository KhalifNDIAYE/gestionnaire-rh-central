
import { apiService } from './apiService';
import { API_ENDPOINTS } from '../config/api';

export interface Task {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  dependencies: string[];
  assignedTo: string[];
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
  assignedTo?: string[];
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
  projectManager: string;
  team: string[];
  consultants: string[];
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

// Mock data pour fallback
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
  }
];

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    try {
      const projects = await apiService.get<Project[]>(API_ENDPOINTS.projects);
      return projects;
    } catch (error) {
      console.error('Error fetching projects from API, using fallback:', error);
      return mockProjects;
    }
  },

  getProject: async (id: string): Promise<Project | null> => {
    try {
      const project = await apiService.get<Project>(API_ENDPOINTS.project(id));
      return project;
    } catch (error) {
      console.error('Error fetching project from API, using fallback:', error);
      return mockProjects.find(p => p.id === id) || null;
    }
  },

  createProject: async (project: Omit<Project, 'id'>): Promise<Project> => {
    try {
      const newProject = await apiService.post<Project>(API_ENDPOINTS.projects, project);
      return newProject;
    } catch (error) {
      console.error('Error creating project via API:', error);
      throw new Error('Impossible de créer le projet');
    }
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<Project | null> => {
    try {
      const updatedProject = await apiService.put<Project>(API_ENDPOINTS.project(id), updates);
      return updatedProject;
    } catch (error) {
      console.error('Error updating project via API:', error);
      throw new Error('Impossible de mettre à jour le projet');
    }
  },

  deleteProject: async (id: string): Promise<boolean> => {
    try {
      await apiService.delete(API_ENDPOINTS.project(id));
      return true;
    } catch (error) {
      console.error('Error deleting project via API:', error);
      return false;
    }
  },

  addTask: async (projectId: string, task: Omit<Task, 'id'>): Promise<Task | null> => {
    try {
      const newTask = await apiService.post<Task>(`${API_ENDPOINTS.project(projectId)}/tasks`, task);
      return newTask;
    } catch (error) {
      console.error('Error adding task via API:', error);
      return null;
    }
  },

  updateTaskProgress: async (projectId: string, taskId: string, progress: number): Promise<boolean> => {
    try {
      await apiService.patch(`${API_ENDPOINTS.project(projectId)}/tasks/${taskId}`, { progress });
      return true;
    } catch (error) {
      console.error('Error updating task progress via API:', error);
      return false;
    }
  },

  addDeliverable: async (projectId: string, deliverable: Omit<Deliverable, 'id'>): Promise<Deliverable | null> => {
    try {
      const newDeliverable = await apiService.post<Deliverable>(`${API_ENDPOINTS.project(projectId)}/deliverables`, deliverable);
      return newDeliverable;
    } catch (error) {
      console.error('Error adding deliverable via API:', error);
      return null;
    }
  },

  updateDeliverable: async (projectId: string, deliverableId: string, updates: Partial<Deliverable>): Promise<boolean> => {
    try {
      await apiService.put(`${API_ENDPOINTS.project(projectId)}/deliverables/${deliverableId}`, updates);
      return true;
    } catch (error) {
      console.error('Error updating deliverable via API:', error);
      return false;
    }
  },

  getOverdueDeliverables: async (): Promise<{ project: Project; deliverable: Deliverable }[]> => {
    try {
      const result = await apiService.get<{ project: Project; deliverable: Deliverable }[]>('/projects/overdue-deliverables');
      return result;
    } catch (error) {
      console.error('Error fetching overdue deliverables from API:', error);
      return [];
    }
  },

  getUpcomingDeadlines: async (days: number = 7): Promise<{ project: Project; deliverable: Deliverable }[]> => {
    try {
      const result = await apiService.get<{ project: Project; deliverable: Deliverable }[]>(`/projects/upcoming-deadlines?days=${days}`);
      return result;
    } catch (error) {
      console.error('Error fetching upcoming deadlines from API:', error);
      return [];
    }
  },

  getNotifications: async (): Promise<ProjectNotification[]> => {
    try {
      const notifications = await apiService.get<ProjectNotification[]>('/projects/notifications');
      return notifications;
    } catch (error) {
      console.error('Error fetching project notifications from API:', error);
      return [];
    }
  },

  createNotification: async (notification: Omit<ProjectNotification, 'id' | 'createdDate' | 'read'>): Promise<ProjectNotification> => {
    try {
      const newNotification = await apiService.post<ProjectNotification>('/projects/notifications', notification);
      return newNotification;
    } catch (error) {
      console.error('Error creating notification via API:', error);
      throw new Error('Impossible de créer la notification');
    }
  },

  markNotificationAsRead: async (notificationId: string): Promise<boolean> => {
    try {
      await apiService.patch(`/projects/notifications/${notificationId}`, { read: true });
      return true;
    } catch (error) {
      console.error('Error marking notification as read via API:', error);
      return false;
    }
  }
};
