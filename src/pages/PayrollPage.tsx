
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Eye, FileText, Calculator } from 'lucide-react';

interface PaySlip {
  id: string;
  employeeName: string;
  period: string;
  grossSalary: number;
  netSalary: number;
  deductions: number;
  status: 'generated' | 'sent' | 'downloaded';
}

const mockPaySlips: PaySlip[] = [
  {
    id: '1',
    employeeName: 'Jean Dupont',
    period: '2024-05',
    grossSalary: 4500,
    netSalary: 3420,
    deductions: 1080,
    status: 'generated'
  },
  {
    id: '2',
    employeeName: 'Marie Martin',
    period: '2024-05',
    grossSalary: 5000,
    netSalary: 3800,
    deductions: 1200,
    status: 'sent'
  },
  {
    id: '3',
    employeeName: 'Paul Bernard',
    period: '2024-05',
    grossSalary: 6000,
    netSalary: 4560,
    deductions: 1440,
    status: 'downloaded'
  },
];

const PayrollPage = () => {
  const { user } = useAuth();
  const [paySlips, setPaySlips] = useState<PaySlip[]>(mockPaySlips);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-05');

  const isManager = user?.role === 'admin' || user?.role === 'gestionnaire';
  const canViewAll = user?.role === 'admin' || user?.role === 'rh' || user?.role === 'gestionnaire';

  const filteredPaySlips = canViewAll 
    ? paySlips.filter(slip => slip.period === selectedPeriod)
    : paySlips.filter(slip => slip.employeeName === user?.name);

  const generatePaySlip = (employeeName: string) => {
    console.log(`Génération du bulletin pour ${employeeName}`);
    // Ici, vous pourriez intégrer un vrai système de génération de PDF
  };

  const downloadPaySlip = (id: string) => {
    console.log(`Téléchargement du bulletin ${id}`);
    setPaySlips(paySlips.map(slip => 
      slip.id === id ? { ...slip, status: 'downloaded' } : slip
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'generated':
        return <Badge variant="secondary">Généré</Badge>;
      case 'sent':
        return <Badge variant="default">Envoyé</Badge>;
      case 'downloaded':
        return <Badge variant="outline">Téléchargé</Badge>;
      default:
        return null;
    }
  };

  const totalGross = filteredPaySlips.reduce((sum, slip) => sum + slip.grossSalary, 0);
  const totalNet = filteredPaySlips.reduce((sum, slip) => sum + slip.netSalary, 0);
  const totalDeductions = filteredPaySlips.reduce((sum, slip) => sum + slip.deductions, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bulletins de salaire</h1>
          <p className="text-gray-600">
            {canViewAll ? 'Gestion des bulletins de paie' : 'Mes bulletins de salaire'}
          </p>
        </div>
        {canViewAll && (
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-05">Mai 2024</SelectItem>
                <SelectItem value="2024-04">Avril 2024</SelectItem>
                <SelectItem value="2024-03">Mars 2024</SelectItem>
              </SelectContent>
            </Select>
            {isManager && (
              <Button>
                <Calculator className="w-4 h-4 mr-2" />
                Calculer les salaires
              </Button>
            )}
          </div>
        )}
      </div>

      {canViewAll && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salaire brut total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGross.toLocaleString()} €</div>
              <p className="text-xs text-muted-foreground">
                Pour {filteredPaySlips.length} employé(s)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salaire net total</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalNet.toLocaleString()} €</div>
              <p className="text-xs text-muted-foreground">
                Après déductions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Déductions totales</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDeductions.toLocaleString()} €</div>
              <p className="text-xs text-muted-foreground">
                Charges sociales
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Liste des bulletins</CardTitle>
          <CardDescription>
            {filteredPaySlips.length} bulletin(s) pour la période sélectionnée
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {canViewAll && <TableHead>Employé</TableHead>}
                <TableHead>Période</TableHead>
                <TableHead>Salaire brut</TableHead>
                <TableHead>Déductions</TableHead>
                <TableHead>Salaire net</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPaySlips.map((slip) => (
                <TableRow key={slip.id}>
                  {canViewAll && <TableCell className="font-medium">{slip.employeeName}</TableCell>}
                  <TableCell>{slip.period}</TableCell>
                  <TableCell>{slip.grossSalary.toLocaleString()} €</TableCell>
                  <TableCell>{slip.deductions.toLocaleString()} €</TableCell>
                  <TableCell className="font-medium">{slip.netSalary.toLocaleString()} €</TableCell>
                  <TableCell>{getStatusBadge(slip.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => downloadPaySlip(slip.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      {isManager && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => generatePaySlip(slip.employeeName)}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollPage;
