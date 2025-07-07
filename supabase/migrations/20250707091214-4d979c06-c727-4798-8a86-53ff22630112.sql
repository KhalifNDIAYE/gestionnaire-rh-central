
-- Créer la table time_entries pour stocker les pointages
CREATE TABLE public.time_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  clock_in TIME,
  clock_out TIME,
  break_start TIME,
  break_end TIME,
  total_hours DECIMAL(4,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'partial' CHECK (status IN ('present', 'absent', 'late', 'partial')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(employee_id, date)
);

-- Ajouter RLS sur la table time_entries
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous les utilisateurs authentifiés de voir tous les pointages
CREATE POLICY "Users can view all time entries" 
  ON public.time_entries 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Politique pour permettre à tous les utilisateurs authentifiés de créer des pointages
CREATE POLICY "Users can create time entries" 
  ON public.time_entries 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Politique pour permettre à tous les utilisateurs authentifiés de modifier des pointages
CREATE POLICY "Users can update time entries" 
  ON public.time_entries 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Politique pour permettre à tous les utilisateurs authentifiés de supprimer des pointages
CREATE POLICY "Users can delete time entries" 
  ON public.time_entries 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Créer un trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_time_entries_updated_at
  BEFORE UPDATE ON public.time_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Créer un index pour optimiser les requêtes par employé et date
CREATE INDEX idx_time_entries_employee_date ON public.time_entries(employee_id, date);
CREATE INDEX idx_time_entries_date ON public.time_entries(date);
