
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { settingsService, BudgetCode, BudgetCodeSettings as BudgetCodeSettingsType } from '../../services/settingsService';
import { Plus, Edit, Trash2 } from 'lucide-react';

const BudgetCodeSettings = () => {
  const [budgetCodes, setBudgetCodes] = useState<BudgetCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCode, setEditingCode] = useState<BudgetCode | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    libelle: '',
    codeProjet: '',
    codeComposante: '',
    codeActivite: '',
    active: true
  });

  useEffect(() => {
    loadBudgetCodes();
  }, []);

  const loadBudgetCodes = async () => {
    try {
      const settings = await settingsService.getSettings();
      setBudgetCodes(settings.budgetCodes.codes);
    } catch (error) {
      console.error('Error loading budget codes:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.libelle || !formData.codeProjet || !formData.codeComposante || !formData.codeActivite) {
      toast({
        title: "Champs requis",
        description: "Tous les champs sont obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let updatedCodes: BudgetCode[];
      
      if (editingCode) {
        // Modification
        updatedCodes = budgetCodes.map(code => 
          code.id === editingCode.id 
            ? { ...code, ...formData }
            : code
        );
      } else {
        // Ajout
        const newCode: BudgetCode = {
          id: Date.now().toString(),
          ...formData
        };
        updatedCodes = [...budgetCodes, newCode];
      }

      const budgetCodeSettings: BudgetCodeSettingsType = {
        codes: updatedCodes
      };

      await settingsService.updateBudgetCodeSettings(budgetCodeSettings);
      setBudgetCodes(updatedCodes);
      
      toast({
        title: "Code budgétaire sauvegardé",
        description: editingCode ? "Le code a été modifié avec succès." : "Le nouveau code a été ajouté avec succès.",
      });

      resetForm();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la sauvegarde.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (code: BudgetCode) => {
    setEditingCode(code);
    setFormData({
      libelle: code.libelle,
      codeProjet: code.codeProjet,
      codeComposante: code.codeComposante,
      codeActivite: code.codeActivite,
      active: code.active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce code budgétaire ?')) {
      return;
    }

    setLoading(true);
    try {
      const updatedCodes = budgetCodes.filter(code => code.id !== id);
      const budgetCodeSettings: BudgetCodeSettingsType = {
        codes: updatedCodes
      };

      await settingsService.updateBudgetCodeSettings(budgetCodeSettings);
      setBudgetCodes(updatedCodes);
      
      toast({
        title: "Code budgétaire supprimé",
        description: "Le code a été supprimé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    setLoading(true);
    try {
      const updatedCodes = budgetCodes.map(code => 
        code.id === id ? { ...code, active } : code
      );
      
      const budgetCodeSettings: BudgetCodeSettingsType = {
        codes: updatedCodes
      };

      await settingsService.updateBudgetCodeSettings(budgetCodeSettings);
      setBudgetCodes(updatedCodes);
      
      toast({
        title: "Statut mis à jour",
        description: `Le code a été ${active ? 'activé' : 'désactivé'}.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      libelle: '',
      codeProjet: '',
      codeComposante: '',
      codeActivite: '',
      active: true
    });
    setEditingCode(null);
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Codes Budgétaires</CardTitle>
        <CardDescription>
          Gérez les codes budgétaires utilisés dans les mémorandums. Les codes désactivés n'apparaîtront pas dans la liste déroulante.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCode ? 'Modifier le code budgétaire' : 'Ajouter un code budgétaire'}
                  </DialogTitle>
                  <DialogDescription>
                    Remplissez les informations du code budgétaire.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="libelle">Libellé</Label>
                    <Input
                      id="libelle"
                      value={formData.libelle}
                      onChange={(e) => setFormData(prev => ({ ...prev, libelle: e.target.value }))}
                      placeholder="Ex: EQUIPEMENTS BUREAUTIQUE ET INFORMATIQUE"
                    />
                  </div>
                  <div>
                    <Label htmlFor="codeProjet">Code projet</Label>
                    <Input
                      id="codeProjet"
                      value={formData.codeProjet}
                      onChange={(e) => setFormData(prev => ({ ...prev, codeProjet: e.target.value }))}
                      placeholder="Ex: 05006"
                    />
                  </div>
                  <div>
                    <Label htmlFor="codeComposante">Code composante</Label>
                    <Input
                      id="codeComposante"
                      value={formData.codeComposante}
                      onChange={(e) => setFormData(prev => ({ ...prev, codeComposante: e.target.value }))}
                      placeholder="Ex: 0500601"
                    />
                  </div>
                  <div>
                    <Label htmlFor="codeActivite">Code activité</Label>
                    <Input
                      id="codeActivite"
                      value={formData.codeActivite}
                      onChange={(e) => setFormData(prev => ({ ...prev, codeActivite: e.target.value }))}
                      placeholder="Ex: 050060101"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(active) => setFormData(prev => ({ ...prev, active }))}
                    />
                    <Label htmlFor="active">Actif</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={resetForm}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Libellé</TableHead>
                <TableHead>Code projet</TableHead>
                <TableHead>Code composante</TableHead>
                <TableHead>Code activité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetCodes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-medium">{code.libelle}</TableCell>
                  <TableCell>{code.codeProjet}</TableCell>
                  <TableCell>{code.codeComposante}</TableCell>
                  <TableCell>{code.codeActivite}</TableCell>
                  <TableCell>
                    <Switch
                      checked={code.active}
                      onCheckedChange={(active) => handleToggleActive(code.id, active)}
                      disabled={loading}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(code)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(code.id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetCodeSettings;
