import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { memorandumService, Memorandum } from '../../services/memorandumService';
import { useAuth } from '../../contexts/AuthContext';

interface MemorandumFormProps {
  onSuccess?: () => void;
}

const MemorandumForm = ({ onSuccess }: MemorandumFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    number: '',
    object: '',
    content: '',
    category: 'information' as const,
    priority: 'medium' as const,
    targetAudience: ['tous'],
    projectCode: '',
    componentCode: '',
    activityCode: ''
  });

  const generateMemoNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const randomNum = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    
    // Format: N°XXX/YYYY/CSE/[UNIT]/[AUTHOR_INITIALS]
    const authorInitials = user?.name.split(' ').map(n => n.charAt(0)).join('') || 'XX';
    const unitCode = getUserUnitCode(user?.unitName);
    
    return `N°${randomNum}/${year}/CSE/${unitCode}/${authorInitials}`;
  };

  const getUserUnitCode = (unitName?: string) => {
    if (!unitName) return 'XX';
    
    const unitCodes: Record<string, string> = {
      'Directeur Général (DG)': 'DG',
      'Directrice Technique (DT)': 'DT',
      'Directeur Administratif et Financier (DAF)': 'DAF',
      'UNITÉ 1 - Veille Environnementale, Recherche et Formation (VERF)': 'U1',
      'UNITÉ 2 - Biodiversité et écosystèmes Terrestres et Marins (BETM)': 'U2',
      'UNITÉ 3 - Évaluation environnementale et sociale et gestion des Risques': 'U3',
      'UNITÉ 4 - Océan-Littoral et Ecosystèmes Aquatiques': 'U4',
      'UNITE 5 - Sécurité Alimentaire et Systèmes de Production Durable': 'U5',
      'UNITE 6 - Finances et Réponses Climatiques': 'U6',
      'CELLULE - Communication et Gestion des Connaissances': 'CCG',
      'CELLULE - Informatique, Gestion des Données et Services Géomatiques': 'CIG',
      'CELLULE - Mobilisation des Ressources Financières': 'CMR',
      'CELLULE - Suivi Evaluation et Qualité': 'CSE'
    };
    
    return unitCodes[unitName] || 'XX';
  };

  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    return now.toLocaleDateString('fr-FR', options);
  };

  React.useEffect(() => {
    if (user && !formData.number) {
      setFormData(prev => ({
        ...prev,
        number: generateMemoNumber()
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await memorandumService.createMemorandum({
        title: `${formData.number} - ${formData.object}`,
        content: buildMemoContent(),
        category: formData.category,
        priority: formData.priority,
        authorId: user.id,
        authorName: user.name,
        targetAudience: formData.targetAudience
      });

      toast({
        title: 'Mémorandum créé',
        description: 'Le mémorandum a été soumis pour validation.',
      });

      setFormData({
        number: generateMemoNumber(),
        object: '',
        content: '',
        category: 'information',
        priority: 'medium',
        targetAudience: ['tous'],
        projectCode: '',
        componentCode: '',
        activityCode: ''
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating memorandum:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le mémorandum. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const buildMemoContent = () => {
    const currentDate = getCurrentDate();
    const destinataire = getDestinataire();
    
    return `${formData.number}

Dakar, le ${currentDate}

Objet : ${formData.object}

${destinataire},

${formData.content}

${formData.projectCode || formData.componentCode || formData.activityCode ? `
Cette activité sera imputée sur l'Unité de Coordination et de Gestion (UCG) dont les codes sont ci-dessous énumérés :
${formData.projectCode ? `Code projet\t${formData.projectCode}` : ''}
${formData.componentCode ? `Code composante\t${formData.componentCode}` : ''}
${formData.activityCode ? `Code activité ou ligne budgétaire\t${formData.activityCode}` : ''}
` : ''}

En espérant qu'une suite favorable sera réservée à ma demande, je vous prie d'agréer ${destinataire} l'assurance de mes sincères salutations.

${user?.name}
${user?.fonction}

Visa DAF\t\t\tVisa DT\t\t\tApprobation DG
☐ oui\t\t\t☐ oui\t\t\t☐ oui
☐ non\t\t\t☐ non\t\t\t☐ non
Motif :\t\t\tMotif :\t\t\tMotif :`;
  };

  const getDestinataire = () => {
    // Déterminer le destinataire selon la hiérarchie
    if (user?.role === 'agent' || user?.role === 'gestionnaire') {
      return 'Monsieur le Directeur Général';
    } else if (user?.role === 'rh') {
      return 'Monsieur le Directeur Général';
    }
    return 'Monsieur le Directeur Général';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un nouveau mémorandum</CardTitle>
        <p className="text-sm text-gray-600">
          Suivez le format officiel CSE pour vos mémorandums
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* En-tête du mémorandum */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-lg">En-tête du mémorandum</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="number">Numéro du mémorandum</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                  placeholder="N°XXX/2025/CSE/XX/XX"
                  required
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input value={getCurrentDate()} disabled className="bg-gray-100" />
              </div>
            </div>

            <div>
              <Label htmlFor="object">Objet</Label>
              <Input
                id="object"
                value={formData.object}
                onChange={(e) => setFormData(prev => ({ ...prev, object: e.target.value }))}
                placeholder="Objet du mémorandum"
                required
              />
            </div>
          </div>

          {/* Contenu principal */}
          <div>
            <Label htmlFor="content">Contenu du mémorandum</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={8}
              placeholder="Rédigez le contenu de votre mémorandum..."
              required
            />
          </div>

          {/* Codes budgétaires (optionnel) */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold">Codes budgétaires (optionnel)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="projectCode">Code projet</Label>
                <Input
                  id="projectCode"
                  value={formData.projectCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectCode: e.target.value }))}
                  placeholder="Ex: 050"
                />
              </div>
              <div>
                <Label htmlFor="componentCode">Code composante</Label>
                <Input
                  id="componentCode"
                  value={formData.componentCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, componentCode: e.target.value }))}
                  placeholder="Ex: 05009"
                />
              </div>
              <div>
                <Label htmlFor="activityCode">Code activité</Label>
                <Input
                  id="activityCode"
                  value={formData.activityCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, activityCode: e.target.value }))}
                  placeholder="Ex: 050090101"
                />
              </div>
            </div>
          </div>

          {/* Métadonnées */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="information">Information</SelectItem>
                  <SelectItem value="directive">Directive</SelectItem>
                  <SelectItem value="rappel">Rappel</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priorité</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Création...' : 'Créer le mémorandum'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MemorandumForm;
