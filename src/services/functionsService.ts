
interface JobFunction {
  id: string;
  title: string;
  department: string;
  description: string;
  level: 'junior' | 'intermediate' | 'senior' | 'expert';
  permissions: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

const FUNCTIONS_STORAGE_KEY = 'hr_functions';

// Données mock initiales
const mockFunctions: JobFunction[] = [
  {
    id: '1',
    title: 'Développeur Full Stack',
    department: 'IT',
    description: 'Développement d\'applications web complètes (frontend et backend)',
    level: 'senior',
    permissions: ['time-tracking', 'leave-requests', 'payroll', 'profile'],
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Responsable RH',
    department: 'RH',
    description: 'Gestion des ressources humaines et du personnel',
    level: 'expert',
    permissions: ['employees', 'leave-requests', 'payroll', 'departments', 'time-tracking', 'profile'],
    status: 'active',
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'Chef de Département',
    department: 'Finance',
    description: 'Direction et coordination des activités du département',
    level: 'expert',
    permissions: ['leave-requests', 'payroll', 'salary', 'profile'],
    status: 'active',
    createdAt: '2024-01-08'
  },
  {
    id: '4',
    title: 'Analyste Financier',
    department: 'Finance',
    description: 'Analyse des données financières et reporting',
    level: 'intermediate',
    permissions: ['payroll', 'profile'],
    status: 'active',
    createdAt: '2024-01-05'
  }
];

class FunctionsService {
  private getFunctions(): JobFunction[] {
    const stored = localStorage.getItem(FUNCTIONS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialiser avec les données mock si pas de données stockées
    this.saveFunctions(mockFunctions);
    return mockFunctions;
  }

  private saveFunctions(functions: JobFunction[]): void {
    localStorage.setItem(FUNCTIONS_STORAGE_KEY, JSON.stringify(functions));
  }

  private generateId(): string {
    return 'func_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async getAllFunctions(): Promise<JobFunction[]> {
    // Simuler un délai API
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.getFunctions();
  }

  async createFunction(functionData: Omit<JobFunction, 'id'>): Promise<JobFunction> {
    console.log('Creating function:', functionData);
    
    // Simuler un délai API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const functions = this.getFunctions();
    const newFunction: JobFunction = {
      ...functionData,
      id: this.generateId(),
    };
    
    functions.push(newFunction);
    this.saveFunctions(functions);
    
    console.log('Function created successfully:', newFunction);
    return newFunction;
  }

  async updateFunction(id: string, functionData: Partial<JobFunction>): Promise<JobFunction> {
    console.log('Updating function:', id, functionData);
    
    // Simuler un délai API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const functions = this.getFunctions();
    const index = functions.findIndex(func => func.id === id);
    
    if (index === -1) {
      throw new Error('Fonction introuvable');
    }
    
    const updatedFunction = { ...functions[index], ...functionData };
    functions[index] = updatedFunction;
    this.saveFunctions(functions);
    
    console.log('Function updated successfully:', updatedFunction);
    return updatedFunction;
  }

  async deleteFunction(id: string): Promise<void> {
    console.log('Deleting function:', id);
    
    // Simuler un délai API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const functions = this.getFunctions();
    const index = functions.findIndex(func => func.id === id);
    
    if (index === -1) {
      throw new Error('Fonction introuvable');
    }
    
    functions.splice(index, 1);
    this.saveFunctions(functions);
    
    console.log('Function deleted successfully');
  }
}

export const functionsService = new FunctionsService();
export type { JobFunction };
