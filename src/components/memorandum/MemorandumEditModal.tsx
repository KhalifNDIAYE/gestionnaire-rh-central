
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { memorandumService, Memorandum } from '../../services/memorandumService';

interface MemorandumEditModalProps {
  memorandum: Memorandum;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MemorandumEditModal = ({ memorandum, isOpen, onClose, onSuccess }: MemorandumEditModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    category: 'information' | 'directive' | 'rappel' | 'urgent';
    priority: 'low' | 'medium' | 'high';
  }>({
    title: '',
    content: '',
    category: 'information',
    priority: 'low',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (memorandum) {
      setFormData({
        title: memorandum.title,
        content: memorandum.content,
        category: memorandum.category,
        priority: memorandum.priority,
      });
    }
  }, [memorandum]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await memorandumService.updateMemorandum(memorandum.id, formData);
      
      toast({
        title: 'Mémorandum modifié',
        description: 'Le mémorandum a été modifié avec succès.',
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error updating memorandum:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le mémorandum.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le mémorandum</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={10}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
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
              <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Modification...' : 'Modifier'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MemorandumEditModal;
