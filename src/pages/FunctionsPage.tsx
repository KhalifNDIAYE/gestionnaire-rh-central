
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
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Search, Plus, Edit, Trash2, Briefcase } from 'lucide-react';

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

const availablePermissions = [
  { id: 'dashboard', label: 'Tableau de bord' },
  { id: 'employees', label: 'Gestion des agents' },
  { id: 'leave-requests', label: 'Demandes de congés' },
  { id: 'payroll', label: 'Bulletins de salaire' },
  { id: 'salary', label: 'Calcul des salaires' },
  { id: 'memorandum', label: 'Mémorandums' },
  { id: 'profile', label: 'Mon profil' },
  { id: 'departments', label: 'Départements' },
  { id: 'time-tracking', label: 'Pointage' },
  { id: 'settings', label: 'Paramètres' },
  { id: 'functions', label: 'Gestion des fonctions' }
];

const FunctionsPage = () => {
  const { user } = useAuth();
  const [functions, setFunctions] = useState<JobFunction[]>(mockFunctions);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm();

  const filteredFunctions = functions.filter(func =>
    func.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    func.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    func.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: any) => {
    const newFunction: JobFunction = {
      id: Date.now().toString(),
      title: data.title,
      department: data.department,
      description: data.description,
      level: data.level,
      permissions: data.permissions || [],
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setFunctions([...functions, newFunction]);
    setIsDialogOpen(false);
    form.reset();
    console.log('Nouvelle fonction créée:', newFunction);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
            <CardDescription>
              Seuls les administrateurs peuvent accéder à cette page.
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
          <h1 className="text-3xl font-bold">Gestion des fonctions</h1>
          <p className="text-gray-600">Gérer les fonctions et leurs permissions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle fonction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle fonction</DialogTitle>
              <DialogDescription>
                Définissez les détails et permissions de la nouvelle fonction
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre de la fonction</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Développeur Senior" {...field} />
                        </FormControl>
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
                        <FormControl>
                          <Input placeholder="Ex: IT, RH, Finance..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un niveau" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="intermediate">Intermédiaire</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Décrivez les responsabilités de cette fonction..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Permissions</FormLabel>
                  <div className="grid grid-cols-2 gap-2 p-4 border rounded-md">
                    {availablePermissions.map((permission) => (
                      <FormField
                        key={permission.id}
                        control={form.control}
                        name="permissions"
                        render={({ field }) => {
                          const isChecked = field.value?.includes(permission.id);
                          return (
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={permission.id}
                                checked={isChecked}
                                onChange={(e) => {
                                  const currentPermissions = field.value || [];
                                  if (e.target.checked) {
                                    field.onChange([...currentPermissions, permission.id]);
                                  } else {
                                    field.onChange(currentPermissions.filter((p: string) => p !== permission.id));
                                  }
                                }}
                              />
                              <label htmlFor={permission.id} className="text-sm">
                                {permission.label}
                              </label>
                            </div>
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Créer la fonction
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Rechercher une fonction..."
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
                <TableHead>Fonction</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFunctions.map((func) => (
                <TableRow key={func.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{func.title}</div>
                      <div className="text-sm text-gray-500">{func.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{func.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {func.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {func.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {availablePermissions.find(p => p.id === permission)?.label}
                        </Badge>
                      ))}
                      {func.permissions.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{func.permissions.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={func.status === 'active' ? 'default' : 'secondary'}>
                      {func.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

export default FunctionsPage;
