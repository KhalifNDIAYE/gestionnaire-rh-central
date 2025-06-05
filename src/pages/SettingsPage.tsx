import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { settingsService, SystemSettings } from '../services/settingsService';
import AnnouncementManager from '../components/communication/AnnouncementManager';

const SettingsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  // Charger les paramètres au montage du composant
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
        
        // Mettre à jour les valeurs par défaut des formulaires
        generalForm.reset({
          appName: data.general.appName,
          companyName: data.general.companyName,
          companyAddress: data.general.companyAddress || '',
          companyPhone: data.general.companyPhone || '',
          companyEmail: data.general.companyEmail || '',
        });
        
        notificationForm.reset(data.notifications);
        appearanceForm.reset(data.appearance);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Schéma pour les paramètres généraux
  const generalFormSchema = z.object({
    appName: z.string().min(1, { message: 'Le nom de l\'application est requis' }),
    companyName: z.string().min(1, { message: 'Le nom de l\'entreprise est requis' }),
    companyAddress: z.string().optional(),
    companyPhone: z.string().optional(),
    companyEmail: z.string().email({ message: 'Email invalide' }).optional().or(z.literal('')),
  });

  // Schéma pour les paramètres de notification
  const notificationFormSchema = z.object({
    emailNotifications: z.boolean(),
    appNotifications: z.boolean(),
    leaveRequestNotify: z.boolean(),
    payrollNotify: z.boolean(),
    newEmployeeNotify: z.boolean(),
  });

  // Schéma pour les paramètres d'apparence
  const appearanceFormSchema = z.object({
    theme: z.enum(['light', 'dark', 'system']),
    fontSize: z.enum(['small', 'medium', 'large']),
    language: z.enum(['fr', 'en']),
    sidebarCollapsed: z.boolean(),
  });

  // Formulaires avec valeurs par défaut
  const generalForm = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      appName: 'RH System',
      companyName: 'Votre Entreprise',
      companyAddress: '',
      companyPhone: '',
      companyEmail: '',
    },
  });

  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      appNotifications: true,
      leaveRequestNotify: true,
      payrollNotify: true,
      newEmployeeNotify: false,
    },
  });

  const appearanceForm = useForm<z.infer<typeof appearanceFormSchema>>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: 'light',
      fontSize: 'medium',
      language: 'fr',
      sidebarCollapsed: false,
    },
  });

  // Gestionnaires pour sauvegarder les paramètres
  const handleGeneralSubmit = async (data: z.infer<typeof generalFormSchema>) => {
    try {
      setLoading(true);
      // S'assurer que toutes les propriétés requises sont présentes
      const generalData = {
        appName: data.appName,
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        companyPhone: data.companyPhone,
        companyEmail: data.companyEmail,
      };
      await settingsService.updateGeneralSettings(generalData);
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres généraux ont été mis à jour avec succès.",
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

  const handleNotificationSubmit = async (data: z.infer<typeof notificationFormSchema>) => {
    try {
      setLoading(true);
      // S'assurer que toutes les propriétés requises sont présentes
      const notificationData = {
        emailNotifications: data.emailNotifications,
        appNotifications: data.appNotifications,
        leaveRequestNotify: data.leaveRequestNotify,
        payrollNotify: data.payrollNotify,
        newEmployeeNotify: data.newEmployeeNotify,
      };
      await settingsService.updateNotificationSettings(notificationData);
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres de notification ont été mis à jour avec succès.",
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

  const handleAppearanceSubmit = async (data: z.infer<typeof appearanceFormSchema>) => {
    try {
      setLoading(true);
      // S'assurer que toutes les propriétés requises sont présentes
      const appearanceData = {
        theme: data.theme,
        fontSize: data.fontSize,
        language: data.language,
        sidebarCollapsed: data.sidebarCollapsed,
      };
      await settingsService.updateAppearanceSettings(appearanceData);
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

  // Vérifier les permissions
  if (!user || user.role !== 'admin') {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres du système</h1>
        <p className="text-gray-500">Configurez les paramètres de l'application</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="advanced">Avancé</TabsTrigger>
        </TabsList>

        {/* Paramètres généraux */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Généraux</CardTitle>
              <CardDescription>
                Configurez les informations de base de l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(handleGeneralSubmit)} className="space-y-4">
                  <FormField
                    control={generalForm.control}
                    name="appName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l'application</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Ce nom apparaîtra dans l'en-tête de l'application
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l'entreprise</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="companyAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse de l'entreprise</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={generalForm.control}
                      name="companyPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="companyEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres de notification */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notification</CardTitle>
              <CardDescription>
                Configurez comment et quand vous recevrez des notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(handleNotificationSubmit)} className="space-y-4">
                  <FormField
                    control={notificationForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Notifications par email</FormLabel>
                          <FormDescription>
                            Recevoir des notifications par email
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
                  
                  <FormField
                    control={notificationForm.control}
                    name="appNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Notifications dans l'application</FormLabel>
                          <FormDescription>
                            Afficher des notifications dans l'interface
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
                  
                  <div className="pt-2">
                    <h3 className="mb-4 text-sm font-medium">Événements de notification</h3>
                    
                    <div className="space-y-4">
                      <FormField
                        control={notificationForm.control}
                        name="leaveRequestNotify"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">Demandes de congé</FormLabel>
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
                      
                      <FormField
                        control={notificationForm.control}
                        name="payrollNotify"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">Bulletins de salaire</FormLabel>
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
                      
                      <FormField
                        control={notificationForm.control}
                        name="newEmployeeNotify"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">Nouvel employé</FormLabel>
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
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres d'apparence */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...appearanceForm}>
                <form onSubmit={appearanceForm.handleSubmit(handleAppearanceSubmit)} className="space-y-4">
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
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={appearanceForm.control}
                    name="sidebarCollapsed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Barre latérale réduite</FormLabel>
                          <FormDescription>
                            Réduire la barre latérale par défaut
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
                  
                  <div className="flex justify-end mt-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nouveau: Paramètres de communication */}
        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle>Communication</CardTitle>
              <CardDescription>
                Gérez les annonces et la communication dans l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnnouncementManager />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres avancés */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Avancés</CardTitle>
              <CardDescription>
                Configuration avancée du système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Sauvegarde des données</h3>
                  <div className="flex justify-between items-center border p-4 rounded-lg">
                    <div>
                      <p className="text-sm">Exporter les données du système</p>
                      <p className="text-xs text-gray-500">Télécharger une copie de toutes les données</p>
                    </div>
                    <Button variant="outline">Exporter</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Maintenance</h3>
                  <div className="flex justify-between items-center border p-4 rounded-lg">
                    <div>
                      <p className="text-sm">Nettoyer le cache</p>
                      <p className="text-xs text-gray-500">Supprimer les données temporaires</p>
                    </div>
                    <Button variant="outline">Nettoyer</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Danger</h3>
                  <div className="flex justify-between items-center border p-4 rounded-lg border-red-200">
                    <div>
                      <p className="text-sm text-red-600">Réinitialiser le système</p>
                      <p className="text-xs text-gray-500">Supprimer toutes les données et configuration</p>
                    </div>
                    <Button variant="destructive">Réinitialiser</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
