
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { communicationService, CommunicationAnnouncement, CommunicationSettings } from '../../services/communicationService';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2, Calendar, MapPin, Settings, Save, Image, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

const AnnouncementManager = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<CommunicationAnnouncement[]>([]);
  const [settings, setSettings] = useState<CommunicationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAnnouncement, setEditingAnnouncement] = useState<CommunicationAnnouncement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // États du formulaire
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info' as CommunicationAnnouncement['type'],
    imageUrl: '',
    meetingDate: '',
    meetingLocation: '',
    priority: 1,
    isActive: true,
    expirationDate: ''
  });

  // États pour les paramètres
  const [settingsData, setSettingsData] = useState({
    carouselDuration: 20000,
    autoplay: true
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (settings) {
      setSettingsData({
        carouselDuration: settings.carouselDuration,
        autoplay: settings.autoplay
      });
    }
  }, [settings]);

  const loadData = async () => {
    try {
      const [announcementsData, settingsData] = await Promise.all([
        communicationService.getAllAnnouncements(),
        communicationService.getCommunicationSettings()
      ]);
      setAnnouncements(announcementsData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'info',
      imageUrl: '',
      meetingDate: '',
      meetingLocation: '',
      priority: 1,
      isActive: true,
      expirationDate: ''
    });
    setEditingAnnouncement(null);
  };

  const handleEdit = (announcement: CommunicationAnnouncement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      imageUrl: announcement.imageUrl || '',
      meetingDate: announcement.meetingDate || '',
      meetingLocation: announcement.meetingLocation || '',
      priority: announcement.priority,
      isActive: announcement.isActive,
      expirationDate: announcement.expirationDate || ''
    });
    setEditingAnnouncement(announcement);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vous devez être connecté pour effectuer cette action');
      return;
    }

    try {
      const announcementData = {
        ...formData,
        authorId: user.id,
        authorName: user.name,
        imageUrl: formData.imageUrl || undefined,
        meetingDate: formData.meetingDate || undefined,
        meetingLocation: formData.meetingLocation || undefined,
        expirationDate: formData.expirationDate || undefined
      };

      if (editingAnnouncement) {
        await communicationService.updateAnnouncement(editingAnnouncement.id, announcementData);
        toast.success('Annonce mise à jour avec succès');
      } else {
        await communicationService.createAnnouncement(announcementData);
        toast.success('Annonce créée avec succès');
      }

      await loadData();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error('Erreur lors de l\'enregistrement de l\'annonce');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      return;
    }

    try {
      await communicationService.deleteAnnouncement(id);
      toast.success('Annonce supprimée avec succès');
      await loadData();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Erreur lors de la suppression de l\'annonce');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérification du type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format d\'image non supporté. Utilisez JPEG, PNG, WebP ou GIF');
      return;
    }

    // Vérification de la taille (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('L\'image est trop volumineuse. Taille maximum : 5MB');
      return;
    }

    // Conversion en base64 pour stockage temporaire
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormData(prev => ({ ...prev, imageUrl: result }));
      toast.success('Image uploadée avec succès');
    };
    reader.readAsDataURL(file);
  };

  const handleSettingsUpdate = async () => {
    try {
      await communicationService.updateCommunicationSettings(settingsData);
      setSettings(settingsData);
      toast.success('Paramètres mis à jour avec succès');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Erreur lors de la mise à jour des paramètres');
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

  if (isLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="announcements" className="w-full">
        <TabsList>
          <TabsTrigger value="announcements">Annonces</TabsTrigger>
          <TabsTrigger value="settings">Paramètres du carrousel</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Gestion des annonces</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle annonce
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingAnnouncement ? 'Modifier l\'annonce' : 'Créer une nouvelle annonce'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Contenu *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type d'annonce</Label>
                      <Select value={formData.type} onValueChange={(value: CommunicationAnnouncement['type']) => 
                        setFormData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Information</SelectItem>
                          <SelectItem value="meeting">Réunion</SelectItem>
                          <SelectItem value="news">Actualité</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priorité (1-10)</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image">Image</Label>
                    <div className="space-y-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImageUpload}
                      />
                      <p className="text-sm text-gray-500">
                        Formats acceptés : JPEG, PNG, WebP, GIF. Taille maximum : 5MB
                      </p>
                      {formData.imageUrl && (
                        <div className="mt-2">
                          <img
                            src={formData.imageUrl}
                            alt="Aperçu"
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {formData.type === 'meeting' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="meetingDate">Date de la réunion</Label>
                        <Input
                          id="meetingDate"
                          type="datetime-local"
                          value={formData.meetingDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, meetingDate: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="meetingLocation">Lieu de la réunion</Label>
                        <Input
                          id="meetingLocation"
                          value={formData.meetingLocation}
                          onChange={(e) => setFormData(prev => ({ ...prev, meetingLocation: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="expirationDate">Date d'expiration (optionnelle)</Label>
                    <Input
                      id="expirationDate"
                      type="date"
                      value={formData.expirationDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive">Annonce active</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {editingAnnouncement ? 'Mettre à jour' : 'Créer'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <Badge variant={getTypeColor(announcement.type)}>
                          {getTypeLabel(announcement.type)}
                        </Badge>
                        {!announcement.isActive && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                      <CardDescription>{announcement.content}</CardDescription>
                      {announcement.type === 'meeting' && announcement.meetingDate && (
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(announcement.meetingDate), 'PPP à HH:mm', { locale: fr })}
                          </div>
                          {announcement.meetingLocation && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {announcement.meetingLocation}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(announcement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(announcement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {announcement.imageUrl && (
                  <CardContent>
                    <img
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </CardContent>
                )}
              </Card>
            ))}
            {announcements.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune annonce créée pour le moment</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paramètres du carrousel
              </CardTitle>
              <CardDescription>
                Configurez le comportement du carrousel d'annonces
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Durée d'affichage : {settingsData.carouselDuration / 1000} secondes</Label>
                <Slider
                  value={[settingsData.carouselDuration]}
                  onValueChange={([value]) => setSettingsData(prev => ({ ...prev, carouselDuration: value }))}
                  min={3000}
                  max={60000}
                  step={1000}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Durée d'affichage de chaque annonce (3 à 60 secondes)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="autoplay"
                  checked={settingsData.autoplay}
                  onCheckedChange={(checked) => setSettingsData(prev => ({ ...prev, autoplay: checked }))}
                />
                <Label htmlFor="autoplay">Lecture automatique</Label>
              </div>

              <Button onClick={handleSettingsUpdate}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les paramètres
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnnouncementManager;
