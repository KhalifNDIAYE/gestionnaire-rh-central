
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { Search, Plus, Edit, Trash2, UserCheck, UserX, Briefcase } from 'lucide-react';
import EmployeeEditModal from '../components/employees/EmployeeEditModal';

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

const mockEmployees: Employee[] = [
  { id: '1', name: 'Jean Dupont', email: 'jean.dupont@company.com', fonction: 'Développeur Full Stack', department: 'IT', status: 'active', startDate: '2023-01-15', salary: 45000, type: 'employee' },
  { id: '2', name: 'Marie Martin', email: 'marie.martin@company.com', fonction: 'Analyste Financier', department: 'Finance', status: 'active', startDate: '2022-08-10', salary: 50000, type: 'employee' },
  { id: '3', name: 'Paul Bernard', email: 'paul.bernard@company.com', fonction: 'Chef de Département RH', department: 'HR', status: 'active', startDate: '2021-03-20', salary: 60000, type: 'employee' },
  { id: '4', name: 'Sophie Durand', email: 'sophie.durand@company.com', fonction: 'Chargée de Communication', department: 'Marketing', status: 'inactive', startDate: '2020-11-05', salary: 48000, type: 'employee' },
  { id: 'consultant-1', name: 'Marc Consultant', email: 'marc@consultingfirm.com', fonction: 'Consultant ERP', department: 'IT', status: 'active', startDate: '2024-01-15', salary: 0, type: 'consultant', endDate: '2024-06-30', hourlyRate: 120, company: 'TechConsult SARL' },
  { id: 'consultant-2', name: 'Julie Expert', email: 'julie@webagency.com', fonction: 'Consultant Web', department: 'Marketing', status: 'active', startDate: '2024-03-01', salary: 0, type: 'consultant', endDate: '2024-05-31', hourlyRate: 95, company: 'WebDesign Pro' },
];

const mockFonctions = [
  'Développeur Full Stack',
  'Développeur Frontend',
  'Développeur Backend',
  'Chef de Projet',
  'Analyste Financier',
  'Comptable',
  'Responsable RH',
  'Chef de Département RH',
  'Chargé de Recrutement',
  'Chargée de Communication',
  'Responsable Marketing',
  'Commercial',
  'Administrateur Système',
  'Consultant ERP',
  'Consultant Web',
  'Consultant Stratégique',
  'Expert Technique'
];

const EmployeesPage = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('employees');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const form = useForm();

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.fonction.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = activeTab === 'all' || 
      (activeTab === 'employees' && employee.type === 'employee') ||
      (activeTab === 'consultants' && employee.type === 'consultant');
    
    return matchesSearch && matchesType;
  });

  const onSubmit = (data: any) => {
    console.log('Nouvel employé/consultant:', data);
    setIsDialogOpen(false);
    form.reset();
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleEmployeeUpdated = () => {
    console.log('Employé mis à jour');
    // Ici on rechargerait les données
  };

  const canManageEmployees = user?.role === 'admin' || user?.role === 'rh';

  if (!canManageEmployees) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
            <CardDescription>
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des employés & consultants</h1>
          <p className="text-gray-600">Gérer les employés permanents et les consultants externes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une personne
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un employé ou consultant</DialogTitle>
              <DialogDescription>
                Remplissez les informations de la personne
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="employee">Employé permanent</SelectItem>
                          <SelectItem value="consultant">Consultant externe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input placeholder="Jean Dupont" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="jean.dupont@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fonction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fonction</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une fonction" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockFonctions.map((fonction) => (
                            <SelectItem key={fonction} value={fonction}>
                              {fonction}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Ajouter la personne
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="employees">Employés</TabsTrigger>
          <TabsTrigger value="consultants">Consultants</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <Input
                  placeholder="Rechercher une personne..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Fonction</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Détails</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell className="font-medium">{person.name}</TableCell>
                      <TableCell>{person.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {person.fonction}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={person.type === 'employee' ? 'default' : 'secondary'}>
                          {person.type === 'employee' ? (
                            <>
                              <UserCheck className="w-3 h-3 mr-1" />
                              Employé
                            </>
                          ) : (
                            <>
                              <Briefcase className="w-3 h-3 mr-1" />
                              Consultant
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{person.department}</TableCell>
                      <TableCell>
                        <Badge variant={person.status === 'active' ? 'default' : 'secondary'}>
                          {person.status === 'active' ? (
                            <>
                              <UserCheck className="w-3 h-3 mr-1" />
                              Actif
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3 mr-1" />
                              Inactif
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {person.type === 'employee' ? (
                          <span className="text-sm">{person.salary.toLocaleString()} €/an</span>
                        ) : (
                          <div className="text-sm">
                            <div>{person.hourlyRate}€/h</div>
                            {person.company && (
                              <div className="text-gray-500 text-xs">{person.company}</div>
                            )}
                            {person.endDate && (
                              <div className="text-gray-500 text-xs">
                                Fin: {new Date(person.endDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditEmployee(person)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {canManageEmployees && (
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
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
        </TabsContent>
      </Tabs>

      <EmployeeEditModal
        employee={selectedEmployee}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onEmployeeUpdated={handleEmployeeUpdated}
        mockFonctions={mockFonctions}
      />
    </div>
  );
};

export default EmployeesPage;
