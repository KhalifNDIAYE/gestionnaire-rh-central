
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { userService, PasswordChangeRequest } from '../services/userService';

const ProfilePage = () => {
  const { user, updateUserInfo } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  if (!user) {
    return <div>Vous devez être connecté pour accéder à cette page.</div>;
  }

  // Formulaire pour les informations personnelles
  const profileFormSchema = z.object({
    name: z.string().min(1, { message: 'Le nom est requis' }),
    email: z.string().email({ message: 'Email invalide' }),
    phone: z.string().optional(),
    address: z.string().optional(),
  });

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
    },
  });

  // Formulaire pour le changement de mot de passe
  const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, { message: 'Le mot de passe actuel est requis' }),
    newPassword: z.string().min(8, { message: 'Le nouveau mot de passe doit contenir au moins 8 caractères' }),
    confirmPassword: z.string().min(1, { message: 'La confirmation est requise' }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      setIsLoading(true);
      const updatedUser = await userService.updateProfile(user.id, data);
      updateUserInfo(updatedUser);
      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour du profil.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (data: z.infer<typeof passwordFormSchema>) => {
    try {
      setIsLoading(true);
      const passwordData: PasswordChangeRequest = {
        userId: user.id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };
      
      await userService.changePassword(passwordData);
      passwordForm.reset();
      
      toast({
        title: "Mot de passe changé",
        description: "Votre mot de passe a été modifié avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du changement de mot de passe.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mon Profil</h1>
        <p className="text-gray-500">Gérez vos informations personnelles et vos préférences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte de profil */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-xl">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-500">{user.fonction}</p>
              </div>
              <div className="w-full px-4">
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Email:</span>
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Rôle:</span>
                    <span className="text-sm capitalize">{user.role}</span>
                  </div>
                  {user.department && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Département:</span>
                      <span className="text-sm">{user.department}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulaires */}
        <div className="col-span-1 md:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="preferences">Préférences</TabsTrigger>
            </TabsList>

            {/* Informations personnelles */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Informations personnelles</CardTitle>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)}>Modifier</Button>
                    ) : (
                      <Button variant="ghost" onClick={() => setIsEditing(false)}>Annuler</Button>
                    )}
                  </div>
                  <CardDescription>
                    Mettez à jour vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-sm">Nom complet</h3>
                        <p>{user.name}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Email</h3>
                        <p>{user.email}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Téléphone</h3>
                        <p>{user.phone || "Non renseigné"}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Adresse</h3>
                        <p>{user.address || "Non renseignée"}</p>
                      </div>
                    </div>
                  ) : (
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom complet</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
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

                        <FormField
                          control={profileForm.control}
                          name="phone"
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
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Adresse</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end space-x-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                          >
                            Annuler
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Enregistrement..." : "Enregistrer"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sécurité */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                  <CardDescription>
                    Mettez à jour votre mot de passe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe actuel</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nouveau mot de passe</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormDescription>
                              Au moins 8 caractères
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmer le mot de passe</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Changement..." : "Changer le mot de passe"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Préférences */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences</CardTitle>
                  <CardDescription>
                    Personnalisez vos préférences de l'application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-center py-4">
                    Module en cours de développement
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
