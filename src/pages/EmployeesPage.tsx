
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { Search, Plus, Edit, Trash2, UserCheck, UserX, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmployeeEditModal from '../components/employees/EmployeeEditModal';
import { employeeService, Employee } from '../services/employeeService';

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
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('employees');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const form = useForm();

  // Charger les employés au montage du composant
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les employés",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const onSubmit = async (data: any) => {
    try {
      await employeeService.createEmployee(data);
      toast({
        title: "Succès",
        description: "Employé ajouté avec succès",
      });
      setIsDialogOpen(false);
      form.reset();
      loadEmployees(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'employé",
        variant: "destructive",
      });
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleEmployeeUpdated = () => {
    loadEmployees(); // Recharger la liste après modification
    toast({
      title: "Succès",
      description: "Employé modifié avec succès",
    });
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    try {
      await employeeService.deleteEmployee(employee.id);
      toast({
        title: "Succès",
        description: "Employé supprimé avec succès",
      });
      loadEmployees(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'employé",
        variant: "destructive",
      });
    }
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

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Chargement des employés...</p>
            </div>
          </CardContent>
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
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Département</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un département" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="HR">RH</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Operations">Opérations</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue="active">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le statut" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Actif</SelectItem>
                          <SelectItem value="inactive">Inactif</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de début</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
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
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer <strong>{person.name}</strong> ? 
                                    Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteEmployee(person)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
