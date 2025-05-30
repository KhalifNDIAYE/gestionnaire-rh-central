
export interface SalaryCalculation {
  employeeId: string;
  baseSalary: number;
  workingHours: number;
  overtimeHours: number;
  hourlyRate: number;
  overtimeRate: number;
  grossSalary: number;
  socialContributions: number;
  taxes: number;
  netSalary: number;
  bonuses: number;
  deductions: number;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  hourlyRate: number;
  salaryType: 'hourly' | 'monthly' | 'annual';
  baseSalary: number;
}

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    position: 'Développeur',
    department: 'IT',
    hourlyRate: 25,
    salaryType: 'hourly',
    baseSalary: 4000
  },
  {
    id: '2',
    name: 'Marie Martin',
    position: 'Manager RH',
    department: 'RH',
    hourlyRate: 30,
    salaryType: 'monthly',
    baseSalary: 5000
  },
  {
    id: '3',
    name: 'Paul Bernard',
    position: 'Directeur',
    department: 'Direction',
    hourlyRate: 40,
    salaryType: 'annual',
    baseSalary: 72000
  },
];

export class SalaryCalculationService {
  static calculateSalary(
    employee: Employee,
    workingHours: number = 152, // 35h/semaine * 4.34 semaines
    overtimeHours: number = 0,
    bonuses: number = 0,
    deductions: number = 0
  ): SalaryCalculation {
    let grossSalary = 0;
    const overtimeRate = employee.hourlyRate * 1.25; // 25% de majoration

    // Calcul selon le type de salaire
    switch (employee.salaryType) {
      case 'hourly':
        grossSalary = (workingHours * employee.hourlyRate) + (overtimeHours * overtimeRate);
        break;
      case 'monthly':
        grossSalary = employee.baseSalary + (overtimeHours * overtimeRate);
        break;
      case 'annual':
        grossSalary = (employee.baseSalary / 12) + (overtimeHours * overtimeRate);
        break;
    }

    // Ajouter les primes
    grossSalary += bonuses;

    // Calcul des cotisations sociales (environ 23% du brut)
    const socialContributions = grossSalary * 0.23;

    // Calcul de l'impôt (simulation simple)
    const taxableIncome = grossSalary - socialContributions;
    let taxes = 0;
    if (taxableIncome > 3000) {
      taxes = (taxableIncome - 3000) * 0.11;
    }
    if (taxableIncome > 4000) {
      taxes += (taxableIncome - 4000) * 0.19;
    }

    // Salaire net
    const netSalary = grossSalary - socialContributions - taxes - deductions;

    return {
      employeeId: employee.id,
      baseSalary: employee.baseSalary,
      workingHours,
      overtimeHours,
      hourlyRate: employee.hourlyRate,
      overtimeRate,
      grossSalary,
      socialContributions,
      taxes,
      netSalary,
      bonuses,
      deductions
    };
  }

  static generateBulkCalculations(month: string, year: string): SalaryCalculation[] {
    return mockEmployees.map(employee => {
      // Simulation de données variables par employé
      const workingHours = 152 + Math.floor(Math.random() * 20) - 10; // 142-162h
      const overtimeHours = Math.floor(Math.random() * 15); // 0-15h
      const bonuses = Math.floor(Math.random() * 500); // 0-500€
      const deductions = Math.floor(Math.random() * 100); // 0-100€

      return this.calculateSalary(employee, workingHours, overtimeHours, bonuses, deductions);
    });
  }
}
