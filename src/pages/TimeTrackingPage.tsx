
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

import TimeTrackingHeader from '@/components/time-tracking/TimeTrackingHeader';
import ClockInOutButtons from '@/components/time-tracking/ClockInOutButtons';
import TimeEntryTable from '@/components/time-tracking/TimeEntryTable';
import TimeEntryEditModal from '@/components/time-tracking/TimeEntryEditModal';
import TimeEntryDeleteDialog from '@/components/time-tracking/TimeEntryDeleteDialog';
import TimeTrackingStatsComponent from '@/components/time-tracking/TimeTrackingStats';

import { TimeEntry, TimeTrackingStats } from '@/types/timeTracking';
import { timeTrackingService } from '@/services/timeTrackingService';

const TimeTrackingPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [stats, setStats] = useState<TimeTrackingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [entriesData, statsData] = await Promise.all([
        timeTrackingService.getTimeEntries(),
        timeTrackingService.getTimeTrackingStats()
      ]);
      
      setTimeEntries(entriesData);
      setStats(statsData);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données de pointage',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (entry: TimeEntry) => {
    setSelectedEntry(entry);
    setIsEditModalOpen(true);
  };

  const handleDelete = (entry: TimeEntry) => {
    setSelectedEntry(entry);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEntry(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedEntry(null);
  };

  const handleUpdate = () => {
    loadData();
  };

  // Filtrage des entrées
  const filteredEntries = timeEntries.filter(entry => {
    const matchesDate = !dateFilter || entry.date === dateFilter;
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    return matchesDate && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <TimeTrackingHeader />
        <div className="p-6 text-center">
          <p className="text-gray-500">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TimeTrackingHeader />

      <Tabs defaultValue="clock" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clock">Pointage</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="clock" className="space-y-6">
          <ClockInOutButtons
            employeeId={user?.id || '1'}
            employeeName={user?.name || 'Utilisateur'}
            onUpdate={handleUpdate}
          />
          
          {/* Affichage du dernier pointage du jour */}
          {(() => {
            const today = new Date().toISOString().split('T')[0];
            const todayEntry = timeEntries.find(entry => 
              entry.employeeId === (user?.id || '1') && entry.date === today
            );
            
            if (todayEntry) {
              return (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Pointage du jour</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Entrée:</span>
                      <span className="ml-2 font-medium">{todayEntry.clockIn || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Sortie:</span>
                      <span className="ml-2 font-medium">{todayEntry.clockOut || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Heures:</span>
                      <span className="ml-2 font-medium">{todayEntry.totalHours.toFixed(1)}h</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Statut:</span>
                      <span className="ml-2 font-medium capitalize">{todayEntry.status}</span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Filtres */}
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="dateFilter">Filtrer par date</Label>
              <Input
                id="dateFilter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="statusFilter">Filtrer par statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="present">Présent</SelectItem>
                  <SelectItem value="late">Retard</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="partial">Partiel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setDateFilter('');
                  setStatusFilter('all');
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </div>

          <TimeEntryTable
            entries={filteredEntries}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {stats && <TimeTrackingStatsComponent stats={stats} />}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <TimeEntryEditModal
        entry={selectedEntry}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdate}
      />

      <TimeEntryDeleteDialog
        entry={selectedEntry}
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleUpdate}
      />
    </div>
  );
};

export default TimeTrackingPage;
