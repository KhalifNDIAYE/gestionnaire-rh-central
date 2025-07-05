
-- Create employees table to replace local storage
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  fonction TEXT NOT NULL,
  department TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  start_date DATE NOT NULL,
  salary DECIMAL(10,2) DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('employee', 'consultant')) DEFAULT 'employee',
  end_date DATE,
  hourly_rate DECIMAL(8,2),
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employees
CREATE POLICY "Users can view all employees" 
  ON public.employees 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admin and HR can create employees" 
  ON public.employees 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admin and HR can update employees" 
  ON public.employees 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Admin and HR can delete employees" 
  ON public.employees 
  FOR DELETE 
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_employees_status ON public.employees(status);
CREATE INDEX idx_employees_type ON public.employees(type);
CREATE INDEX idx_employees_department ON public.employees(department);
CREATE INDEX idx_employees_email ON public.employees(email);

-- Insert some initial data
INSERT INTO public.employees (name, email, fonction, department, status, start_date, salary, type) VALUES
  ('Jean Dupont', 'jean.dupont@company.com', 'Développeur Full Stack', 'IT', 'active', '2023-01-15', 45000, 'employee'),
  ('Marie Martin', 'marie.martin@company.com', 'Analyste Financier', 'Finance', 'active', '2022-08-10', 50000, 'employee'),
  ('Paul Bernard', 'paul.bernard@company.com', 'Chef de Département RH', 'HR', 'active', '2021-03-20', 60000, 'employee'),
  ('Sophie Durand', 'sophie.durand@company.com', 'Chargée de Communication', 'Marketing', 'inactive', '2020-11-05', 48000, 'employee'),
  ('Marc Consultant', 'marc@consultingfirm.com', 'Consultant ERP', 'IT', 'active', '2024-01-15', 0, 'consultant'),
  ('Julie Expert', 'julie@webagency.com', 'Consultant Web', 'Marketing', 'active', '2024-03-01', 0, 'consultant');

-- Update consultant records with specific fields
UPDATE public.employees 
SET end_date = '2024-06-30', hourly_rate = 120, company = 'TechConsult SARL'
WHERE email = 'marc@consultingfirm.com';

UPDATE public.employees 
SET end_date = '2024-05-31', hourly_rate = 95, company = 'WebDesign Pro'
WHERE email = 'julie@webagency.com';
