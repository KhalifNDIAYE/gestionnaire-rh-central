
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { memorandumService, Memorandum } from '../../services/memorandumService';
import { useAuth } from '../../contexts/AuthContext';
import { Pencil, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import MemorandumEditModal from './MemorandumEditModal';

interface MemorandumActionsProps {
  memorandum: Memorandum;
  onUpdate: () => void;
  showEditDelete?: boolean;
}

const MemorandumActions = ({ memorandum, onUpdate, showEditDelete = false }: MemorandumActionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const canEditDelete = showEditDelete && user && (
    user.id === memorandum.authorId || 
    ['admin', 'gestionnaire'].includes(user.role)
  );

  const handleDelete = async () => {
    try {
      await memorandumService.deleteMemorandum(memorandum.id);
      toast({
        title: 'Mémorandum supprimé',
        description: 'Le mémorandum a été supprimé avec succès.',
      });
      onUpdate();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le mémorandum.',
        variant: 'destructive',
      });
    }
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    onUpdate();
  };

  if (!canEditDelete) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsEditModalOpen(true)}
      >
        <Pencil className="w-4 h-4 mr-1" />
        Modifier
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash className="w-4 h-4 mr-1" />
            Supprimer
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce mémorandum ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MemorandumEditModal
        memorandum={memorandum}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default MemorandumActions;
