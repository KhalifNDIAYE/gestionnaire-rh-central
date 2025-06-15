
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';

interface LeaveRequestApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (comment?: string) => void;
  onReject: (comment?: string) => void;
  requestDetails: {
    employeeName: string;
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
  };
}

const LeaveRequestApprovalModal = ({ 
  isOpen, 
  onClose, 
  onApprove, 
  onReject, 
  requestDetails 
}: LeaveRequestApprovalModalProps) => {
  const [comment, setComment] = useState('');

  const handleApprove = () => {
    onApprove(comment || undefined);
    setComment('');
    onClose();
  };

  const handleReject = () => {
    onReject(comment || undefined);
    setComment('');
    onClose();
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Traiter la demande de congé</DialogTitle>
          <DialogDescription>
            Demande de {requestDetails.employeeName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div><strong>Type :</strong> {requestDetails.type}</div>
            <div><strong>Période :</strong> {requestDetails.startDate} - {requestDetails.endDate}</div>
            <div><strong>Motif :</strong> {requestDetails.reason}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Commentaire (optionnel)</Label>
            <Textarea
              id="comment"
              placeholder="Ajoutez un commentaire pour justifier votre décision..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              className="flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Rejeter
            </Button>
            <Button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 flex items-center"
            >
              <Check className="w-4 h-4 mr-2" />
              Approuver
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequestApprovalModal;
