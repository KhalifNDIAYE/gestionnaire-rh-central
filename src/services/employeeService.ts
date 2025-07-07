import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Employee = Tables<'employees'>;

// Types étendus pour inclure organizational_unit_id
export type CreateEmployeeData = TablesInsert<'employees'> & {
  organizational_unit_id?: string | null;
};

export type UpdateEmployeeData = TablesUpdate<'employees'> & {
  organizational_unit_id?: string | null;
};

// Type pour employé avec unité organisationnelle
export interface EmployeeWithUnit extends Employee {
  organizational_unit_id?: string | null;
  organizational_unit?: {
    id: string;
    name: string;
    type: string;
  } | null;
}

class EmployeeService {
  async getAllEmployees(): Promise<Employee[]> {
    console.log('Fetching employees from Supabase...');
    
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching employees:', error);
      throw new Error(`Erreur lors du chargement des employés: ${error.message}`);
    }
    
    console.log('Employees fetched successfully:', data?.length);
    return data || [];
  }

  async getAllEmployeesWithUnits(): Promise<EmployeeWithUnit[]> {
    console.log('Fetching employees with organizational units from Supabase...');
    
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching employees with units:', error);
      throw new Error(`Erreur lors du chargement des employés: ${error.message}`);
    }
    
    console.log('Employees with units fetched successfully:', data?.length);
    
    // Convertir les données avec le bon type
    const employeesWithUnits: EmployeeWithUnit[] = (data || []).map(employee => ({
      ...employee,
      organizational_unit: null // Pour l'instant, pas de jointure avec les unités organisationnelles
    }));
    
    return employeesWithUnits;
  }

  async createEmployee(employeeData: CreateEmployeeData): Promise<Employee> {
    console.log('Creating employee:', employeeData);
    
    const { data, error } = await supabase
      .from('employees')
      .insert(employeeData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating employee:', error);
      throw new Error(`Erreur lors de la création de l'employé: ${error.message}`);
    }
    
    console.log('Employee created successfully:', data);
    return data;
  }

  async updateEmployee(id: string, employeeData: UpdateEmployeeData): Promise<Employee> {
    console.log('Updating employee:', id, employeeData);
    
    const { data, error } = await supabase
      .from('employees')
      .update(employeeData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating employee:', error);
      throw new Error(`Erreur lors de la mise à jour de l'employé: ${error.message}`);
    }
    
    console.log('Employee updated successfully:', data);
    return data;
  }

  async deleteEmployee(id: string): Promise<void> {
    console.log('Deleting employee:', id);
    
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting employee:', error);
      throw new Error(`Erreur lors de la suppression de l'employé: ${error.message}`);
    }
    
    console.log('Employee deleted successfully');
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    console.log('Fetching employee by ID:', id);
    
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching employee by ID:', error);
      throw new Error(`Erreur lors de la récupération de l'employé: ${error.message}`);
    }
    
    return data;
  }

  async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    console.log('Fetching employees by department:', department);
    
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('department', department)
      .order('name');
    
    if (error) {
      console.error('Error fetching employees by department:', error);
      throw new Error(`Erreur lors de la récupération des employés par département: ${error.message}`);
    }
    
    return data || [];
  }

  async getEmployeesByStatus(status: 'active' | 'inactive'): Promise<Employee[]> {
    console.log('Fetching employees by status:', status);
    
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('status', status)
      .order('name');
    
    if (error) {
      console.error('Error fetching employees by status:', error);
      throw new Error(`Erreur lors de la récupération des employés par statut: ${error.message}`);
    }
    
    return data || [];
  }

  async getEmployeesByType(type: 'employee' | 'consultant'): Promise<Employee[]> {
    console.log('Fetching employees by type:', type);
    
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('type', type)
      .order('name');
    
    if (error) {
      console.error('Error fetching employees by type:', error);
      throw new Error(`Erreur lors de la récupération des employés par type: ${error.message}`);
    }
    
    return data || [];
  }

  async getEmployeesByOrganizationalUnit(unitId: string): Promise<Employee[]> {
    console.log('Fetching employees by organizational unit:', unitId);
    
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('organizational_unit_id', unitId)
      .order('name');
    
    if (error) {
      console.error('Error fetching employees by organizational unit:', error);
      throw new Error(`Erreur lors de la récupération des employés par unité: ${error.message}`);
    }
    
    return data || [];
  }
}

export const employeeService = new EmployeeService();
