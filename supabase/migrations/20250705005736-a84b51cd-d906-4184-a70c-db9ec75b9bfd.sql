
-- Create job_functions table to replace local storage
CREATE TABLE public.job_functions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('junior', 'intermediate', 'senior', 'expert')) DEFAULT 'junior',
  permissions TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.job_functions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_functions
CREATE POLICY "Users can view all job functions" 
  ON public.job_functions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can create job functions" 
  ON public.job_functions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can update job functions" 
  ON public.job_functions 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Admins can delete job functions" 
  ON public.job_functions 
  FOR DELETE 
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_job_functions_updated_at
  BEFORE UPDATE ON public.job_functions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_job_functions_status ON public.job_functions(status);
CREATE INDEX idx_job_functions_level ON public.job_functions(level);
CREATE INDEX idx_job_functions_department ON public.job_functions(department);

-- Insert initial data
INSERT INTO public.job_functions (title, department, description, level, permissions, status) VALUES
  (
    'Développeur Full Stack', 
    'IT', 
    'Développement d''applications web complètes (frontend et backend)', 
    'senior', 
    ARRAY['time-tracking', 'leave-requests', 'payroll', 'profile'], 
    'active'
  ),
  (
    'Responsable RH', 
    'RH', 
    'Gestion des ressources humaines et du personnel', 
    'expert', 
    ARRAY['employees', 'leave-requests', 'payroll', 'departments', 'time-tracking', 'profile'], 
    'active'
  ),
  (
    'Chef de Département', 
    'Finance', 
    'Direction et coordination des activités du département', 
    'expert', 
    ARRAY['leave-requests', 'payroll', 'salary', 'profile'], 
    'active'
  ),
  (
    'Analyste Financier', 
    'Finance', 
    'Analyse des données financières et reporting', 
    'intermediate', 
    ARRAY['payroll', 'profile'], 
    'active'
  );
