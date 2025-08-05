import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivitiesWidgetProps {
  config?: {
    maxItems?: number;
    showTimestamp?: boolean;
  };
}

export const ActivitiesWidget = ({ config = {} }: ActivitiesWidgetProps) => {
  const { user } = useAuth();
  const { maxItems = 5, showTimestamp = true } = config;

  const getActivities = () => {
    if (user?.role === 'admin' || user?.role === 'rh') {
      return [
        {
          id: 1,
          message: 'Jean Dupont a soumis une demande de congé',
          timestamp: 'Il y a 2 heures',
          type: 'success'
        },
        {
          id: 2,
          message: 'Bulletins de paie de mai générés',
          timestamp: 'Il y a 4 heures',
          type: 'info'
        },
        {
          id: 3,
          message: 'Marie Martin a mis à jour son profil',
          timestamp: 'Hier',
          type: 'warning'
        },
        {
          id: 4,
          message: 'Nouveau projet créé: Refonte RH',
          timestamp: 'Il y a 2 jours',
          type: 'info'
        },
        {
          id: 5,
          message: 'Formation sécurité complétée par 45 employés',
          timestamp: 'Il y a 3 jours',
          type: 'success'
        }
      ];
    } else {
      return [
        {
          id: 1,
          message: 'Votre demande de congé a été approuvée',
          timestamp: 'Il y a 1 heure',
          type: 'success'
        },
        {
          id: 2,
          message: 'Nouveau bulletin de paie disponible',
          timestamp: 'Il y a 2 jours',
          type: 'info'
        },
        {
          id: 3,
          message: 'Profil mis à jour avec succès',
          timestamp: 'Il y a 1 semaine',
          type: 'info'
        }
      ];
    }
  };

  const activities = getActivities().slice(0, maxItems);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'info':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-orange-500';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités récentes</CardTitle>
        <CardDescription>
          Dernières actions effectuées dans le système
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <div className={`w-2 h-2 rounded-full ${getTypeColor(activity.type)}`}></div>
              <div className="flex-1">
                <p className="text-sm">{activity.message}</p>
                {showTimestamp && (
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};