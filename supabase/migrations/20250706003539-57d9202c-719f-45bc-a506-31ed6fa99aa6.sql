
-- Create organizational_units table to replace local storage
CREATE TABLE public.organizational_units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('direction', 'unite', 'cellule', 'comite', 'service')),
  description TEXT NOT NULL,
  parent_id UUID REFERENCES public.organizational_units(id) ON DELETE CASCADE,
  manager_id UUID,
  manager_name TEXT,
  employees TEXT[] DEFAULT '{}',
  color TEXT NOT NULL DEFAULT '#6b7280',
  level INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.organizational_units ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizational_units
CREATE POLICY "Users can view all organizational units" 
  ON public.organizational_units 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admin and RH can create organizational units" 
  ON public.organizational_units 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admin and RH can update organizational units" 
  ON public.organizational_units 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Admin and RH can delete organizational units" 
  ON public.organizational_units 
  FOR DELETE 
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_organizational_units_updated_at
  BEFORE UPDATE ON public.organizational_units
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_organizational_units_parent_id ON public.organizational_units(parent_id);
CREATE INDEX idx_organizational_units_type ON public.organizational_units(type);
CREATE INDEX idx_organizational_units_level ON public.organizational_units(level);

-- Insert initial organizational structure data
INSERT INTO public.organizational_units (id, name, type, description, parent_id, level, color, employees, manager_name) VALUES
  ('1', 'Assemblée Générale', 'direction', 'Assemblée générale de l''organisation', NULL, 0, '#22c55e', '{}', NULL),
  ('2', 'Directeur Général (DG)', 'direction', 'Direction générale', '1', 1, '#22c55e', '{}', NULL),
  ('3', 'Directeur Technique (DT)', 'direction', 'Direction technique', '2', 2, '#eab308', '{}', NULL),
  ('4', 'Conseillers', 'service', 'Conseillers de direction', '2', 2, '#6b7280', '{}', NULL),
  ('5', 'Directeur Administratif et Financier (DAF)', 'direction', 'Direction administrative et financière', '2', 2, '#eab308', '{}', NULL),
  ('6', 'UNITÉ 1 - Veille Environnementale, Recherche et Formation (VERF)', 'unite', 'Unité de veille environnementale, recherche et formation', '3', 3, '#84cc16', '{}', NULL),
  ('7', 'UNITÉ 2 - Biodiversité et écosystèmes Terrestres et Marins (BETM)', 'unite', 'Unité biodiversité et écosystèmes terrestres et marins', '3', 3, '#84cc16', '{}', NULL),
  ('8', 'UNITÉ 3 - Évaluation environnementale et sociale et gestion des Risques (EESGR)', 'unite', 'Unité évaluation environnementale et sociale et gestion des risques', '3', 3, '#84cc16', '{}', NULL),
  ('9', 'CELLULE - Communication et gestion des Ressources Documentaires', 'cellule', 'Cellule communication et gestion des ressources documentaires', '3', 3, '#f97316', '{}', NULL),
  ('10', 'CELLULE - Informatique, gestion de données et services techniques', 'cellule', 'Cellule informatique, gestion de données et services techniques', '3', 3, '#f97316', '{}', NULL),
  ('11', 'CELLULE - Mobilisation des ressources financières', 'cellule', 'Cellule mobilisation des ressources financières', '3', 3, '#f97316', '{}', NULL),
  ('12', 'UNITÉ 4 - Océan-Littoral et Ecosystèmes Aquatiques', 'unite', 'Unité océan-littoral et écosystèmes aquatiques', '3', 3, '#84cc16', '{}', NULL),
  ('13', 'UNITE 5 - Sécurité Alimentaire et Systèmes de Production Durable', 'unite', 'Unité sécurité alimentaire et systèmes de production durable', '3', 3, '#84cc16', '{}', NULL),
  ('14', 'UNITE 6 - Finances et Réponses Climatiques', 'unite', 'Unité finances et réponses climatiques', '3', 3, '#84cc16', '{}', NULL),
  ('15', 'CELLULE - Suivi Evaluation et Qualité', 'cellule', 'Cellule suivi évaluation et qualité', '3', 3, '#f97316', '{}', NULL);
