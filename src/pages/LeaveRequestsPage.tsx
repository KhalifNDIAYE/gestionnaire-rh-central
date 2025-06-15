import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Plus, Check, X, Clock, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { leaveRequestsService, LeaveRequest } from '@/services/leaveRequestsService';
import LeaveRequestEditModal from '@/components/leave-requests/LeaveRequestEditModal';
import LeaveRequestDeleteDialog from '@/components/leave-requests/LeaveRequestDeleteDialog';
import LeaveRequestApprovalModal from '@/components/leave-requests/LeaveRequestApprovalModal';
import { useToast } from '@/hooks/use-toast';

const LeaveRequestsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const form = useForm();

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
    setIsDialogOpen(false);
    form.reset();
    
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

  const filteredRequests = isManager 
    ? requests 
    : requests.filter(req => req.employeeName === user?.name);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Demandes de congés</h1>
          <p className="text-gray-600">
            {isManager ? 'Gérer les demandes de congés' : 'Mes demandes de congés'}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvelle demande de congé</DialogTitle>
              <DialogDescription>
                Remplissez les détails de votre demande
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de congé</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Congés payés">Congés payés</SelectItem>
                          <SelectItem value="Congé maladie">Congé maladie</SelectItem>
                          <SelectItem value="RTT">RTT</SelectItem>
                          <SelectItem value="Congé maternité">Congé maternité</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de début</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de fin</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motif</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Expliquez le motif de votre demande..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Soumettre la demande
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des demandes</CardTitle>
          <CardDescription>
            {filteredRequests.length} demande(s) trouvée(s)
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
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  {isManager && <TableCell className="font-medium">{request.employeeName}</TableCell>}
                  <TableCell>{request.type}</TableCell>
                  <TableCell>
                    {format(new Date(request.startDate), 'dd/MM/yyyy')} - {format(new Date(request.endDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  {isManager && (
                    <TableCell className="max-w-xs truncate">
                      {request.managerComment || '-'}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex space-x-2">
                      {isManager && request.status === 'pending' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApproval(request)}
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
                                onClick={() => handleEdit(request)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(request)}
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
