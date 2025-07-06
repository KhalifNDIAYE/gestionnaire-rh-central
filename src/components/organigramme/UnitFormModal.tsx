
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrganizationalUnit, organigrammeService } from '../../services/organigrammeService';

interface UnitFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unit?: OrganizationalUnit | null;
  parentUnits: OrganizationalUnit[];
  onUnitSaved: () => void;
}

const UnitFormModal = ({ 
  open, 
  onOpenChange, 
  unit, 
  parentUnits, 
  onUnitSaved 
}: UnitFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'service' as OrganizationalUnit['type'],
    description: '',
    parent_id: '',
    manager_name: '',
    level: 0,
    color: '#6b7280',
  });

  useEffect(() => {
    if (unit) {
      setFormData({
        name: unit.name,
        type: unit.type,
        description: unit.description,
        parent_id: unit.parent_id || '',
        manager_name: unit.manager_name || '',
        level: unit.level,
        color: unit.color,
      });
    } else {
      setFormData({
        name: '',
        type: 'service',
        description: '',
        parent_id: '',
        manager_name: '',
        level: 0,
        color: '#6b7280',
      });
    }
  }, [unit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const parentUnit = parentUnits.find(p => p.id === formData.parent_id);
      const level = parentUnit ? parentUnit.level + 1 : 0;

      const unitData = {
        ...formData,
        parent_id: formData.parent_id || null,
        level,
        employees: unit?.employees || [],
      };

      if (unit) {
        await organigrammeService.updateUnit(unit.id, unitData);
      } else {
        await organigrammeService.createUnit(unitData);
      }

      onUnitSaved();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const typeColors = {
    direction: '#22c55e',
    unite: '#84cc16',
    cellule: '#f97316',
    comite: '#ef4444',
    service: '#6b7280',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {unit ? 'Modifier l\'unité' : 'Nouvelle unité organisationnelle'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de l'unité</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: OrganizationalUnit['type']) => 
                setFormData({ 
                  ...formData, 
                  type: value,
                  color: typeColors[value]
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direction">Direction</SelectItem>
                <SelectItem value="unite">Unité</SelectItem>
                <SelectItem value="cellule">Cellule</SelectItem>
                <SelectItem value="comite">Comité</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="parent_id">Unité parent</Label>
            <Select 
              value={formData.parent_id} 
              onValueChange={(value) => setFormData({ ...formData, parent_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une unité parent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucune (Racine)</SelectItem>
                {parentUnits
                  .filter(p => p.id !== unit?.id) // Éviter la référence circulaire
                  .map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="manager_name">Responsable</Label>
            <Input
              id="manager_name"
              value={formData.manager_name}
              onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
              placeholder="Nom du responsable"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sauvegarde...' : (unit ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UnitFormModal;
