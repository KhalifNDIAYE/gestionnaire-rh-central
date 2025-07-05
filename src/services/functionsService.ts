
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type JobFunction = Tables<'job_functions'>;
export type CreateJobFunctionData = TablesInsert<'job_functions'>;
export type UpdateJobFunctionData = TablesUpdate<'job_functions'>;

class FunctionsService {
  async getAllFunctions(): Promise<JobFunction[]> {
    console.log('Fetching job functions from Supabase...');
    
    const { data, error } = await supabase
      .from('job_functions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching job functions:', error);
      throw new Error(`Erreur lors du chargement des fonctions: ${error.message}`);
    }
    
    console.log('Job functions fetched successfully:', data?.length);
    return data || [];
  }

  async createFunction(functionData: Omit<CreateJobFunctionData, 'id' | 'created_at' | 'updated_at'>): Promise<JobFunction> {
    console.log('Creating job function:', functionData);
    
    const { data, error } = await supabase
      .from('job_functions')
      .insert(functionData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating job function:', error);
      throw new Error(`Erreur lors de la création de la fonction: ${error.message}`);
    }
    
    console.log('Job function created successfully:', data);
    return data;
  }

  async updateFunction(id: string, functionData: UpdateJobFunctionData): Promise<JobFunction> {
    console.log('Updating job function:', id, functionData);
    
    const { data, error } = await supabase
      .from('job_functions')
      .update(functionData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating job function:', error);
      throw new Error(`Erreur lors de la mise à jour de la fonction: ${error.message}`);
    }
    
    console.log('Job function updated successfully:', data);
    return data;
  }

  async deleteFunction(id: string): Promise<void> {
    console.log('Deleting job function:', id);
    
    const { error } = await supabase
      .from('job_functions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting job function:', error);
      throw new Error(`Erreur lors de la suppression de la fonction: ${error.message}`);
    }
    
    console.log('Job function deleted successfully');
  }

  async getFunctionById(id: string): Promise<JobFunction | null> {
    console.log('Fetching job function by ID:', id);
    
    const { data, error } = await supabase
      .from('job_functions')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching job function by ID:', error);
      throw new Error(`Erreur lors de la récupération de la fonction: ${error.message}`);
    }
    
    return data;
  }

  async getFunctionsByDepartment(department: string): Promise<JobFunction[]> {
    console.log('Fetching job functions by department:', department);
    
    const { data, error } = await supabase
      .from('job_functions')
      .select('*')
      .eq('department', department)
      .order('title');
    
    if (error) {
      console.error('Error fetching job functions by department:', error);
      throw new Error(`Erreur lors de la récupération des fonctions par département: ${error.message}`);
    }
    
    return data || [];
  }

  async getFunctionsByStatus(status: 'active' | 'inactive'): Promise<JobFunction[]> {
    console.log('Fetching job functions by status:', status);
    
    const { data, error } = await supabase
      .from('job_functions')
      .select('*')
      .eq('status', status)
      .order('title');
    
    if (error) {
      console.error('Error fetching job functions by status:', error);
      throw new Error(`Erreur lors de la récupération des fonctions par statut: ${error.message}`);
    }
    
    return data || [];
  }
}

export const functionsService = new FunctionsService();
