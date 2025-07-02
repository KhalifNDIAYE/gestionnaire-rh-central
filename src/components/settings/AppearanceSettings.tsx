
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { settingsService, AppearanceSettings as AppearanceSettingsType } from '../../services/settingsService';

const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  fontSize: z.enum(['small', 'medium', 'large']),
  language: z.enum(['fr', 'en']),
  sidebarCollapsed: z.boolean(),
});

const AppearanceSettings = () => {
  const [loading, setLoading] = useState(false);

  const appearanceForm = useForm<z.infer<typeof appearanceFormSchema>>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: 'light',
      fontSize: 'medium',
      language: 'fr',
      sidebarCollapsed: false,
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsService.getSettings();
        appearanceForm.reset(settings.appearance);
      } catch (error) {
        console.error('Error loading appearance settings:', error);
      }
    };
    loadSettings();
  }, [appearanceForm]);

  const handleAppearanceSubmit = async (data: z.infer<typeof appearanceFormSchema>) => {
    try {
      setLoading(true);
      const appearanceSettings: AppearanceSettingsType = {
        theme: data.theme,
        fontSize: data.fontSize,
        language: data.language,
        sidebarCollapsed: data.sidebarCollapsed,
      };
      
      await settingsService.updateAppearanceSettings(appearanceSettings);
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres d'apparence ont été mis à jour avec succès.",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres d'Apparence</CardTitle>
        <CardDescription>
          Personnalisez l'apparence de votre application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...appearanceForm}>
          <form onSubmit={appearanceForm.handleSubmit(handleAppearanceSubmit)} className="space-y-6">
            <FormField
              control={appearanceForm.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thème</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un thème" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="system">Système</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choisissez le thème de l'interface
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={appearanceForm.control}
              name="fontSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taille de police</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une taille" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="small">Petite</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Ajustez la taille du texte
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={appearanceForm.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Langue</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une langue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choisissez la langue de l'interface
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={appearanceForm.control}
              name="sidebarCollapsed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Sidebar réduite par défaut
                    </FormLabel>
                    <FormDescription>
                      La barre latérale sera réduite au démarrage
                    </FormDescription>
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

export default AppearanceSettings;
