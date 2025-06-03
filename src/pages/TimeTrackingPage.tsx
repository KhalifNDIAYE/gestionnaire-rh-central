
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TimeTrackingPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Système de Pointage</h1>
        <p className="text-gray-500">Gestion des heures de travail</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module en développement</CardTitle>
          <CardDescription>
            Le module de pointage est en cours de développement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <p className="text-gray-500">Cette fonctionnalité sera bientôt disponible.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeTrackingPage;
