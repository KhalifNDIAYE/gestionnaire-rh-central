
-- Create leave_requests table to replace local storage
CREATE TABLE public.leave_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_name TEXT NOT NULL,
  type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  submitted_at DATE NOT NULL DEFAULT CURRENT_DATE,
  manager_comment TEXT,
  approved_by TEXT,
  approved_at DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leave_requests
CREATE POLICY "Users can view all leave requests" 
  ON public.leave_requests 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create leave requests" 
  ON public.leave_requests 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update leave requests" 
  ON public.leave_requests 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete leave requests" 
  ON public.leave_requests 
  FOR DELETE 
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_leave_requests_updated_at
  BEFORE UPDATE ON public.leave_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_leave_requests_status ON public.leave_requests(status);
CREATE INDEX idx_leave_requests_employee ON public.leave_requests(employee_name);
CREATE INDEX idx_leave_requests_start_date ON public.leave_requests(start_date);

-- Insert initial data
INSERT INTO public.leave_requests (employee_name, type, start_date, end_date, reason, status, submitted_at, manager_comment, approved_by, approved_at) VALUES
  (
    'Jean Dupont', 
    'Congés payés', 
    '2024-06-15', 
    '2024-06-20', 
    'Vacances en famille', 
    'pending', 
    '2024-05-20',
    NULL,
    NULL,
    NULL
  ),
  (
    'Marie Martin', 
    'Congé maladie', 
    '2024-05-28', 
    '2024-05-30', 
    'Consultation médicale', 
    'approved', 
    '2024-05-25',
    'Approuvé, bon rétablissement',
    'Manager RH',
    '2024-05-26'
  ),
  (
    'Paul Bernard', 
    'RTT', 
    '2024-06-03', 
    '2024-06-03', 
    'Récupération', 
    'rejected', 
    '2024-05-22',
    'Charge de travail trop importante cette semaine',
    'Manager RH',
    '2024-05-23'
  );
