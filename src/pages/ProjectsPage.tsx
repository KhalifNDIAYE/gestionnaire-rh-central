
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectList from '../components/projects/ProjectList';
import GanttChart from '../components/projects/GanttChart';
import { projectService, Project } from '../services/projectService';

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProject(data[0]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleEditProject = (project: Project) => {
    console.log('Modifier le projet:', project);
    // TODO: Ouvrir un modal d'édition
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await projectService.deleteProject(projectId);
        await loadProjects();
        if (selectedProject?.id === projectId) {
          setSelectedProject(projects[0] || null);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleCreateProject = () => {
    console.log('Créer un nouveau projet');
    // TODO: Ouvrir un modal de création
  };

  const canManageProjects = user?.role === 'admin' || user?.role === 'gestionnaire';

  if (!canManageProjects) {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion des Projets</h1>
        <p className="text-gray-600">Gérer les projets et leur progression</p>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Liste des projets</TabsTrigger>
          <TabsTrigger value="gantt">Diagramme de Gantt</TabsTrigger>
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <ProjectList
            projects={projects}
            onViewProject={handleViewProject}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            onCreateProject={handleCreateProject}
          />
        </TabsContent>

        <TabsContent value="gantt">
          {selectedProject ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Projet: {selectedProject.name}</CardTitle>
                  <CardDescription>{selectedProject.description}</CardDescription>
                </CardHeader>
              </Card>
              <GanttChart
                tasks={selectedProject.tasks}
                startDate={selectedProject.startDate}
                endDate={selectedProject.endDate}
              />
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p>Sélectionnez un projet pour voir le diagramme de Gantt</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Projets Actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'active').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Projets Terminés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'completed').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Budget Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()} €
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Coûts Actuels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.reduce((sum, p) => sum + p.actualCost, 0).toLocaleString()} €
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectsPage;
