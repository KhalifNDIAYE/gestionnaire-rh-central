
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Users, TrendingUp } from 'lucide-react';
import SalaryCalculator from '../components/salary/SalaryCalculator';
import BulkSalaryCalculation from '../components/salary/BulkSalaryCalculation';

const SalaryCalculationPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('individual');

  const canAccessModule = user?.role === 'admin' || user?.role === 'gestionnaire' || user?.role === 'rh';

  if (!canAccessModule) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <CardTitle>Accès Restreint</CardTitle>
            <CardDescription>
              Vous n'avez pas les permissions nécessaires pour accéder au module de calcul des salaires.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calcul des Salaires</h1>
          <p className="text-gray-600">
            Module de calcul et simulation des salaires
          </p>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employés actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Dans le système
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Masse salariale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~15.5K€</div>
            <p className="text-xs text-muted-foreground">
              Estimation mensuelle
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux horaire moyen</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">31.7€</div>
            <p className="text-xs text-muted-foreground">
              Tous employés confondus
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Calcul Individuel
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Calcul en Masse
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-6">
          <SalaryCalculator />
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <BulkSalaryCalculation />
        </TabsContent>
      </Tabs>

      {/* Informations utiles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations sur les Calculs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Cotisations Sociales</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Taux appliqué: 23% du salaire brut</li>
                <li>• Incluent CSG, CRDS, retraite, chômage</li>
                <li>• Calculées automatiquement</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Heures Supplémentaires</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Majoration de 25% du taux horaire</li>
                <li>• Applicable au-delà de 35h/semaine</li>
                <li>• Limitées à 220h/an par employé</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalaryCalculationPage;
