import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Book, 
  Code, 
  Users, 
  Zap, 
  ExternalLink, 
  Download,
  FileText,
  GitBranch,
  Shield,
  Settings
} from 'lucide-react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const DocumentationPage = () => {
  const [activeGuide, setActiveGuide] = useState<string | null>(null);

  const guides = [
    {
      id: 'getting-started',
      title: 'Guide de démarrage',
      description: 'Premiers pas avec l\'application RH',
      steps: [
        'Connexion à votre compte',
        'Configuration de votre profil',
        'Navigation dans l\'interface',
        'Paramétrage initial'
      ]
    },
    {
      id: 'employee-management',
      title: 'Gestion des employés',
      description: 'Comment gérer les employés et leurs informations',
      steps: [
        'Ajouter un nouvel employé',
        'Modifier les informations',
        'Gérer les départements',
        'Configuration des rôles'
      ]
    },
    {
      id: 'time-tracking',
      title: 'Suivi du temps',
      description: 'Pointage et gestion du temps de travail',
      steps: [
        'Pointer l\'arrivée et le départ',
        'Enregistrer les heures sur projets',
        'Valider les feuilles de temps',
        'Générer des rapports'
      ]
    },
    {
      id: 'leave-management',
      title: 'Gestion des congés',
      description: 'Demandes et approbation des congés',
      steps: [
        'Soumettre une demande de congé',
        'Approuver/refuser les demandes',
        'Consulter le planning',
        'Gérer les soldes de congés'
      ]
    }
  ];

  const technicalDocs = [
    {
      title: 'Architecture du système',
      description: 'Vue d\'ensemble de l\'architecture technique',
      icon: GitBranch,
      content: [
        'Frontend: React + TypeScript + Tailwind CSS',
        'Backend: Supabase (PostgreSQL + Auth + Storage)',
        'Déploiement: Vercel + GitHub Actions',
        'Monitoring: Sentry + Analytics'
      ]
    },
    {
      title: 'Sécurité',
      description: 'Mesures de sécurité implémentées',
      icon: Shield,
      content: [
        'Authentification multi-facteurs (MFA)',
        'Chiffrement des données sensibles',
        'Row Level Security (RLS)',
        'Audit trail complet'
      ]
    },
    {
      title: 'Configuration',
      description: 'Guide de configuration et personnalisation',
      icon: Settings,
      content: [
        'Variables d\'environnement',
        'Configuration de la base de données',
        'Paramètres de sécurité',
        'Personnalisation de l\'interface'
      ]
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documentation</h1>
          <p className="text-muted-foreground">
            Guide complet d'utilisation et documentation technique
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Wiki
          </Button>
        </div>
      </div>

      <Tabs defaultValue="user-guide" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="user-guide" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Guide utilisateur
          </TabsTrigger>
          <TabsTrigger value="technical" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Documentation technique
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            API Reference
          </TabsTrigger>
          <TabsTrigger value="components" className="flex items-center gap-2">
            <Book className="w-4 h-4" />
            Composants
          </TabsTrigger>
        </TabsList>

        {/* Guide utilisateur interactif */}
        <TabsContent value="user-guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Guide utilisateur interactif
              </CardTitle>
              <CardDescription>
                Apprenez à utiliser l'application étape par étape
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {guides.map((guide) => (
                  <Card 
                    key={guide.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      activeGuide === guide.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setActiveGuide(activeGuide === guide.id ? null : guide.id)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                    {activeGuide === guide.id && (
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {guide.steps.map((step, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                {index + 1}
                              </div>
                              <span className="text-sm">{step}</span>
                            </div>
                          ))}
                        </div>
                        <Button className="mt-4 w-full" size="sm">
                          Commencer ce guide
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation technique */}
        <TabsContent value="technical" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {technicalDocs.map((doc, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <doc.icon className="w-5 h-5" />
                    {doc.title}
                  </CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {doc.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Diagramme d'architecture */}
          <Card>
            <CardHeader>
              <CardTitle>Architecture du système</CardTitle>
              <CardDescription>
                Diagramme complet de l'architecture applicative
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-6">
                <div className="text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p>Diagramme d'architecture détaillé</p>
                  <p className="text-sm mt-2">
                    Frontend → API → Database → External Services
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation API */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Documentation API REST
              </CardTitle>
              <CardDescription>
                Référence complète de l'API avec exemples et schémas
              </CardDescription>
              <div className="flex gap-2">
                <Badge variant="secondary">REST API</Badge>
                <Badge variant="secondary">OpenAPI 3.0</Badge>
                <Badge variant="secondary">JSON</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <SwaggerUI 
                  url="/docs/api/api-spec.yaml"
                  docExpansion="list"
                  defaultModelsExpandDepth={1}
                  defaultModelExpandDepth={1}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation des composants (Storybook) */}
        <TabsContent value="components" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                Librairie de composants
              </CardTitle>
              <CardDescription>
                Documentation interactive des composants UI avec Storybook
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Composants de base</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Boutons, inputs, cartes, badges...
                    </p>
                    <Button size="sm" className="w-full">
                      Voir dans Storybook
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Composants métier</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Tableaux, formulaires, dashboards...
                    </p>
                    <Button size="sm" className="w-full">
                      Voir dans Storybook
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Layouts</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Headers, sidebars, grilles...
                    </p>
                    <Button size="sm" className="w-full">
                      Voir dans Storybook
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Lancer Storybook localement</h4>
                <code className="text-sm bg-background px-2 py-1 rounded">
                  npm run storybook
                </code>
                <p className="text-sm text-muted-foreground mt-2">
                  Storybook sera disponible sur http://localhost:6006
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentationPage;