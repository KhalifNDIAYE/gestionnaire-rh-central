import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, FileText, DollarSign, TrendingUp, Clock } from 'lucide-react';

interface StatsWidgetProps {
  config?: {
    showChange?: boolean;
    compactMode?: boolean;
  };
}

export const StatsWidget = ({ config = {} }: StatsWidgetProps) => {
  const { user } = useAuth();
  const { showChange = true, compactMode = false } = config;

  const getStats = () => {
    switch (user?.role) {
      case 'admin':
      case 'rh':
        return [
          { title: 'Employés actifs', value: '147', icon: Users, change: '+12%' },
          { title: 'Demandes en attente', value: '8', icon: Clock, change: '+3' },
          { title: 'Bulletins générés', value: '147', icon: FileText, change: '100%' },
          { title: 'Masse salariale', value: '680K€', icon: DollarSign, change: '+5.2%' },
        ];
      case 'gestionnaire':
        return [
          { title: 'Budget mensuel', value: '680K€', icon: DollarSign, change: '+5.2%' },
          { title: 'Bulletins traités', value: '147', icon: FileText, change: '100%' },
          { title: 'Économies réalisées', value: '12K€', icon: TrendingUp, change: '+8.4%' },
          { title: 'Analyses en cours', value: '4', icon: Clock, change: '2 terminées' },
        ];
      case 'agent':
        return [
          { title: 'Congés restants', value: '18', icon: Calendar, change: '25 jours/an' },
          { title: 'Demandes en cours', value: '1', icon: Clock, change: 'En attente' },
          { title: 'Bulletins disponibles', value: '5', icon: FileText, change: 'Derniers mois' },
          { title: 'Heures supplémentaires', value: '8h', icon: TrendingUp, change: 'Ce mois' },
        ];
      default:
        return [];
    }
  };

  const stats = getStats();

  if (compactMode) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {showChange && (
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};