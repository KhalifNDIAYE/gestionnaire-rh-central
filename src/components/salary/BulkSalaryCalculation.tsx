
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Download, Eye, Users } from 'lucide-react';
import { SalaryCalculationService, type SalaryCalculation } from '../../services/salaryCalculationService';
import { useToast } from '@/hooks/use-toast';

const BulkSalaryCalculation = () => {
  const [selectedMonth, setSelectedMonth] = useState('05');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [calculations, setCalculations] = useState<SalaryCalculation[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const months = [
    { value: '01', label: 'Janvier' },
    { value: '02', label: 'Février' },
    { value: '03', label: 'Mars' },
    { value: '04', label: 'Avril' },
    { value: '05', label: 'Mai' },
    { value: '06', label: 'Juin' },
    { value: '07', label: 'Juillet' },
    { value: '08', label: 'Août' },
    { value: '09', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' },
  ];

  const handleBulkCalculation = async () => {
    setIsCalculating(true);
    
    // Simulation d'un délai de calcul
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const results = SalaryCalculationService.generateBulkCalculations(selectedMonth, selectedYear);
    setCalculations(results);
    setIsCalculating(false);
    
    toast({
      title: "Calculs terminés",
      description: `${results.length} salaires calculés pour ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`,
    });
  };

  const totalGross = calculations.reduce((sum, calc) => sum + calc.grossSalary, 0);
  const totalNet = calculations.reduce((sum, calc) => sum + calc.netSalary, 0);
  const totalContributions = calculations.reduce((sum, calc) => sum + calc.socialContributions, 0);

  const getEmployeeName = (employeeId: string) => {
    const employees = {
      '1': 'Jean Dupont',
      '2': 'Marie Martin',
      '3': 'Paul Bernard'
    };
    return employees[employeeId as keyof typeof employees] || 'Inconnu';
  };

  return (
    <div className="space-y-6">
      {/* Contrôles de calcul */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Calcul des Salaires en Masse
          </CardTitle>
          <CardDescription>
            Calculez les salaires de tous les employés pour une période donnée
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mois</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Année</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleBulkCalculation} 
              disabled={isCalculating}
              className="mt-6"
            >
              <Calculator className="w-4 h-4 mr-2" />
              {isCalculating ? 'Calcul en cours...' : 'Calculer tous les salaires'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résumé */}
      {calculations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salaire brut total</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGross.toLocaleString()}€</div>
              <p className="text-xs text-muted-foreground">
                {calculations.length} employé(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salaire net total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalNet.toLocaleString()}€</div>
              <p className="text-xs text-muted-foreground">
                Après cotisations et impôts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cotisations totales</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{totalContributions.toLocaleString()}€</div>
              <p className="text-xs text-muted-foreground">
                Charges sociales
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tableau des résultats */}
      {calculations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Détail des Calculs</CardTitle>
            <CardDescription>
              Résultats pour {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Heures</TableHead>
                  <TableHead>Heures sup.</TableHead>
                  <TableHead>Salaire brut</TableHead>
                  <TableHead>Cotisations</TableHead>
                  <TableHead>Salaire net</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculations.map((calc) => (
                  <TableRow key={calc.employeeId}>
                    <TableCell className="font-medium">
                      {getEmployeeName(calc.employeeId)}
                    </TableCell>
                    <TableCell>{calc.workingHours}h</TableCell>
                    <TableCell>
                      {calc.overtimeHours > 0 ? (
                        <Badge variant="secondary">{calc.overtimeHours}h</Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{calc.grossSalary.toLocaleString()}€</TableCell>
                    <TableCell className="text-red-600">
                      -{calc.socialContributions.toFixed(0)}€
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
                      {calc.netSalary.toLocaleString()}€
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkSalaryCalculation;
