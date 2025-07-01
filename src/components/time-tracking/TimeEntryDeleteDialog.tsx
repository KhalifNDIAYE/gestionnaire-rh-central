
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { TimeEntry } from '@/types/timeTracking';
import { timeTrackingService } from '@/services/timeTrackingService';

interface TimeEntryDeleteDialogProps {
  entry: TimeEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const TimeEntryDeleteDialog = ({ entry, isOpen, onClose, onDelete }: TimeEntryDeleteDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!entry) return;

    setIsLoading(true);
    try {
      await timeTrackingService.deleteTimeEntry(entry.id);
      
      toast({
        title: 'Succès',
        description: 'Pointage supprimé avec succès'
      });
      
      onDelete();
      onClose();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le pointage',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le pointage</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le pointage de {entry?.employeeName} du {entry?.date} ?
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimeEntryDeleteDialog;
