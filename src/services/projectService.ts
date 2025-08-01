import { supabase } from '@/integrations/supabase/client';

// Types pour les projets
export interface Task {
  id: string;
  name: string;
  description: string;
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
  assignedTo: string[];
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
  deliverables: Deliverable[];
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  date: string;
  isCompleted: boolean;
}

export interface ProjectNotification {
  id: string;
  projectId: string;
  deliverableId?: string;
  type: 'deadline-warning' | 'overdue' | 'completed';
  message: string;
  read: boolean;
  createdDate: string;
}

// Mock data for fallback
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Système de Gestion des Employés',
    description: 'Développement d\'un système complet de gestion des employés avec modules RH',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    status: 'active',
    budget: 150000,
    actualCost: 75000,
    projectManager: 'Jean Dupont',
    team: ['Alice Martin', 'Bob Johnson', 'Claire Wilson'],
    consultants: ['Expert Tech Solutions'],
    tasks: [
      {
        id: 'task-1',
        name: 'Analyse des besoins',
        description: 'Collecte et analyse des besoins fonctionnels',
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        duration: 30,
        progress: 100,
        dependencies: [],
        assignedTo: ['Alice Martin'],
        priority: 'high',
        status: 'completed'
      }
    ],
    deliverables: [
      {
        id: 'deliv-1',
        name: 'Documentation technique',
        description: 'Spécifications techniques complètes',
        dueDate: '2024-06-30',
        status: 'in-progress',
        priority: 'high',
        assignedTo: ['Alice Martin', 'Bob Johnson']
      }
    ],
    milestones: [
      {
        id: 'milestone-1',
        name: 'Phase 1 - Analyse',
        description: 'Finalisation de l\'analyse des besoins',
        date: '2024-02-15',
        isCompleted: true
      }
    ]
  }
];

