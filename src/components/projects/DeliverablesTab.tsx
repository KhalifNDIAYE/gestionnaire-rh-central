
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Calendar, CheckCircle, Clock, Plus } from 'lucide-react';
import { projectService, Project, Deliverable } from '../../services/projectService';

interface DeliverablesTabProps {
  projects: Project[];
  onRefresh: () => void;
}

const DeliverablesTab = ({ projects, onRefresh }: DeliverablesTabProps) => {
  const [overdueDeliverables, setOverdueDeliverables] = useState<{ project: Project; deliverable: Deliverable }[]>([]);
  const [upcomingDeliverables, setUpcomingDeliverables] = useState<{ project: Project; deliverable: Deliverable }[]>([]);

  useEffect(() => {
    loadDeliverables();
  }, [projects]);

  const loadDeliverables = async () => {
    try {
      const [overdue, upcoming] = await Promise.all([
        projectService.getOverdueDeliverables(),
        projectService.getUpcomingDeadlines(7)
      ]);
      
      setOverdueDeliverables(overdue);
      setUpcomingDeliverables(upcoming);
    } catch (error) {
      console.error('Erreur lors du chargement des livrables:', error);
    }
  };

  const getStatusVariant = (status: Deliverable['status']) => {
    switch (status) {
      case 'completed': return 'secondary';
      case 'in-progress': return 'default';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityVariant = (priority: Deliverable['priority']) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const updateDeliverableStatus = async (projectId: string, deliverableId: string, status: Deliverable['status']) => {
    try {
      await projectService.updateDeliverable(projectId, deliverableId, { status });
      onRefresh();
      loadDeliverables();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const allDeliverables = projects.flatMap(project => 
    project.deliverables.map(deliverable => ({ project, deliverable }))
  );

  return (
    <div className="space-y-6">
      {/* Alertes pour les livrables en retard */}
      {overdueDeliverables.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              Livrables en retard ({overdueDeliverables.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueDeliverables.map(({ project, deliverable }) => (
                <div key={`${project.id}-${deliverable.id}`} className="flex items-center justify-between p-3 bg-white rounded border border-red-200">
                  <div>
                    <div className="font-medium">{deliverable.name}</div>
                    <div className="text-sm text-gray-600">{project.name}</div>
                    <div className="text-sm text-red-600">
                      Échéance : {formatDate(deliverable.dueDate)} 
                      ({Math.abs(getDaysUntilDue(deliverable.dueDate))} jours de retard)
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getPriorityVariant(deliverable.priority)}>
                      {deliverable.priority}
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={() => updateDeliverableStatus(project.id, deliverable.id, 'completed')}
                    >
                      Marquer terminé
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertes pour les échéances proches */}
      {upcomingDeliverables.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-700">
              <Clock className="w-5 h-5 mr-2" />
              Échéances prochaines (7 jours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingDeliverables.map(({ project, deliverable }) => (
                <div key={`${project.id}-${deliverable.id}`} className="flex items-center justify-between p-3 bg-white rounded border border-yellow-200">
                  <div>
                    <div className="font-medium">{deliverable.name}</div>
                    <div className="text-sm text-gray-600">{project.name}</div>
                    <div className="text-sm text-yellow-600">
                      Échéance : {formatDate(deliverable.dueDate)} 
                      ({getDaysUntilDue(deliverable.dueDate)} jours restants)
                    </div>
                  </div>
                  <Badge variant={getPriorityVariant(deliverable.priority)}>
                    {deliverable.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tableau de tous les livrables */}
      <Card>
        <CardHeader>
          <CardTitle>Tous les livrables</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Livrable</TableHead>
                <TableHead>Projet</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allDeliverables.map(({ project, deliverable }) => (
                <TableRow key={`${project.id}-${deliverable.id}`}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{deliverable.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {deliverable.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(deliverable.dueDate)}
                      {deliverable.status !== 'completed' && (
                        <div className={`text-xs ${
                          getDaysUntilDue(deliverable.dueDate) < 0 ? 'text-red-500' :
                          getDaysUntilDue(deliverable.dueDate) <= 3 ? 'text-yellow-500' :
                          'text-gray-500'
                        }`}>
                          {getDaysUntilDue(deliverable.dueDate) < 0 
                            ? `${Math.abs(getDaysUntilDue(deliverable.dueDate))} jours de retard`
                            : `${getDaysUntilDue(deliverable.dueDate)} jours restants`
                          }
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(deliverable.status)}>
                      {deliverable.status === 'completed' ? 'Terminé' :
                       deliverable.status === 'in-progress' ? 'En cours' :
                       deliverable.status === 'overdue' ? 'En retard' : 'En attente'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityVariant(deliverable.priority)}>
                      {deliverable.priority === 'critical' ? 'Critique' :
                       deliverable.priority === 'high' ? 'Élevée' :
                       deliverable.priority === 'medium' ? 'Moyenne' : 'Faible'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {deliverable.status !== 'completed' && (
                      <div className="flex space-x-2">
                        {deliverable.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateDeliverableStatus(project.id, deliverable.id, 'in-progress')}
                          >
                            Démarrer
                          </Button>
                        )}
                        <Button 
                          size="sm"
                          onClick={() => updateDeliverableStatus(project.id, deliverable.id, 'completed')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Terminer
                        </Button>
                      </div>
                    )}
                    {deliverable.status === 'completed' && deliverable.completedDate && (
                      <div className="text-sm text-gray-500">
                        Terminé le {formatDate(deliverable.completedDate)}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliverablesTab;
