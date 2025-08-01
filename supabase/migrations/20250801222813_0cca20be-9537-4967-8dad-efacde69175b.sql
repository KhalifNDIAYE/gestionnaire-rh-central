
-- Créer les tables pour la gestion des projets
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
  budget DECIMAL(12,2) NOT NULL DEFAULT 0,
  actual_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  project_manager TEXT NOT NULL,
  team TEXT[] DEFAULT '{}',
  consultants TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des tâches
CREATE TABLE public.project_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration INTEGER NOT NULL DEFAULT 1,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  dependencies TEXT[] DEFAULT '{}',
  assigned_to TEXT[] DEFAULT '{}',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed', 'on-hold')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des livrables
CREATE TABLE public.project_deliverables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'overdue')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  completed_date DATE,
  assigned_to TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des jalons
CREATE TABLE public.project_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des notifications de projet
CREATE TABLE public.project_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  deliverable_id UUID REFERENCES public.project_deliverables(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deadline-warning', 'overdue', 'completed')),
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_notifications ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les projets
CREATE POLICY "Users can view all projects" 
  ON public.projects 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Admin and managers can create projects" 
  ON public.projects 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin and managers can update projects" 
  ON public.projects 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Admin and managers can delete projects" 
  ON public.projects 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Politiques RLS pour les tâches
CREATE POLICY "Users can view all project tasks" 
  ON public.project_tasks 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create project tasks" 
  ON public.project_tasks 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update project tasks" 
  ON public.project_tasks 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete project tasks" 
  ON public.project_tasks 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Politiques RLS pour les livrables
CREATE POLICY "Users can view all project deliverables" 
  ON public.project_deliverables 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create project deliverables" 
  ON public.project_deliverables 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update project deliverables" 
  ON public.project_deliverables 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete project deliverables" 
  ON public.project_deliverables 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Politiques RLS pour les jalons
CREATE POLICY "Users can view all project milestones" 
  ON public.project_milestones 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create project milestones" 
  ON public.project_milestones 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update project milestones" 
  ON public.project_milestones 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete project milestones" 
  ON public.project_milestones 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Politiques RLS pour les notifications
CREATE POLICY "Users can view all project notifications" 
  ON public.project_notifications 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create project notifications" 
  ON public.project_notifications 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update project notifications" 
  ON public.project_notifications 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete project notifications" 
  ON public.project_notifications 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Créer les triggers pour updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_tasks_updated_at
  BEFORE UPDATE ON public.project_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_deliverables_updated_at
  BEFORE UPDATE ON public.project_deliverables
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_milestones_updated_at
  BEFORE UPDATE ON public.project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_notifications_updated_at
  BEFORE UPDATE ON public.project_notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Créer des index pour optimiser les performances
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_start_end_date ON public.projects(start_date, end_date);
CREATE INDEX idx_project_tasks_project_id ON public.project_tasks(project_id);
CREATE INDEX idx_project_tasks_status ON public.project_tasks(status);
CREATE INDEX idx_project_deliverables_project_id ON public.project_deliverables(project_id);
CREATE INDEX idx_project_deliverables_due_date ON public.project_deliverables(due_date);
CREATE INDEX idx_project_deliverables_status ON public.project_deliverables(status);
CREATE INDEX idx_project_milestones_project_id ON public.project_milestones(project_id);
CREATE INDEX idx_project_notifications_project_id ON public.project_notifications(project_id);
