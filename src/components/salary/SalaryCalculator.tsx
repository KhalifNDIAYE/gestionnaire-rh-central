
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, User, Clock, DollarSign } from 'lucide-react';
import { SalaryCalculationService, mockEmployees, type SalaryCalculation, type Employee } from '../../services/salaryCalculationService';

const SalaryCalculator = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [workingHours, setWorkingHours] = useState<number>(152);
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [bonuses, setBonuses] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [calculation, setCalculation] = useState<SalaryCalculation | null>(null);

  const handleCalculate = () => {
    if (!selectedEmployee) return;

    const result = SalaryCalculationService.calculateSalary(
      selectedEmployee,
      workingHours,
      overtimeHours,
      bonuses,
      deductions
    );
    setCalculation(result);
  };

  const handleEmployeeSelect = (employeeId: string) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    setSelectedEmployee(employee || null);
    setCalculation(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Formulaire de calcul */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Calculateur de Salaire
          </CardTitle>
          <CardDescription>
            Calculez le salaire d'un employé pour un mois donné
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employé</Label>
            <Select onValueChange={handleEmployeeSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                {mockEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} - {employee.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEmployee && (
            <>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{selectedEmployee.name}</span>
                  <Badge variant="outline" className="capitalize">
                    {selectedEmployee.salaryType}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedEmployee.position} - {selectedEmployee.department}
                </p>
                <p className="text-sm text-gray-600">
                  Taux horaire: {selectedEmployee.hourlyRate}€/h
                </p>
                {selectedEmployee.salaryType !== 'hourly' && (
                  <p className="text-sm text-gray-600">
                    Salaire de base: {selectedEmployee.baseSalary.toLocaleString()}€
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workingHours">Heures travaillées</Label>
                  <Input
                    id="workingHours"
                    type="number"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(Number(e.target.value))}
                    min="0"
                    max="200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overtimeHours">Heures supplémentaires</Label>
                  <Input
                    id="overtimeHours"
                    type="number"
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(Number(e.target.value))}
                    min="0"
                    max="50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bonuses">Primes (€)</Label>
                  <Input
                    id="bonuses"
                    type="number"
                    value={bonuses}
                    onChange={(e) => setBonuses(Number(e.target.value))}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deductions">Déductions (€)</Label>
                  <Input
                    id="deductions"
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(Number(e.target.value))}
                    min="0"
                  />
                </div>
              </div>

              <Button onClick={handleCalculate} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Calculer le salaire
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Résultats */}
      {calculation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Résultat du Calcul
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Heures normales:</span>
                  <span>{calculation.workingHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Heures sup:</span>
                  <span>{calculation.overtimeHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taux horaire:</span>
                  <span>{calculation.hourlyRate}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taux sup:</span>
                  <span>{calculation.overtimeRate.toFixed(2)}€</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Primes:</span>
                  <span className="text-green-600">+{calculation.bonuses}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Déductions:</span>
                  <span className="text-red-600">-{calculation.deductions}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cotisations:</span>
                  <span className="text-red-600">-{calculation.socialContributions.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Impôts:</span>
                  <span className="text-red-600">-{calculation.taxes.toFixed(2)}€</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-lg font-medium">
                <span>Salaire brut:</span>
                <span>{calculation.grossSalary.toLocaleString()}€</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-green-600">
                <span>Salaire net:</span>
                <span>{calculation.netSalary.toLocaleString()}€</span>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 Ce calcul est une simulation basée sur des taux moyens. 
                Les cotisations et impôts réels peuvent varier.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalaryCalculator;
