
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import MemorandumForm from '../components/memorandum/MemorandumForm';
import MemorandumList from '../components/memorandum/MemorandumList';
import { FileText, Clock, CheckCircle } from 'lucide-react';

const MemorandumPage = () => {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMemorandumCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const canValidateLevel = (level: 1 | 2 | 3) => {
    if (!user) return false;
    
    // Définir les rôles qui peuvent valider à chaque niveau
    const validationRoles = {
      1: ['rh', 'gestionnaire', 'admin'], // Superviseurs et plus
      2: ['gestionnaire', 'admin'], // Managers et plus
      3: ['admin'] // Directeurs seulement
    };

    return validationRoles[level].includes(user.role);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <FileText className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mémorandums</h1>
          <p className="text-gray-600">Gestion et validation des mémorandums</p>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="create">Créer</TabsTrigger>
          {canValidateLevel(1) && (
            <TabsTrigger value="level1">
              <Clock className="w-4 h-4 mr-1" />
              Visa DAF
            </TabsTrigger>
          )}
          {canValidateLevel(2) && (
            <TabsTrigger value="level2">
              <Clock className="w-4 h-4 mr-1" />
              Visa DT
            </TabsTrigger>
          )}
          {canValidateLevel(3) && (
            <TabsTrigger value="level3">
              <Clock className="w-4 h-4 mr-1" />
              Approbation DG
            </TabsTrigger>
          )}
          <TabsTrigger value="approved">
            <CheckCircle className="w-4 h-4 mr-1" />
            Approuvés
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tous les mémorandums</CardTitle>
            </CardHeader>
            <CardContent>
              <MemorandumList refreshTrigger={refreshTrigger} showEditDelete={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <MemorandumForm onSuccess={handleMemorandumCreated} />
        </TabsContent>

        {canValidateLevel(1) && (
          <TabsContent value="level1" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Visa DAF - En attente</CardTitle>
                <p className="text-sm text-gray-600">
                  Mémorandums en attente de visa par le Directeur Administratif et Financier
                </p>
              </CardHeader>
              <CardContent>
                <MemorandumList 
                  showValidationActions={true}
                  validationLevel={1}
                  refreshTrigger={refreshTrigger}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {canValidateLevel(2) && (
          <TabsContent value="level2" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Visa DT - En attente</CardTitle>
                <p className="text-sm text-gray-600">
                  Mémorandums en attente de visa par la Directrice Technique
                </p>
              </CardHeader>
              <CardContent>
                <MemorandumList 
                  showValidationActions={true}
                  validationLevel={2}
                  refreshTrigger={refreshTrigger}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {canValidateLevel(3) && (
          <TabsContent value="level3" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Approbation DG - En attente</CardTitle>
                <p className="text-sm text-gray-600">
                  Mémorandums en attente d'approbation par le Directeur Général
                </p>
              </CardHeader>
              <CardContent>
                <MemorandumList 
                  showValidationActions={true}
                  validationLevel={3}
                  refreshTrigger={refreshTrigger}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mémorandums approuvés</CardTitle>
            </CardHeader>
            <CardContent>
              <MemorandumList refreshTrigger={refreshTrigger} showEditDelete={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemorandumPage;
