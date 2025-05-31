
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { memorandumService, Memorandum } from '../../services/memorandumService';
import { useAuth } from '../../contexts/AuthContext';
import { Check, X, Eye, Clock } from 'lucide-react';

interface MemorandumListProps {
  showValidationActions?: boolean;
  validationLevel?: 1 | 2 | 3;
  refreshTrigger?: number;
}

const MemorandumList = ({ showValidationActions = false, validationLevel = 1, refreshTrigger }: MemorandumListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [memorandums, setMemorandums] = useState<Memorandum[]>([]);
  const [loading, setLoading] = useState(true);
  const [validationComment, setValidationComment] = useState('');
  const [selectedMemorandum, setSelectedMemorandum] = useState<Memorandum | null>(null);

  useEffect(() => {
    loadMemorandums();
  }, [refreshTrigger]);

  const loadMemorandums = async () => {
    try {
      let data: Memorandum[];
      if (showValidationActions) {
        const statusMap = {
          1: 'level1_pending',
          2: 'level2_pending',
          3: 'level3_pending'
        } as const;
        data = await memorandumService.getMemorandumsByStatus(statusMap[validationLevel]);
      } else {
        data = await memorandumService.getMemorandums();
      }
      setMemorandums(data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les mémorandums.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = async (memorandumId: string, action: 'approved' | 'rejected') => {
    if (!user) return;

    try {
      await memorandumService.validateMemorandum(
        memorandumId,
        validationLevel,
        action,
        { id: user.id, name: user.name, role: user.role },
        validationComment || undefined
      );

      toast({
        title: action === 'approved' ? 'Mémorandum approuvé' : 'Mémorandum rejeté',
        description: `Le mémorandum a été ${action === 'approved' ? 'approuvé' : 'rejeté'} avec succès.`,
      });

      setValidationComment('');
      loadMemorandums();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de traiter la validation.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: Memorandum['status']) => {
    const statusConfig = {
      draft: { label: 'Brouillon', variant: 'secondary' as const },
      level1_pending: { label: 'En attente niveau 1', variant: 'default' as const },
      level2_pending: { label: 'En attente niveau 2', variant: 'default' as const },
      level3_pending: { label: 'En attente niveau 3', variant: 'default' as const },
      approved: { label: 'Approuvé', variant: 'default' as const },
      rejected: { label: 'Rejeté', variant: 'destructive' as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: Memorandum['priority']) => {
    const priorityConfig = {
      low: { label: 'Faible', variant: 'secondary' as const },
      medium: { label: 'Moyenne', variant: 'default' as const },
      high: { label: 'Élevée', variant: 'destructive' as const },
    };

    const config = priorityConfig[priority];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Clock className="w-6 h-6 animate-spin mr-2" />
            Chargement des mémorandums...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {memorandums.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            {showValidationActions 
              ? 'Aucun mémorandum en attente de validation à ce niveau.'
              : 'Aucun mémorandum disponible.'
            }
          </CardContent>
        </Card>
      ) : (
        memorandums.map((memorandum) => (
          <Card key={memorandum.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{memorandum.title}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Par {memorandum.authorName}</span>
                    <span>•</span>
                    <span>{new Date(memorandum.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {getStatusBadge(memorandum.status)}
                  {getPriorityBadge(memorandum.priority)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 line-clamp-3">{memorandum.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Catégorie: {memorandum.category}</span>
                    {memorandum.expirationDate && (
                      <span>Expire le: {new Date(memorandum.expirationDate).toLocaleDateString('fr-FR')}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedMemorandum(memorandum)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{selectedMemorandum?.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Contenu</h4>
                            <p className="text-gray-700">{selectedMemorandum?.content}</p>
                          </div>
                          
                          {selectedMemorandum?.validationHistory.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Historique de validation</h4>
                              <div className="space-y-2">
                                {selectedMemorandum.validationHistory.map((step, index) => (
                                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium">
                                        Niveau {step.level} - {step.validatorName} ({step.validatorRole})
                                      </span>
                                      <Badge variant={step.action === 'approved' ? 'default' : 'destructive'}>
                                        {step.action === 'approved' ? 'Approuvé' : 'Rejeté'}
                                      </Badge>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {new Date(step.timestamp).toLocaleString('fr-FR')}
                                    </div>
                                    {step.comment && (
                                      <div className="text-sm mt-2">
                                        <strong>Commentaire:</strong> {step.comment}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {showValidationActions && (
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Check className="w-4 h-4 mr-1" />
                              Approuver
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Approuver le mémorandum</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="comment">Commentaire (optionnel)</Label>
                                <Textarea
                                  id="comment"
                                  value={validationComment}
                                  onChange={(e) => setValidationComment(e.target.value)}
                                  placeholder="Ajoutez un commentaire..."
                                />
                              </div>
                              <Button
                                onClick={() => handleValidation(memorandum.id, 'approved')}
                                className="w-full"
                              >
                                Confirmer l'approbation
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <X className="w-4 h-4 mr-1" />
                              Rejeter
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Rejeter le mémorandum</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="rejection-comment">Motif du rejet</Label>
                                <Textarea
                                  id="rejection-comment"
                                  value={validationComment}
                                  onChange={(e) => setValidationComment(e.target.value)}
                                  placeholder="Précisez le motif du rejet..."
                                  required
                                />
                              </div>
                              <Button
                                onClick={() => handleValidation(memorandum.id, 'rejected')}
                                variant="destructive"
                                className="w-full"
                                disabled={!validationComment.trim()}
                              >
                                Confirmer le rejet
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default MemorandumList;
