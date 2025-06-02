
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import { Project } from '../../services/projectService';

interface ProjectListProps {
  projects: Project[];
  onViewProject: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onCreateProject: () => void;
}

const ProjectList = ({ 
  projects, 
  onViewProject, 
  onEditProject, 
  onDeleteProject, 
  onCreateProject 
}: ProjectListProps) => {
  const getStatusVariant = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'Planification';
      case 'active': return 'Actif';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const calculateProjectProgress = (project: Project) => {
    if (project.tasks.length === 0) return 0;
    const totalProgress = project.tasks.reduce((sum, task) => sum + task.progress, 0);
    return Math.round(totalProgress / project.tasks.length);
  };

  const getOverdueDeliverables = (project: Project) => {
    const today = new Date().toISOString().split('T')[0];
    return project.deliverables.filter(d => 
      d.dueDate < today && d.status !== 'completed'
    ).length;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Projets</CardTitle>
          <Button onClick={onCreateProject}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau projet
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Progression</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Coût actuel</TableHead>
              <TableHead>Livrables</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {project.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Progress value={calculateProjectProgress(project)} className="h-2" />
                    <span className="text-xs text-gray-500">
                      {calculateProjectProgress(project)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {project.budget.toLocaleString()} €
                </TableCell>
                <TableCell>
                  <div className={project.actualCost > project.budget ? 'text-red-600' : ''}>
                    {project.actualCost.toLocaleString()} €
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      {project.deliverables.length} total
                    </div>
                    {getOverdueDeliverables(project) > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {getOverdueDeliverables(project)} en retard
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{new Date(project.startDate).toLocaleDateString()}</div>
                    <div className="text-gray-500">
                      → {new Date(project.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewProject(project)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEditProject(project)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDeleteProject(project.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProjectList;
