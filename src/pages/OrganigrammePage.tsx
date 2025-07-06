
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UnitList from '../components/organigramme/UnitList';
import OrgChart from '../components/organigramme/OrgChart';
import UnitFormModal from '../components/organigramme/UnitFormModal';
import { organigrammeService, OrganizationalUnit } from '../services/organigrammeService';
import { toast } from '@/hooks/use-toast';

const OrganigrammePage = () => {
  const { user } = useAuth();
  const [units, setUnits] = useState<OrganizationalUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<OrganizationalUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<OrganizationalUnit | null>(null);

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      const data = await organigrammeService.getUnits();
      setUnits(data);
    } catch (error) {
      console.error('Erreur lors du chargement des unités:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les unités organisationnelles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUnit = () => {
    setEditingUnit(null);
    setShowFormModal(true);
  };

  const handleEditUnit = (unit: OrganizationalUnit) => {
    setEditingUnit(unit);
    setShowFormModal(true);
  };

  const handleViewUnit = (unit: OrganizationalUnit) => {
    setSelectedUnit(unit);
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette unité ?')) {
      try {
        await organigrammeService.deleteUnit(unitId);
        await loadUnits();
        toast({
          title: "Succès",
          description: "Unité supprimée avec succès",
        });
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        toast({
          title: "Erreur",
          description: error.message || "Impossible de supprimer l'unité",
          variant: "destructive",
        });
      }
    }
  };

  const handleUnitSaved = () => {
    loadUnits();
    toast({
      title: "Succès",
      description: editingUnit ? "Unité modifiée avec succès" : "Unité créée avec succès",
    });
  };

  const canManageOrganization = user?.role === 'admin' || user?.role === 'rh';

  if (!canManageOrganization) {
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
        <div>Chargement...</div>
      </div>
    );
  }

  const getUnitsByType = (type: OrganizationalUnit['type']) => {
    return units.filter(unit => unit.type === type);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Organigramme</h1>
        <p className="text-gray-600">Gestion de la structure organisationnelle</p>
      </div>

      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chart">Organigramme</TabsTrigger>
          <TabsTrigger value="list">Liste des unités</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Structure Organisationnelle</CardTitle>
              <CardDescription>
                Visualisation hiérarchique de l'organisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrgChart 
                units={units} 
                onUnitClick={handleViewUnit}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <UnitList
            units={units}
            onViewUnit={handleViewUnit}
            onEditUnit={handleEditUnit}
            onDeleteUnit={handleDeleteUnit}
            onCreateUnit={handleCreateUnit}
          />
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Directions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getUnitsByType('direction').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Unités</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getUnitsByType('unite').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cellules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getUnitsByType('cellule').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getUnitsByType('service').length}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm">Total Employés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {units.reduce((total, unit) => total + (unit.employees?.length || 0), 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm">Unités sans responsable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {units.filter(unit => !unit.manager_name).length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <UnitFormModal 
        open={showFormModal}
        onOpenChange={setShowFormModal}
        unit={editingUnit}
        parentUnits={units}
        onUnitSaved={handleUnitSaved}
      />
    </div>
  );
};

export default OrganigrammePage;
