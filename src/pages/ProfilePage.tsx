import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Building, Calendar, DollarSign, Briefcase, Camera } from 'lucide-react';
import { userService, UserProfile } from '../services/userService';
import { organigrammeService, OrganizationalUnit } from '../services/organigrammeService';
import { toast } from '@/hooks/use-toast';
import ImageUpload from '../components/ui/image-upload';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState<OrganizationalUnit[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    address: '',
    unitId: '',
    unitName: '',
    voipNumber: '',
    professionalEmail: '',
    professionalAddress: '',
    fonction: ''
  });
  const [profileImage, setProfileImage] = useState<string | null>(user?.photoUrl || null);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadUnits();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const userProfile = await userService.getUserProfile(user.id);
      if (userProfile) {
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const loadUnits = async () => {
    try {
      const unitsData = await organigrammeService.getUnits();
      setUnits(unitsData);
    } catch (error) {
      console.error('Erreur lors du chargement des unités:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Trouver l'unité sélectionnée pour obtenir son nom
      const selectedUnit = units.find(u => u.id === profile.unitId);
      const profileToUpdate = {
        ...profile,
        unitName: selectedUnit?.name || '',
        photoUrl: profileImage || undefined
      };

      await userService.updateUserProfile(user.id, profileToUpdate);
      await updateProfile(profileToUpdate);
      
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mon Profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et professionnelles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photo de profil */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Photo de profil
            </CardTitle>
            <CardDescription>
              Ajoutez ou modifiez votre photo de profil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profileImage || undefined} alt={user.name} />
                <AvatarFallback className="bg-blue-100 text-2xl">
                  <User className="h-16 w-16 text-blue-600" />
                </AvatarFallback>
              </Avatar>
            </div>
            
            <ImageUpload
              onImageChange={setProfileImage}
              currentImage={profileImage || undefined}
              maxSizeInMB={2}
              acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
            />
          </CardContent>
        </Card>

        {/* Informations personnelles */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>
              Vos données personnelles et de contact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email personnel</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone personnel</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Adresse personnelle</Label>
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="text-lg font-semibold mb-4">Informations professionnelles</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fonction">Fonction</Label>
                  <Input
                    id="fonction"
                    value={profile.fonction}
                    onChange={(e) => setProfile({ ...profile, fonction: e.target.value })}
                    placeholder="Votre fonction"
                  />
                </div>
                <div>
                  <Label htmlFor="professionalEmail">Email professionnel</Label>
                  <Input
                    id="professionalEmail"
                    type="email"
                    value={profile.professionalEmail}
                    onChange={(e) => setProfile({ ...profile, professionalEmail: e.target.value })}
                    placeholder="nom@entreprise.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="voipNumber">Numéro VOIP</Label>
                  <Input
                    id="voipNumber"
                    value={profile.voipNumber}
                    onChange={(e) => setProfile({ ...profile, voipNumber: e.target.value })}
                    placeholder="Extension VOIP"
                  />
                </div>
                <div>
                  <Label htmlFor="professionalAddress">Adresse professionnelle</Label>
                  <Input
                    id="professionalAddress"
                    value={profile.professionalAddress}
                    onChange={(e) => setProfile({ ...profile, professionalAddress: e.target.value })}
                    placeholder="Adresse du bureau"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="unitId">Unité organisationnelle</Label>
                <Select 
                  value={profile.unitId} 
                  onValueChange={(value) => setProfile({ ...profile, unitId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une unité" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Informations du compte (lecture seule) */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
            <CardDescription>
              Informations professionnelles en lecture seule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Rôle</p>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Briefcase className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Fonction</p>
                  <p className="text-sm text-gray-600">{user.fonction}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Unité actuelle</p>
                  <p className="text-sm text-gray-600">{user.unitName || 'Non assigné'}</p>
                </div>
              </div>

              {user.hireDate && (
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Date d'embauche</p>
                    <p className="text-sm text-gray-600">
                      {new Date(user.hireDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              )}

              {user.salary && (
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Salaire</p>
                    <p className="text-sm text-gray-600">{user.salary.toLocaleString()} €</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
