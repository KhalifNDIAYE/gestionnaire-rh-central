
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { settingsService, NotificationSettings as NotificationSettingsType } from '../../services/settingsService';

const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  appNotifications: z.boolean(),
  leaveRequestNotify: z.boolean(),
  payrollNotify: z.boolean(),
  newEmployeeNotify: z.boolean(),
});

const NotificationSettings = () => {
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsService.getSettings();
        notificationForm.reset(settings.notifications);
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    };
    loadSettings();
  }, [notificationForm]);

  const handleNotificationSubmit = async (data: z.infer<typeof notificationFormSchema>) => {
    try {
      setLoading(true);
      const notificationSettings: NotificationSettingsType = {
        emailNotifications: data.emailNotifications,
        appNotifications: data.appNotifications,
        leaveRequestNotify: data.leaveRequestNotify,
        payrollNotify: data.payrollNotify,
        newEmployeeNotify: data.newEmployeeNotify,
      };
      
      await settingsService.updateNotificationSettings(notificationSettings);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de Notification</CardTitle>
        <CardDescription>
          Configurez les notifications de l'application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...notificationForm}>
          <form onSubmit={notificationForm.handleSubmit(handleNotificationSubmit)} className="space-y-6">
            <FormField
              control={notificationForm.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Notifications par email
                    </FormLabel>
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
                    <FormLabel className="text-base">
                      Notifications dans l'application
                    </FormLabel>
                    <FormDescription>
                      Recevoir des notifications dans l'interface
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
              name="leaveRequestNotify"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Demandes de congés
                    </FormLabel>
                    <FormDescription>
                      Notifications pour les demandes de congés
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
              name="payrollNotify"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Bulletins de salaire
                    </FormLabel>
                    <FormDescription>
                      Notifications pour les bulletins de salaire
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
              name="newEmployeeNotify"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Nouveaux employés
                    </FormLabel>
                    <FormDescription>
                      Notifications pour les nouveaux employés
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

export default NotificationSettings;
