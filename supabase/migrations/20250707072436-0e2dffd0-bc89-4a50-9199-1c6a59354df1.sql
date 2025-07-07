
-- Ajouter une colonne organizational_unit_id à la table employees
ALTER TABLE public.employees 
ADD COLUMN organizational_unit_id UUID REFERENCES public.organizational_units(id) ON DELETE SET NULL;

-- Créer un index pour améliorer les performances des requêtes
CREATE INDEX idx_employees_organizational_unit_id ON public.employees(organizational_unit_id);
