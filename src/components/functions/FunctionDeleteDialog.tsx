
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { functionsService, JobFunction } from '../../services/functionsService';

interface FunctionDeleteDialogProps {
  jobFunction: JobFunction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFunctionDeleted: () => void;
}

const FunctionDeleteDialog = ({ 
  jobFunction, 
  open, 
  onOpenChange, 
  onFunctionDeleted 
}: FunctionDeleteDialogProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!jobFunction) return;

    try {
      await functionsService.deleteFunction(jobFunction.id);
      toast({
        title: "Succès",
        description: "Fonction supprimée avec succès",
      });
      onOpenChange(false);
      onFunctionDeleted();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la fonction",
        variant: "destructive",
      });
    }
  };

  if (!jobFunction) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer la fonction "{jobFunction.title}" ?
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FunctionDeleteDialog;
