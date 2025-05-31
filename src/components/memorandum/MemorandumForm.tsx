
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
    title: '',
    content: '',
    category: 'information' as const,
    priority: 'medium' as const,
    targetAudience: ['tous'],
    expirationDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await memorandumService.createMemorandum({
        ...formData,
        authorId: user.id,
        authorName: user.name,
        expirationDate: formData.expirationDate || undefined
      });

      toast({
        title: 'Mémorandum créé',
        description: 'Le mémorandum a été soumis pour validation.',
      });

      setFormData({
        title: '',
        content: '',
        category: 'information',
        priority: 'medium',
        targetAudience: ['tous'],
        expirationDate: ''
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le mémorandum.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un nouveau mémorandum</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={6}
              required
            />
          </div>

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

          <div>
            <Label htmlFor="expirationDate">Date d'expiration (optionnel)</Label>
            <Input
              id="expirationDate"
              type="date"
              value={formData.expirationDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
            />
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
