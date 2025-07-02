
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { settingsService, GeneralSettings as GeneralSettingsType } from '../../services/settingsService';

const generalFormSchema = z.object({
  appName: z.string().min(1, 'Le nom de l\'application est requis'),
  companyName: z.string().min(1, 'Le nom de l\'entreprise est requis'),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  companyEmail: z.string().email('Email invalide').optional().or(z.literal('')),
});

const GeneralSettings = () => {
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsService.getSettings();
        generalForm.reset(settings.general);
      } catch (error) {
        console.error('Error loading general settings:', error);
      }
    };
    loadSettings();
  }, [generalForm]);

  const handleGeneralSubmit = async (data: z.infer<typeof generalFormSchema>) => {
    try {
      setLoading(true);
      const generalSettings: GeneralSettingsType = {
        appName: data.appName,
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        companyPhone: data.companyPhone,
        companyEmail: data.companyEmail,
      };
      
      await settingsService.updateGeneralSettings(generalSettings);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres Généraux</CardTitle>
        <CardDescription>
          Configurez les informations générales de votre application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...generalForm}>
          <form onSubmit={generalForm.handleSubmit(handleGeneralSubmit)} className="space-y-6">
            <FormField
              control={generalForm.control}
              name="appName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'application</FormLabel>
                  <FormControl>
                    <Input placeholder="RH System" {...field} />
                  </FormControl>
                  <FormDescription>
                    Le nom qui apparaîtra dans l'interface
                  </FormDescription>
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
                    <Input placeholder="Votre Entreprise" {...field} />
                  </FormControl>
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
                    <Input placeholder="123 Rue Principale" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={generalForm.control}
              name="companyPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="+123456789" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={generalForm.control}
              name="companyEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de l'entreprise</FormLabel>
                  <FormControl>
                    <Input placeholder="contact@entreprise.com" {...field} />
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

export default GeneralSettings;
