import { supabase } from '@/integrations/supabase/client';

export interface Employee {
  id: string;
  name: string;
  email: string;
  fonction: string;
  department: string;
  status: string;
  type: string;
  start_date: string;
  salary?: number;
  hourly_rate?: number;
  company?: string;
  organizational_unit_id?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeData {
  name: string;
  email: string;
  fonction: string;
  department: string;
  status?: string;
  type?: string;
  start_date: string;
  salary?: number;
  hourly_rate?: number;
  company?: string;
  organizational_unit_id?: string;
  end_date?: string;
}

export interface UpdateEmployeeData {
  name?: string;
  email?: string;
  fonction?: string;
  department?: string;
  status?: string;
  type?: string;
  start_date?: string;
  salary?: number;
  hourly_rate?: number;
  company?: string;
  organizational_unit_id?: string;
  end_date?: string;
}

export interface EmployeeWithUnit extends Employee {
  organizational_unit?: {
    id: string;
    name: string;
    type: string;
  } | null;
}

class EmployeeService {
  async getAllEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Erreur lors du chargement des employés: ${error.message}`);
    }
    
    return data || [];
  }

  async getAllEmployeesWithUnits(): Promise<EmployeeWithUnit[]> {
    const { data, error } = await supabase
      .from('employees')
      .select(`*`)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Erreur lors du chargement des employés: ${error.message}`);
    }
    
    const employeesWithUnits: EmployeeWithUnit[] = (data || []).map(employee => ({
      ...employee,
      organizational_unit: null
    }));
    
    return employeesWithUnits;
  }

  async createEmployee(employeeData: CreateEmployeeData): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .insert(employeeData)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erreur lors de la création de l'employé: ${error.message}`);
    }
    
    return data;
  }

  async updateEmployee(id: string, employeeData: UpdateEmployeeData): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .update(employeeData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erreur lors de la mise à jour de l'employé: ${error.message}`);
    }
    
    return data;
  }

  async deleteEmployee(id: string): Promise<void> {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Erreur lors de la suppression de l'employé: ${error.message}`);
    }
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      throw new Error(`Erreur lors de la récupération de l'employé: ${error.message}`);
    }
    
    return data;
  }

  async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('department', department)
      .order('name');
    
    if (error) {
      throw new Error(`Erreur lors de la récupération des employés par département: ${error.message}`);
    }
    
    return data || [];
  }

  async getEmployeesByStatus(status: 'active' | 'inactive'): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('status', status)
      .order('name');
    
    if (error) {
      throw new Error(`Erreur lors de la récupération des employés par statut: ${error.message}`);
    }
    
    return data || [];
  }

  async getEmployeesByType(type: 'employee' | 'consultant'): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('type', type)
      .order('name');
    
    if (error) {
      throw new Error(`Erreur lors de la récupération des employés par type: ${error.message}`);
    }
    
    return data || [];
  }

  async getEmployeesByOrganizationalUnit(unitId: string): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('organizational_unit_id', unitId)
      .order('name');
    
    if (error) {
      throw new Error(`Erreur lors de la récupération des employés par unité: ${error.message}`);
    }
    
    return data || [];
  }
}

export const employeeService = new EmployeeService();