export const projectService = {
  async getProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        startDate: project.start_date,
        endDate: project.end_date,
        status: project.status as 'planning' | 'active' | 'completed' | 'cancelled',
        budget: project.budget,
        actualCost: project.actual_cost,
        projectManager: project.project_manager,
        team: project.team,
        consultants: project.consultants,
        tasks: [],
        deliverables: [],
        milestones: []
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  async getProject(id: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        startDate: data.start_date,
        endDate: data.end_date,
        status: data.status as 'planning' | 'active' | 'completed' | 'cancelled',
        budget: data.budget,
        actualCost: data.actual_cost,
        projectManager: data.project_manager,
        team: data.team,
        consultants: data.consultants,
        tasks: [],
        deliverables: [],
        milestones: []
      };
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  },

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name: project.name,
          description: project.description,
          start_date: project.startDate,
          end_date: project.endDate,
          status: project.status,
          budget: project.budget,
          actual_cost: project.actualCost || 0,
          project_manager: project.projectManager,
          team: project.team || [],
          consultants: project.consultants || []
        }])
        .select()
        .single();

      if (error) throw error;

      // Create deliverables if provided
      if (project.deliverables && project.deliverables.length > 0) {
        const deliverablesData = project.deliverables.map(deliverable => ({
          project_id: data.id,
          name: deliverable.name,
          description: deliverable.description,
          due_date: deliverable.dueDate,
          status: deliverable.status,
          priority: deliverable.priority,
          assigned_to: deliverable.assignedTo || []
        }));

        await supabase
          .from('project_deliverables')
          .insert(deliverablesData);
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        startDate: data.start_date,
        endDate: data.end_date,
        status: data.status as 'planning' | 'active' | 'completed' | 'cancelled',
        budget: data.budget,
        actualCost: data.actual_cost,
        projectManager: data.project_manager,
        team: data.team,
        consultants: data.consultants,
        tasks: [],
        deliverables: project.deliverables || [],
        milestones: []
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          name: updates.name,
          description: updates.description,
          start_date: updates.startDate,
          end_date: updates.endDate,
          status: updates.status,
          budget: updates.budget,
          actual_cost: updates.actualCost,
          project_manager: updates.projectManager,
          team: updates.team,
          consultants: updates.consultants
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        startDate: data.start_date,
        endDate: data.end_date,
        status: data.status as 'planning' | 'active' | 'completed' | 'cancelled',
        budget: data.budget,
        actualCost: data.actual_cost,
        projectManager: data.project_manager,
        team: data.team,
        consultants: data.consultants,
        tasks: [],
        deliverables: [],
        milestones: []
      };
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  },

  async deleteProject(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  },

  async addTask(projectId: string, task: Omit<Task, 'id'>): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('project_tasks')
        .insert([{
          project_id: projectId,
          name: task.name,
          description: task.description,
          start_date: task.startDate,
          end_date: task.endDate,
          duration: task.duration,
          progress: task.progress,
          dependencies: task.dependencies || [],
          assigned_to: task.assignedTo || [],
          priority: task.priority,
          status: task.status
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        startDate: data.start_date,
        endDate: data.end_date,
        duration: data.duration,
        progress: data.progress,
        dependencies: data.dependencies,
        assignedTo: data.assigned_to,
        priority: data.priority as 'low' | 'medium' | 'high' | 'critical',
        status: data.status as 'not-started' | 'in-progress' | 'completed' | 'on-hold'
      };
    } catch (error) {
      console.error('Error adding task:', error);
      return null;
    }
  },

  async updateTaskProgress(projectId: string, taskId: string, progress: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('project_tasks')
        .update({ progress })
        .eq('id', taskId)
        .eq('project_id', projectId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating task progress:', error);
      return false;
    }
  },

  async addDeliverable(projectId: string, deliverable: Omit<Deliverable, 'id'>): Promise<Deliverable | null> {
    try {
      const { data, error } = await supabase
        .from('project_deliverables')
        .insert([{
          project_id: projectId,
          name: deliverable.name,
          description: deliverable.description,
          due_date: deliverable.dueDate,
          status: deliverable.status,
          priority: deliverable.priority,
          assigned_to: deliverable.assignedTo || []
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        dueDate: data.due_date,
        status: data.status as 'pending' | 'in-progress' | 'completed' | 'overdue',
        priority: data.priority as 'low' | 'medium' | 'high' | 'critical',
        completedDate: data.completed_date,
        assignedTo: data.assigned_to
      };
    } catch (error) {
      console.error('Error adding deliverable:', error);
      return null;
    }
  },

  async updateDeliverable(projectId: string, deliverableId: string, updates: Partial<Deliverable>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('project_deliverables')
        .update({
          name: updates.name,
          description: updates.description,
          due_date: updates.dueDate,
          status: updates.status,
          priority: updates.priority,
          completed_date: updates.completedDate,
          assigned_to: updates.assignedTo
        })
        .eq('id', deliverableId)
        .eq('project_id', projectId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating deliverable:', error);
      return false;
    }
  },

  async getOverdueDeliverables(): Promise<{ project: Project; deliverable: Deliverable }[]> {
    try {
      const { data, error } = await supabase
        .from('project_deliverables')
        .select(`
          *,
          projects (*)
        `)
        .lt('due_date', new Date().toISOString().split('T')[0])
        .neq('status', 'completed');

      if (error) throw error;

      return data.map((item: any) => ({
        project: {
          id: item.projects.id,
          name: item.projects.name,
          description: item.projects.description,
          startDate: item.projects.start_date,
          endDate: item.projects.end_date,
          status: item.projects.status as 'planning' | 'active' | 'completed' | 'cancelled',
          budget: item.projects.budget,
          actualCost: item.projects.actual_cost,
          projectManager: item.projects.project_manager,
          team: item.projects.team,
          consultants: item.projects.consultants,
          tasks: [],
          deliverables: [],
          milestones: []
        },
        deliverable: {
          id: item.id,
          name: item.name,
          description: item.description,
          dueDate: item.due_date,
          status: item.status as 'pending' | 'in-progress' | 'completed' | 'overdue',
          priority: item.priority as 'low' | 'medium' | 'high' | 'critical',
          completedDate: item.completed_date,
          assignedTo: item.assigned_to
        }
      }));
    } catch (error) {
      console.error('Error fetching overdue deliverables:', error);
      return [];
    }
  },

  async getUpcomingDeadlines(days: number = 7): Promise<{ project: Project; deliverable: Deliverable }[]> {
    try {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);

      const { data, error } = await supabase
        .from('project_deliverables')
        .select(`
          *,
          projects (*)
        `)
        .gte('due_date', new Date().toISOString().split('T')[0])
        .lte('due_date', endDate.toISOString().split('T')[0])
        .neq('status', 'completed');

      if (error) throw error;

      return data.map((item: any) => ({
        project: {
          id: item.projects.id,
          name: item.projects.name,
          description: item.projects.description,
          startDate: item.projects.start_date,
          endDate: item.projects.end_date,
          status: item.projects.status as 'planning' | 'active' | 'completed' | 'cancelled',
          budget: item.projects.budget,
          actualCost: item.projects.actual_cost,
          projectManager: item.projects.project_manager,
          team: item.projects.team,
          consultants: item.projects.consultants,
          tasks: [],
          deliverables: [],
          milestones: []
        },
        deliverable: {
          id: item.id,
          name: item.name,
          description: item.description,
          dueDate: item.due_date,
          status: item.status as 'pending' | 'in-progress' | 'completed' | 'overdue',
          priority: item.priority as 'low' | 'medium' | 'high' | 'critical',
          completedDate: item.completed_date,
          assignedTo: item.assigned_to
        }
      }));
    } catch (error) {
      console.error('Error fetching upcoming deadlines:', error);
      return [];
    }
  },

  async getNotifications(): Promise<ProjectNotification[]> {
    try {
      const { data, error } = await supabase
        .from('project_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(notification => ({
        id: notification.id,
        projectId: notification.project_id,
        deliverableId: notification.deliverable_id,
        type: notification.type as 'deadline-warning' | 'overdue' | 'completed',
        message: notification.message,
        read: notification.is_read,
        createdDate: notification.created_at
      }));
    } catch (error) {
      console.error('Error fetching project notifications:', error);
      return [];
    }
  },

  async createNotification(notification: Omit<ProjectNotification, 'id' | 'createdDate' | 'read'>): Promise<ProjectNotification> {
    try {
      const { data, error } = await supabase
        .from('project_notifications')
        .insert([{
          project_id: notification.projectId,
          deliverable_id: notification.deliverableId,
          type: notification.type,
          message: notification.message
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        projectId: data.project_id,
        deliverableId: data.deliverable_id,
        type: data.type as 'deadline-warning' | 'overdue' | 'completed',
        message: data.message,
        read: data.is_read,
        createdDate: data.created_at
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('project_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }
};