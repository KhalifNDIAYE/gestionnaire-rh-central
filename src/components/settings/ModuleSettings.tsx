
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { settingsService, ModuleSettings as ModuleSettingsType } from '../../services/settingsService';
import {
  Users,
  Calendar,
  FileText,
  DollarSign,
  Clock,
  BookOpen,
  Briefcase,
  FolderKanban,
  Network,
  Contact
} from 'lucide-react';

const moduleFormSchema = z.object({
  directory: z.boolean(),
  memorandum: z.boolean(),
  employees: z.boolean(),
  functions: z.boolean(),
  leaveRequests: z.boolean(),
  organigramme: z.boolean(),
  timeTracking: z.boolean(),
  payroll: z.boolean(),
  salary: z.boolean(),
  projects: z.boolean(),
});

const moduleInfo = [
  {
    key: 'directory' as const,
    label: 'Annuaire',
    description: 'Affichage de l\'annuaire des employés',
    icon: Contact,
    category: 'Principal'
  },
  {
    key: 'memorandum' as const,
    label: 'Mémorandums',
    description: 'Gestion des mémorandums et communications',
    icon: BookOpen,
    category: 'Principal'
  },
  {
    key: 'employees' as const,
    label: 'Gestion des agents',
    description: 'Gestion complète des employés',
    icon: Users,
    category: 'Ressources Humaines'
  },
  {
    key: 'functions' as const,
    label: 'Gestion des fonctions',
    description: 'Définition et gestion des postes et fonctions',
    icon: Briefcase,
    category: 'Ressources Humaines'
  },
  {
    key: 'leaveRequests' as const,
    label: 'Demandes de congés',
    description: 'Système de demandes et validation des congés',
    icon: Calendar,
    category: 'Ressources Humaines'
  },
  {
    key: 'organigramme' as const,
    label: 'Organigramme',
    description: 'Visualisation de la structure organisationnelle',
    icon: Network,
    category: 'Ressources Humaines'
  },
  {
    key: 'timeTracking' as const,
    label: 'Pointage',
    description: 'Suivi des heures de travail et présence',
    icon: Clock,
    category: 'Ressources Humaines'
  },
  {
    key: 'payroll' as const,
    label: 'Bulletins de salaire',
    description: 'Consultation des bulletins de salaire',
    icon: FileText,
    category: 'Finance'
  },
  {
    key: 'salary' as const,
    label: 'Calcul des salaires',
    description: 'Outils de calcul et gestion des salaires',
    icon: DollarSign,
    category: 'Finance'
  },
  {
    key: 'projects' as const,
    label: 'Gestion des projets',
    description: 'Planification et suivi des projets',
    icon: FolderKanban,
    category: 'Finance'
  }
];

const ModuleSettings = () => {
  const [loading, setLoading] = useState(false);

  const moduleForm = useForm<z.infer<typeof moduleFormSchema>>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: {
      directory: true,
      memorandum: true,
      employees: true,
      functions: true,
      leaveRequests: true,
      organigramme: true,
      timeTracking: true,
      payroll: true,
      salary: true,
      projects: true,
    },
  });

  // Charger les paramètres au montage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsService.getSettings();
        moduleForm.reset(settings.modules);
      } catch (error) {
        console.error('Error loading module settings:', error);
      }
    };
    loadSettings();
  }, [moduleForm]);

  const handleModuleSubmit = async (data: z.infer<typeof moduleFormSchema>) => {
    try {
      setLoading(true);
      const moduleSettings: ModuleSettingsType = {
        directory: data.directory,
        memorandum: data.memorandum,
        employees: data.employees,
        functions: data.functions,
        leaveRequests: data.leaveRequests,
        organigramme: data.organigramme,
        timeTracking: data.timeTracking,
        payroll: data.payroll,
        salary: data.salary,
        projects: data.projects,
      };
      
      await settingsService.updateModuleSettings(moduleSettings);
      toast({
        title: "Paramètres mis à jour",
        description: "La configuration des modules a été mise à jour avec succès. Rechargez la page pour voir les changements.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour des paramètres.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Grouper les modules par catégorie
  const modulesByCategory = moduleInfo.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, typeof moduleInfo>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Modules</CardTitle>
        <CardDescription>
          Activez ou désactivez les modules de l'application. Les modules désactivés n'apparaîtront pas dans le menu de navigation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...moduleForm}>
          <form onSubmit={moduleForm.handleSubmit(handleModuleSubmit)} className="space-y-6">
            {Object.entries(modulesByCategory).map(([category, modules]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modules.map((module) => {
                    const Icon = module.icon;
                    return (
                      <FormField
                        key={module.key}
                        control={moduleForm.control}
                        name={module.key}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4">
                            <div className="flex items-center space-x-3 flex-1">
                              <Icon className="w-5 h-5 text-gray-600" />
                              <div className="space-y-1 flex-1">
                                <FormLabel className="text-base font-medium">
                                  {module.label}
                                </FormLabel>
                                <FormDescription className="text-sm">
                                  {module.description}
                                </FormDescription>
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
            
            <div className="flex justify-end pt-6">
              <Button type="submit" disabled={loading}>
                {loading ? "Sauvegarde..." : "Sauvegarder les paramètres"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ModuleSettings;
