import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NotificationCenter from '../notifications/NotificationCenter';
import AnnouncementCarousel from '../communication/AnnouncementCarousel';
import { Users, Calendar, FileText, DollarSign, TrendingUp, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

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

  return (
    <div className="space-y-6">
      {/* Carrousel d'annonces dynamiques */}
      <AnnouncementCarousel />

      {/* Statistiques */}
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
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contenu principal avec notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activités récentes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
              <CardDescription>
                Dernières actions effectuées dans le système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user?.role === 'admin' || user?.role === 'rh' ? (
                  <>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Jean Dupont a soumis une demande de congé</p>
                        <p className="text-xs text-gray-500">Il y a 2 heures</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Bulletins de paie de mai générés</p>
                        <p className="text-xs text-gray-500">Il y a 4 heures</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Marie Martin a mis à jour son profil</p>
                        <p className="text-xs text-gray-500">Hier</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Votre demande de congé a été approuvée</p>
                        <p className="text-xs text-gray-500">Il y a 1 heure</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Nouveau bulletin de paie disponible</p>
                        <p className="text-xs text-gray-500">Il y a 2 jours</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Profil mis à jour avec succès</p>
                        <p className="text-xs text-gray-500">Il y a 1 semaine</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Centre de notifications */}
        <div>
          <NotificationCenter />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
