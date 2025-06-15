
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { functionsService, JobFunction } from '../services/functionsService';
import { useToast } from '@/hooks/use-toast';
import FunctionsHeader from '../components/functions/FunctionsHeader';
import FunctionsTable from '../components/functions/FunctionsTable';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState<JobFunction | null>(null);

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
            <h1 className="text-xl font-semibold">Accès refusé</h1>
            <p className="text-gray-600">
              Seuls les administrateurs peuvent accéder à cette page.
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FunctionsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFunctionCreated={loadFunctions}
        availablePermissions={availablePermissions}
      />

      <Card>
        <CardHeader>
          {/* Search is now handled in FunctionsHeader */}
        </CardHeader>
        <CardContent>
          <FunctionsTable
            functions={filteredFunctions}
            loading={loading}
            availablePermissions={availablePermissions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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
