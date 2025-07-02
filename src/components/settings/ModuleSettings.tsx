import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { settingsService, ModuleSettings as ModuleSettingsType } from '../../services/settingsService';

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
  communication: z.boolean(),
});

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
      communication: true,
    },
  });

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
        communication: data.communication,
      };
      
      await settingsService.updateModuleSettings(moduleSettings);
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres des modules ont été mis à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour des paramètres des modules.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres des Modules</CardTitle>
        <CardDescription>
          Activez ou désactivez les modules de l'application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...moduleForm}>
          <form onSubmit={moduleForm.handleSubmit(handleModuleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={moduleForm.control}
                name="directory"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Annuaire</FormLabel>
                      <FormDescription>Module de gestion de l'annuaire</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={moduleForm.control}
                name="memorandum"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Mémorandums</FormLabel>
                      <FormDescription>Module de gestion des mémorandums</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={moduleForm.control}
                name="communication"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Communication</FormLabel>
                      <FormDescription>Module de gestion des annonces</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={moduleForm.control}
                name="employees"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Employés</FormLabel>
                      <FormDescription>Module de gestion des employés</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={moduleForm.control}
                name="functions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Fonctions</FormLabel>
                      <FormDescription>Module de gestion des fonctions</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={moduleForm.control}
                name="leaveRequests"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Demandes de congés</FormLabel>
                      <FormDescription>Module de gestion des demandes de congés</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={moduleForm.control}
                name="organigramme"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Organigramme</FormLabel>
                      <FormDescription>Module de gestion de l'organigramme</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={moduleForm.control}
                name="timeTracking"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Pointage</FormLabel>
                      <FormDescription>Module de gestion du pointage</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={moduleForm.control}
                name="payroll"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Bulletins de salaire</FormLabel>
                      <FormDescription>Module de gestion des bulletins de salaire</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={moduleForm.control}
                name="salary"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Calcul des salaires</FormLabel>
                      <FormDescription>Module de calcul des salaires</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={moduleForm.control}
                name="projects"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Projets</FormLabel>
                      <FormDescription>Module de gestion des projets</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ModuleSettings;
