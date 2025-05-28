
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { CalendarIcon, Plus, Check, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeName: 'Jean Dupont',
    type: 'Congés payés',
    startDate: '2024-06-15',
    endDate: '2024-06-20',
    reason: 'Vacances en famille',
    status: 'pending',
    submittedAt: '2024-05-20'
  },
  {
    id: '2',
    employeeName: 'Marie Martin',
    type: 'Congé maladie',
    startDate: '2024-05-28',
    endDate: '2024-05-30',
    reason: 'Consultation médicale',
    status: 'approved',
    submittedAt: '2024-05-25'
  },
  {
    id: '3',
    employeeName: 'Paul Bernard',
    type: 'RTT',
    startDate: '2024-06-03',
    endDate: '2024-06-03',
    reason: 'Récupération',
    status: 'rejected',
    submittedAt: '2024-05-22'
  },
];

const LeaveRequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm();

  const isManager = user?.role === 'admin' || user?.role === 'rh' || user?.role === 'gestionnaire';

  const onSubmit = (data: any) => {
    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      employeeName: user?.name || '',
      type: data.type,
      startDate: format(data.startDate, 'yyyy-MM-dd'),
      endDate: format(data.endDate, 'yyyy-MM-dd'),
      reason: data.reason,
      status: 'pending',
      submittedAt: format(new Date(), 'yyyy-MM-dd')
    };
    
    setRequests([newRequest, ...requests]);
    setIsDialogOpen(false);
    form.reset();
  };

  const updateRequestStatus = (id: string, status: 'approved' | 'rejected') => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status } : req
    ));
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
                          <SelectItem value="paid-leave">Congés payés</SelectItem>
                          <SelectItem value="sick-leave">Congé maladie</SelectItem>
                          <SelectItem value="rtt">RTT</SelectItem>
                          <SelectItem value="maternity">Congé maternité</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
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
                {isManager && <TableHead>Actions</TableHead>}
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
                    <TableCell>
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateRequestStatus(request.id, 'approved')}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateRequestStatus(request.id, 'rejected')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveRequestsPage;
