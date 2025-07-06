
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Check, Clock, Edit, Trash2, X } from 'lucide-react';
import { LeaveRequest } from '@/services/leaveRequestsService';

interface LeaveRequestTableProps {
  requests: LeaveRequest[];
  isManager: boolean;
  onEdit: (request: LeaveRequest) => void;
  onDelete: (request: LeaveRequest) => void;
  onApproval: (request: LeaveRequest) => void;
}

const LeaveRequestTable = ({ 
  requests, 
  isManager, 
  onEdit, 
  onDelete, 
  onApproval 
}: LeaveRequestTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-600">
            <Check className="w-3 h-3 mr-1" />
            Approuvé
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <X className="w-3 h-3 mr-1" />
            Rejeté
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des demandes</CardTitle>
        <CardDescription>
          {requests.length} demande(s) trouvée(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {isManager && <TableHead>Employé</TableHead>}
              <TableHead>Type</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Motif</TableHead>
              <TableHead>Statut</TableHead>
              {isManager && <TableHead>Commentaire</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                {isManager && <TableCell className="font-medium">{request.employee_name}</TableCell>}
                <TableCell>{request.type}</TableCell>
                <TableCell>
                  {format(new Date(request.start_date), 'dd/MM/yyyy')} - {format(new Date(request.end_date), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                {isManager && (
                  <TableCell className="max-w-xs truncate">
                    {request.manager_comment || '-'}
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex space-x-2">
                    {isManager && request.status === 'pending' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onApproval(request)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Traiter
                      </Button>
                    ) : (
                      <>
                        {!isManager && request.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(request)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(request)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestTable;
