
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { TimeEntry, UpdateTimeEntryRequest } from '@/types/timeTracking';
import { timeTrackingService } from '@/services/timeTrackingService';

interface TimeEntryEditModalProps {
  entry: TimeEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const TimeEntryEditModal = ({ entry, isOpen, onClose, onUpdate }: TimeEntryEditModalProps) => {
  const [formData, setFormData] = useState<UpdateTimeEntryRequest>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (entry) {
      setFormData({
        clock_in: entry.clock_in || '',
        clock_out: entry.clock_out || '',
        break_start: entry.break_start || '',
        break_end: entry.break_end || '',
        notes: entry.notes || ''
      });
    }
  }, [entry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry) return;

    setIsLoading(true);
    try {
      await timeTrackingService.updateTimeEntry(entry.id, formData);
      
      toast({
        title: 'Succès',
        description: 'Pointage modifié avec succès'
      });
      
      onUpdate();
      onClose();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le pointage',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateTimeEntryRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le pointage</DialogTitle>
          <DialogDescription>
            Modifiez les informations de pointage pour {entry?.employeeName} du {entry?.date}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clockIn">Heure d'entrée</Label>
              <Input
                id="clockIn"
                type="time"
                value={formData.clock_in || ''}
                onChange={(e) => handleInputChange('clock_in', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="clockOut">Heure de sortie</Label>
              <Input
                id="clockOut"
                type="time"
                value={formData.clock_out || ''}
                onChange={(e) => handleInputChange('clock_out', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="breakStart">Début pause</Label>
              <Input
                id="breakStart"
                type="time"
                value={formData.break_start || ''}
                onChange={(e) => handleInputChange('break_start', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="breakEnd">Fin pause</Label>
              <Input
                id="breakEnd"
                type="time"
                value={formData.break_end || ''}
                onChange={(e) => handleInputChange('break_end', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Notes optionnelles..."
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Modification...' : 'Modifier'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TimeEntryEditModal;
