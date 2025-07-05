
-- Create memorandums table
CREATE TABLE public.memorandums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('information', 'directive', 'rappel', 'urgent')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'level1_pending' CHECK (status IN ('draft', 'level1_pending', 'level2_pending', 'level3_pending', 'approved', 'rejected')),
  target_audience TEXT[] DEFAULT ARRAY['tous']
);

-- Create validation_steps table for tracking validation history
CREATE TABLE public.validation_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memorandum_id UUID NOT NULL REFERENCES public.memorandums(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level IN (1, 2, 3)),
  validator_id TEXT NOT NULL,
  validator_name TEXT NOT NULL,
  validator_role TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected')),
  comment TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.memorandums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validation_steps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for memorandums
CREATE POLICY "Users can view all memorandums" 
  ON public.memorandums 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create memorandums" 
  ON public.memorandums 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Authors and managers can update memorandums" 
  ON public.memorandums 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Authors and managers can delete memorandums" 
  ON public.memorandums 
  FOR DELETE 
  USING (true);

-- RLS Policies for validation_steps
CREATE POLICY "Users can view all validation steps" 
  ON public.validation_steps 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create validation steps" 
  ON public.validation_steps 
  FOR INSERT 
  WITH CHECK (true);

-- Add triggers for updated_at
CREATE TRIGGER update_memorandums_updated_at
  BEFORE UPDATE ON public.memorandums
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_memorandums_status ON public.memorandums(status);
CREATE INDEX idx_memorandums_author_id ON public.memorandums(author_id);
CREATE INDEX idx_memorandums_created_at ON public.memorandums(created_at DESC);
CREATE INDEX idx_validation_steps_memorandum_id ON public.validation_steps(memorandum_id);
