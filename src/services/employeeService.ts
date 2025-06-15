
interface Employee {
  id: string;
  name: string;
  email: string;
  fonction: string;
  department: string;
  status: 'active' | 'inactive';
  startDate: string;
  salary: number;
  type: 'employee' | 'consultant';
  endDate?: string;
  hourlyRate?: number;
  company?: string;
}

const EMPLOYEES_STORAGE_KEY = 'hr_employees';

// Données mock initiales
const mockEmployees: Employee[] = [
  { id: '1', name: 'Jean Dupont', email: 'jean.dupont@company.com', fonction: 'Développeur Full Stack', department: 'IT', status: 'active', startDate: '2023-01-15', salary: 45000, type: 'employee' },
  { id: '2', name: 'Marie Martin', email: 'marie.martin@company.com', fonction: 'Analyste Financier', department: 'Finance', status: 'active', startDate: '2022-08-10', salary: 50000, type: 'employee' },
  { id: '3', name: 'Paul Bernard', email: 'paul.bernard@company.com', fonction: 'Chef de Département RH', department: 'HR', status: 'active', startDate: '2021-03-20', salary: 60000, type: 'employee' },
  { id: '4', name: 'Sophie Durand', email: 'sophie.durand@company.com', fonction: 'Chargée de Communication', department: 'Marketing', status: 'inactive', startDate: '2020-11-05', salary: 48000, type: 'employee' },
  { id: 'consultant-1', name: 'Marc Consultant', email: 'marc@consultingfirm.com', fonction: 'Consultant ERP', department: 'IT', status: 'active', startDate: '2024-01-15', salary: 0, type: 'consultant', endDate: '2024-06-30', hourlyRate: 120, company: 'TechConsult SARL' },
  { id: 'consultant-2', name: 'Julie Expert', email: 'julie@webagency.com', fonction: 'Consultant Web', department: 'Marketing', status: 'active', startDate: '2024-03-01', salary: 0, type: 'consultant', endDate: '2024-05-31', hourlyRate: 95, company: 'WebDesign Pro' },
];

class EmployeeService {
  private getEmployees(): Employee[] {
    const stored = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialiser avec les données mock si pas de données stockées
    this.saveEmployees(mockEmployees);
    return mockEmployees;
  }

  private saveEmployees(employees: Employee[]): void {
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
  }

  private generateId(): string {
    return 'emp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async getAllEmployees(): Promise<Employee[]> {
    // Simuler un délai API
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.getEmployees();
  }

  async createEmployee(employeeData: Omit<Employee, 'id'>): Promise<Employee> {
    console.log('Creating employee:', employeeData);
    
    // Simuler un délai API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const employees = this.getEmployees();
    const newEmployee: Employee = {
      ...employeeData,
      id: this.generateId(),
    };
    
    employees.push(newEmployee);
    this.saveEmployees(employees);
    
    console.log('Employee created successfully:', newEmployee);
    return newEmployee;
  }

  async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee> {
    console.log('Updating employee:', id, employeeData);
    
    // Simuler un délai API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const employees = this.getEmployees();
    const index = employees.findIndex(emp => emp.id === id);
    
    if (index === -1) {
      throw new Error('Employé introuvable');
    }
    
    const updatedEmployee = { ...employees[index], ...employeeData };
    employees[index] = updatedEmployee;
    this.saveEmployees(employees);
    
    console.log('Employee updated successfully:', updatedEmployee);
    return updatedEmployee;
  }

  async deleteEmployee(id: string): Promise<void> {
    console.log('Deleting employee:', id);
    
    // Simuler un délai API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const employees = this.getEmployees();
    const index = employees.findIndex(emp => emp.id === id);
    
    if (index === -1) {
      throw new Error('Employé introuvable');
    }
    
    employees.splice(index, 1);
    this.saveEmployees(employees);
    
    console.log('Employee deleted successfully');
  }
}

export const employeeService = new EmployeeService();
export type { Employee };
