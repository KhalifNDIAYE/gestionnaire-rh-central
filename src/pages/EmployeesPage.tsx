
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Edit, Trash2, UserCheck, UserX, Briefcase, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmployeeEditModal from '../components/employees/EmployeeEditModal';
import EmployeeFormModal from '../components/employees/EmployeeFormModal';
import { employeeService, Employee, EmployeeWithUnit } from '../services/employeeService';
import { functionsService } from '../services/functionsService';
import { organigrammeService, OrganizationalUnit } from '../services/organigrammeService';

const EmployeesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<EmployeeWithUnit[]>([]);
  const [organizationalUnits, setOrganizationalUnits] = useState<OrganizationalUnit[]>([]);
  const [jobFunctions, setJobFunctions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('employees');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Charger les employés, les unités organisationnelles et les fonctions au montage du composant
  useEffect(() => {
    loadEmployees();
    loadOrganizationalUnits();
    loadJobFunctions();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployeesWithUnits();
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

  const loadOrganizationalUnits = async () => {
    try {
      const units = await organigrammeService.getUnits();
      setOrganizationalUnits(units);
    } catch (error) {
      console.error('Erreur lors du chargement des unités organisationnelles:', error);
    }
  };

  const loadJobFunctions = async () => {
    try {
      const functions = await functionsService.getAllFunctions();
      setJobFunctions(functions.map(func => func.title));
    } catch (error) {
      console.error('Erreur lors du chargement des fonctions:', error);
      // Use fallback functions if loading fails
      setJobFunctions([
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
      ]);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.fonction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.organizational_unit?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = activeTab === 'all' || 
      (activeTab === 'employees' && employee.type === 'employee') ||
      (activeTab === 'consultants' && employee.type === 'consultant');
    
    return matchesSearch && matchesType;
  });

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleEmployeeUpdated = () => {
    loadEmployees(); // Recharger la liste après modification
    toast({
      title: "Succès",
      description: "Agent modifié avec succès",
    });
  };

  const handleEmployeeCreated = () => {
    loadEmployees(); // Recharger la liste après création
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    try {
      await employeeService.deleteEmployee(employee.id);
      toast({
        title: "Succès",
        description: "Agent supprimé avec succès",
      });
      loadEmployees(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'agent",
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
        <Button onClick={() => setIsFormModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une personne
        </Button>
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
                    <TableHead>Unité Organisationnelle</TableHead>
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
                        {person.organizational_unit ? (
                          <Badge variant="outline" className="text-xs">
                            <Building className="w-3 h-3 mr-1" />
                            {person.organizational_unit.name}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-xs">Non assigné</span>
                        )}
                      </TableCell>
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
                          <span className="text-sm">{Number(person.salary || 0).toLocaleString()} €/an</span>
                        ) : (
                          <div className="text-sm">
                            <div>{person.hourly_rate || 0}€/h</div>
                            {person.company && (
                              <div className="text-gray-500 text-xs">{person.company}</div>
                            )}
                            {person.end_date && (
                              <div className="text-gray-500 text-xs">
                                Fin: {new Date(person.end_date).toLocaleDateString()}
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

      <EmployeeFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        onEmployeeCreated={handleEmployeeCreated}
        organizationalUnits={organizationalUnits}
        jobFunctions={jobFunctions}
      />

      <EmployeeEditModal
        employee={selectedEmployee}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onEmployeeUpdated={handleEmployeeUpdated}
      />
    </div>
  );
};

export default EmployeesPage;
