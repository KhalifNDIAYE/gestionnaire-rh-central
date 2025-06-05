import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { communicationService, CommunicationAnnouncement, CommunicationSettings } from '../../services/communicationService';
import { Calendar, MapPin, Clock, User, Plus, Edit, Trash2, Eye, EyeOff, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import ImageUpload from '../ui/image-upload';

const announcementSchema = z.object({
  title: z.string().min(1, { message: 'Le titre est requis' }),
  content: z.string().min(1, { message: 'Le contenu est requis' }),
  type: z.enum(['info', 'meeting', 'news', 'urgent']),
  imageUrl: z.string().optional(),
  meetingDate: z.string().optional(),
  meetingLocation: z.string().optional(),
  isActive: z.boolean(),
  priority: z.number().min(1).max(10),
  expirationDate: z.string().optional(),
});

const settingsSchema = z.object({
  carouselDuration: z.number().min(3000).max(60000),
  autoplay: z.boolean(),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;
type SettingsFormData = z.infer<typeof settingsSchema>;

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState<CommunicationAnnouncement[]>([]);
  const [settings, setSettings] = useState<CommunicationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<CommunicationAnnouncement | null>(null);

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      content: '',
      type: 'info',
      imageUrl: '',
      meetingDate: '',
      meetingLocation: '',
      isActive: true,
      priority: 1,
      expirationDate: '',
    },
  });

  const settingsForm = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      carouselDuration: 15000,
      autoplay: true,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [announcementsData, settingsData] = await Promise.all([
        communicationService.getActiveAnnouncements(),
        communicationService.getCommunicationSettings()
      ]);
      setAnnouncements(announcementsData);
      setSettings(settingsData);
      settingsForm.reset(settingsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: AnnouncementFormData) => {
    try {
      const announcementData = {
        title: data.title,
        content: data.content,
        type: data.type,
        isActive: data.isActive,
        priority: data.priority,
        authorId: 'admin',
        authorName: 'Administrateur',
        meetingDate: data.meetingDate || undefined,
        meetingLocation: data.meetingLocation || undefined,
        imageUrl: data.imageUrl || undefined,
        expirationDate: data.expirationDate || undefined,
      };

      if (editingAnnouncement) {
        await communicationService.updateAnnouncement(editingAnnouncement.id, announcementData);
        toast({
          title: "Annonce mise à jour",
          description: "L'annonce a été mise à jour avec succès.",
        });
      } else {
        await communicationService.createAnnouncement(announcementData);
        toast({
          title: "Annonce créée",
          description: "L'annonce a été créée avec succès.",
        });
      }

      setDialogOpen(false);
      setEditingAnnouncement(null);
      form.reset();
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: editingAnnouncement ? "Impossible de mettre à jour l'annonce." : "Impossible de créer l'annonce.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleSettingsSubmit = async (data: SettingsFormData) => {
    try {
      await communicationService.updateCommunicationSettings(data);
      setSettings({ ...settings!, ...data });
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres du carrousel ont été mis à jour.",
      });
      setSettingsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleEdit = (announcement: CommunicationAnnouncement) => {
    setEditingAnnouncement(announcement);
    form.reset({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      imageUrl: announcement.imageUrl || '',
      meetingDate: announcement.meetingDate || '',
      meetingLocation: announcement.meetingLocation || '',
      isActive: announcement.isActive,
      priority: announcement.priority,
      expirationDate: announcement.expirationDate || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await communicationService.deleteAnnouncement(id);
        toast({
          title: "Annonce supprimée",
          description: "L'annonce a été supprimée avec succès.",
        });
        loadData();
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'annonce.",
          variant: "destructive",
        });
        console.error(error);
      }
    }
  };

  const getTypeColor = (type: CommunicationAnnouncement['type']) => {
    switch (type) {
      case 'urgent': return 'destructive';
      case 'meeting': return 'default';
      case 'news': return 'secondary';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeLabel = (type: CommunicationAnnouncement['type']) => {
    switch (type) {
      case 'urgent': return 'Urgent';
      case 'meeting': return 'Réunion';
      case 'news': return 'Actualité';
      case 'info': return 'Information';
      default: return 'Info';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Gestion des annonces</h3>
          <p className="text-sm text-gray-500">Gérez les annonces qui s'affichent dans le carrousel de communication</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres carrousel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Paramètres du carrousel</DialogTitle>
                <DialogDescription>
                  Configurez le comportement du carrousel d'annonces
                </DialogDescription>
              </DialogHeader>
              
              <Form {...settingsForm}>
                <form onSubmit={settingsForm.handleSubmit(handleSettingsSubmit)} className="space-y-4">
                  <FormField
                    control={settingsForm.control}
                    name="carouselDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durée d'affichage (millisecondes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="3000" 
                            max="60000" 
                            step="1000"
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Entre 3 et 60 secondes (3000 - 60000ms)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={settingsForm.control}
                    name="autoplay"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Lecture automatique</FormLabel>
                          <FormDescription>
                            Activer le défilement automatique du carrousel
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
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setSettingsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      Sauvegarder
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingAnnouncement(null);
                form.reset();
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle annonce
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAnnouncement ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
                </DialogTitle>
                <DialogDescription>
                  {editingAnnouncement ? 'Modifiez les informations de l\'annonce.' : 'Créez une nouvelle annonce pour le carrousel de communication.'}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contenu</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="info">Information</SelectItem>
                              <SelectItem value="meeting">Réunion</SelectItem>
                              <SelectItem value="news">Actualité</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priorité (1-10)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="10" 
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <ImageUpload
                          onImageChange={(imageUrl) => field.onChange(imageUrl || '')}
                          currentImage={field.value}
                          maxSizeInMB={2}
                          acceptedFormats={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('type') === 'meeting' && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="meetingDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date de la réunion</FormLabel>
                            <FormControl>
                              <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="meetingLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lieu de la réunion</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="expirationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date d'expiration (optionnel)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          L'annonce ne sera plus affichée après cette date
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Annonce active</FormLabel>
                          <FormDescription>
                            L'annonce sera affichée dans le carrousel
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
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      {editingAnnouncement ? 'Mettre à jour' : 'Créer'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : announcements.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Aucune annonce trouvée</p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getTypeColor(announcement.type)}>
                        {getTypeLabel(announcement.type)}
                      </Badge>
                      <Badge variant={announcement.isActive ? "default" : "secondary"}>
                        {announcement.isActive ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                        {announcement.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                      <span className="text-xs text-gray-500">Priorité: {announcement.priority}</span>
                    </div>
                    
                    <h4 className="font-medium mb-1">{announcement.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                    
                    {announcement.type === 'meeting' && announcement.meetingDate && (
                      <div className="flex gap-4 text-xs text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(announcement.meetingDate), 'PPP à HH:mm', { locale: fr })}
                        </div>
                        {announcement.meetingLocation && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {announcement.meetingLocation}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {announcement.authorName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(announcement.createdAt), 'PPP', { locale: fr })}
                      </div>
                      {announcement.expirationDate && (
                        <div className="text-orange-600">
                          Expire le {format(new Date(announcement.expirationDate), 'PPP', { locale: fr })}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(announcement)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementManager;
