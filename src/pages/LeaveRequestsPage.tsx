
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { leaveRequestsService, LeaveRequest } from '@/services/leaveRequestsService';
import { useToast } from '@/hooks/use-toast';
import LeaveRequestForm from '@/components/leave-requests/LeaveRequestForm';
import LeaveRequestsHeader from '@/components/leave-requests/LeaveRequestsHeader';
import LeaveRequestTable from '@/components/leave-requests/LeaveRequestTable';
import LeaveRequestEditModal from '@/components/leave-requests/LeaveRequestEditModal';
import LeaveRequestDeleteDialog from '@/components/leave-requests/LeaveRequestDeleteDialog';
import LeaveRequestApprovalModal from '@/components/leave-requests/LeaveRequestApprovalModal';

const LeaveRequestsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const isManager = user?.role === 'admin' || user?.role === 'rh' || user?.role === 'gestionnaire';

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const allRequests = await leaveRequestsService.getAllRequests();
      setRequests(allRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de congés.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await leaveRequestsService.createRequest({
        employee_name: user?.name || '',
        type: data.type,
        start_date: format(data.startDate, 'yyyy-MM-dd'),
        end_date: format(data.endDate, 'yyyy-MM-dd'),
        reason: data.reason
      });
      
      await loadRequests();
      
      toast({
        title: "Demande créée",
        description: "Votre demande de congé a été soumise avec succès.",
      });
    } catch (error) {
      console.error('Error creating request:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la demande de congé.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (request: LeaveRequest) => {
    if (request.status !== 'pending') {
      toast({
        title: "Modification impossible",
        description: "Seules les demandes en attente peuvent être modifiées.",
        variant: "destructive"
      });
      return;
    }
    setSelectedRequest(request);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (requestId: string, updates: Partial<LeaveRequest>) => {
    try {
      await leaveRequestsService.updateRequest(requestId, updates);
      await loadRequests();
      toast({
        title: "Demande modifiée",
        description: "Votre demande a été mise à jour avec succès.",
      });
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la demande.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = (request: LeaveRequest) => {
    if (request.status !== 'pending') {
      toast({
        title: "Suppression impossible",
        description: "Seules les demandes en attente peuvent être supprimées.",
        variant: "destructive"
      });
      return;
    }
    setSelectedRequest(request);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedRequest) {
      try {
        await leaveRequestsService.deleteRequest(selectedRequest.id);
        await loadRequests();
        toast({
          title: "Demande supprimée",
          description: "La demande a été supprimée avec succès.",
        });
      } catch (error) {
        console.error('Error deleting request:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la demande.",
          variant: "destructive"
        });
      }
    }
    setDeleteDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleApproval = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setApprovalModalOpen(true);
  };

  const handleApprove = async (comment?: string) => {
    if (selectedRequest) {
      try {
        await leaveRequestsService.approveRequest(
          selectedRequest.id, 
          user?.name || 'Manager', 
          comment
        );
        await loadRequests();
        toast({
          title: "Demande approuvée",
          description: `La demande de ${selectedRequest.employee_name} a été approuvée.`,
        });
      } catch (error) {
        console.error('Error approving request:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'approuver la demande.",
          variant: "destructive"
        });
      }
    }
    setSelectedRequest(null);
  };

  const handleReject = async (comment?: string) => {
    if (selectedRequest) {
      try {
        await leaveRequestsService.rejectRequest(
          selectedRequest.id, 
          user?.name || 'Manager', 
          comment
        );
        await loadRequests();
        toast({
          title: "Demande rejetée",
          description: `La demande de ${selectedRequest.employee_name} a été rejetée.`,
        });
      } catch (error) {
        console.error('Error rejecting request:', error);
        toast({
          title: "Erreur",
          description: "Impossible de rejeter la demande.",
          variant: "destructive"
        });
      }
    }
    setSelectedRequest(null);
  };

  const filteredRequests = isManager 
    ? requests 
    : requests.filter(req => req.employee_name === user?.name);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des demandes de congés...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LeaveRequestsHeader isManager={isManager}>
        <LeaveRequestForm onSubmit={onSubmit} />
      </LeaveRequestsHeader>

      <LeaveRequestTable
        requests={filteredRequests}
        isManager={isManager}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onApproval={handleApproval}
      />

      {selectedRequest && (
        <>
          <LeaveRequestEditModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            request={selectedRequest}
            onSave={handleSaveEdit}
          />
          
          <LeaveRequestDeleteDialog
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={confirmDelete}
            requestType={selectedRequest.type}
          />
          
          <LeaveRequestApprovalModal
            isOpen={approvalModalOpen}
            onClose={() => setApprovalModalOpen(false)}
            onApprove={handleApprove}
            onReject={handleReject}
            requestDetails={{
              employeeName: selectedRequest.employee_name,
              type: selectedRequest.type,
              startDate: format(new Date(selectedRequest.start_date), 'dd/MM/yyyy'),
              endDate: format(new Date(selectedRequest.end_date), 'dd/MM/yyyy'),
              reason: selectedRequest.reason
            }}
          />
        </>
      )}
    </div>
  );
};

export default LeaveRequestsPage;
