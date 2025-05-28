
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const getStatsForRole = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { title: 'Total Employés', value: '156', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Demandes en attente', value: '12', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          { title: 'Masse salariale', value: '€284,500', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'Congés ce mois', value: '34', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
        ];
      case 'rh':
        return [
          { title: 'Employés actifs', value: '156', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Nouvelles demandes', value: '8', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { title: 'Congés approuvés', value: '15', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'Recrutements', value: '3', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        ];
      case 'gestionnaire':
        return [
          { title: 'Bulletins générés', value: '143', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'En attente validation', value: '5', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          { title: 'Budget mensuel', value: '€284,500', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'Écart budget', value: '+2.3%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        ];
      case 'agent':
        return [
          { title: 'Congés restants', value: '18 jours', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Demandes en cours', value: '1', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          { title: 'Dernier bulletin', value: 'Mars 2024', icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'Heures ce mois', value: '142h', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  const getRecentActivities = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { type: 'success', message: 'Nouveau employé ajouté: Thomas Dubois', time: 'Il y a 2h' },
          { type: 'warning', message: '3 demandes de congés en attente de validation', time: 'Il y a 4h' },
          { type: 'info', message: 'Bulletin de paie généré pour Mars 2024', time: 'Il y a 1j' },
        ];
      case 'agent':
        return [
          { type: 'success', message: 'Votre demande de congé a été approuvée', time: 'Il y a 2h' },
          { type: 'info', message: 'Nouveau bulletin de paie disponible', time: 'Il y a 3j' },
          { type: 'info', message: 'Mise à jour du profil effectuée', time: 'Il y a 1 semaine' },
        ];
      default:
        return [
          { type: 'info', message: 'Tableau de bord mis à jour', time: 'Il y a 1h' },
          { type: 'success', message: 'Données synchronisées', time: 'Il y a 3h' },
        ];
    }
  };

  const activities = getRecentActivities();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Bonjour {user?.name} !
        </h2>
        <p className="text-blue-100">
          {user?.role === 'admin' && "Vous avez un accès administrateur complet au système."}
          {user?.role === 'rh' && "Gérez les ressources humaines de votre entreprise."}
          {user?.role === 'gestionnaire' && "Supervisez les aspects financiers et les salaires."}
          {user?.role === 'agent' && "Accédez à vos informations personnelles et demandes."}
        </p>
        <div className="mt-4">
          <Badge variant="secondary" className="bg-blue-500 text-white">
            Profil: {user?.role?.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Activités récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {user?.role === 'admin' && (
                <>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                    <Users className="w-6 h-6 mb-2" />
                    <span className="text-sm">Ajouter un employé</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                    <FileText className="w-6 h-6 mb-2" />
                    <span className="text-sm">Générer bulletins</span>
                  </Button>
                </>
              )}
              {user?.role === 'agent' && (
                <>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                    <Calendar className="w-6 h-6 mb-2" />
                    <span className="text-sm">Demander congé</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                    <FileText className="w-6 h-6 mb-2" />
                    <span className="text-sm">Mes bulletins</span>
                  </Button>
                </>
              )}
              {(user?.role === 'rh' || user?.role === 'gestionnaire') && (
                <>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                    <Calendar className="w-6 h-6 mb-2" />
                    <span className="text-sm">Valider congés</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                    <DollarSign className="w-6 h-6 mb-2" />
                    <span className="text-sm">Calcul salaires</span>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
