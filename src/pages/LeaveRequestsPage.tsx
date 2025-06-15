
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const isManager = user?.role === 'admin' || user?.role === 'rh' || user?.role === 'gestionnaire';

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const allRequests = leaveRequestsService.getAllRequests();
    setRequests(allRequests);
  };

  const onSubmit = (data: any) => {
    const newRequest = leaveRequestsService.createRequest({
      employeeName: user?.name || '',
      type: data.type,
      startDate: format(data.startDate, 'yyyy-MM-dd'),
      endDate: format(data.endDate, 'yyyy-MM-dd'),
      reason: data.reason
    });
    
    loadRequests();
    
    toast({
      title: "Demande créée",
      description: "Votre demande de congé a été soumise avec succès.",
    });
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

  const handleSaveEdit = (requestId: string, updates: Partial<LeaveRequest>) => {
    const updatedRequest = leaveRequestsService.updateRequest(requestId, updates);
    if (updatedRequest) {
      loadRequests();
      toast({
        title: "Demande modifiée",
        description: "Votre demande a été mise à jour avec succès.",
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

  const confirmDelete = () => {
    if (selectedRequest) {
      const success = leaveRequestsService.deleteRequest(selectedRequest.id);
      if (success) {
        loadRequests();
        toast({
          title: "Demande supprimée",
          description: "La demande a été supprimée avec succès.",
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

  const handleApprove = (comment?: string) => {
    if (selectedRequest) {
      const updatedRequest = leaveRequestsService.approveRequest(
        selectedRequest.id, 
        user?.name || 'Manager', 
        comment
      );
      if (updatedRequest) {
        loadRequests();
        toast({
          title: "Demande approuvée",
          description: `La demande de ${selectedRequest.employeeName} a été approuvée.`,
        });
      }
    }
    setSelectedRequest(null);
  };

  const handleReject = (comment?: string) => {
    if (selectedRequest) {
      const updatedRequest = leaveRequestsService.rejectRequest(
        selectedRequest.id, 
        user?.name || 'Manager', 
        comment
      );
      if (updatedRequest) {
        loadRequests();
        toast({
          title: "Demande rejetée",
          description: `La demande de ${selectedRequest.employeeName} a été rejetée.`,
        });
      }
    }
    setSelectedRequest(null);
  };

  const filteredRequests = isManager 
    ? requests 
    : requests.filter(req => req.employeeName === user?.name);

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
              employeeName: selectedRequest.employeeName,
              type: selectedRequest.type,
              startDate: format(new Date(selectedRequest.startDate), 'dd/MM/yyyy'),
              endDate: format(new Date(selectedRequest.endDate), 'dd/MM/yyyy'),
              reason: selectedRequest.reason
            }}
          />
        </>
      )}
    </div>
  );
};

export default LeaveRequestsPage;
