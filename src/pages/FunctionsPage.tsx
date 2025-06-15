
import { useState, useEffect } from 'react';
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
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { functionsService, JobFunction } from '../services/functionsService';
import FunctionEditModal from '../components/functions/FunctionEditModal';
import FunctionDeleteDialog from '../components/functions/FunctionDeleteDialog';

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
  const { toast } = useToast();
  const [functions, setFunctions] = useState<JobFunction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState<JobFunction | null>(null);
  const form = useForm();

  const loadFunctions = async () => {
    try {
      setLoading(true);
      const data = await functionsService.getAllFunctions();
      setFunctions(data);
    } catch (error) {
      console.error('Erreur lors du chargement des fonctions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les fonctions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFunctions();
  }, []);

  const filteredFunctions = functions.filter(func =>
    func.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    func.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    func.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data: any) => {
    try {
      const newFunction = {
        title: data.title,
        department: data.department,
        description: data.description,
        level: data.level,
        permissions: data.permissions || [],
        status: 'active' as const,
        createdAt: new Date().toISOString().split('T')[0]
      };

      await functionsService.createFunction(newFunction);
      toast({
        title: "Succès",
        description: "Fonction créée avec succès",
      });
      setIsCreateDialogOpen(false);
      form.reset();
      loadFunctions();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la fonction",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (jobFunction: JobFunction) => {
    setSelectedFunction(jobFunction);
    setIsEditModalOpen(true);
  };

  const handleDelete = (jobFunction: JobFunction) => {
    setSelectedFunction(jobFunction);
    setIsDeleteDialogOpen(true);
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
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
          {loading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : (
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
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(func)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(func)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <FunctionEditModal
        jobFunction={selectedFunction}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onFunctionUpdated={loadFunctions}
        availablePermissions={availablePermissions}
      />

      <FunctionDeleteDialog
        jobFunction={selectedFunction}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onFunctionDeleted={loadFunctions}
      />
    </div>
  );
};

export default FunctionsPage;
