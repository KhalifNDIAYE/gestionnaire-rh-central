
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type TimeEntry = Tables<'time_entries'> & {
  employeeName: string;
};

export interface TimeTrackingStats {
  totalHours: number;
  averageHours: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  currentMonth: {
    totalHours: number;
    workingDays: number;
    presentDays: number;
  };
}

export interface CreateTimeEntryRequest {
  employeeId: string;
  employeeName: string;
  type: 'clock-in' | 'clock-out' | 'break-start' | 'break-end';
  notes?: string;
}

export interface UpdateTimeEntryRequest {
  clock_in?: string;
  clock_out?: string;
  break_start?: string;
  break_end?: string;
  notes?: string;
}

const calculateTotalHours = (entry: Partial<TimeEntry>): number => {
  if (!entry.clock_in || !entry.clock_out) return 0;
  
  const clockIn = new Date(`1970-01-01T${entry.clock_in}:00`);
  const clockOut = new Date(`1970-01-01T${entry.clock_out}:00`);
  
  let totalMinutes = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60);
  
  // Soustraire la pause si elle existe
  if (entry.break_start && entry.break_end) {
    const breakStart = new Date(`1970-01-01T${entry.break_start}:00`);
    const breakEnd = new Date(`1970-01-01T${entry.break_end}:00`);
    const breakMinutes = (breakEnd.getTime() - breakStart.getTime()) / (1000 * 60);
    totalMinutes -= breakMinutes;
  }
  
  return Math.max(0, totalMinutes / 60);
};

const determineStatus = (entry: Partial<TimeEntry>): 'present' | 'absent' | 'late' | 'partial' => {
  if (!entry.clock_in) return 'absent';
  if (!entry.clock_out) return 'partial';
  
  const clockIn = new Date(`1970-01-01T${entry.clock_in}:00`);
  const standardStart = new Date(`1970-01-01T08:00:00`);
  
  if (clockIn > standardStart) return 'late';
  return 'present';
};

export const timeTrackingService = {
  // Récupérer toutes les entrées de pointage avec les noms des employés
  async getTimeEntries(): Promise<TimeEntry[]> {
    try {
      console.log('Fetching time entries from Supabase...');
      
      const { data: timeEntries, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          employees!inner(name)
        `)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching time entries:', error);
        throw new Error(`Erreur lors de la récupération des pointages: ${error.message}`);
      }
      
      // Transformer les données pour inclure le nom de l'employé
      const entriesWithNames: TimeEntry[] = (timeEntries || []).map(entry => ({
        ...entry,
        employeeName: (entry.employees as any)?.name || 'Inconnu'
      }));
      
      console.log('Time entries fetched successfully:', entriesWithNames.length);
      return entriesWithNames;
    } catch (error) {
      console.error('Error in getTimeEntries:', error);
      throw error;
    }
  },

  // Récupérer les entrées par employé
  async getTimeEntriesByEmployee(employeeId: string): Promise<TimeEntry[]> {
    try {
      console.log('Fetching time entries by employee:', employeeId);
      
      const { data: timeEntries, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          employees!inner(name)
        `)
        .eq('employee_id', employeeId)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching time entries by employee:', error);
        throw new Error(`Erreur lors de la récupération des pointages: ${error.message}`);
      }
      
      const entriesWithNames: TimeEntry[] = (timeEntries || []).map(entry => ({
        ...entry,
        employeeName: (entry.employees as any)?.name || 'Inconnu'
      }));
      
      return entriesWithNames;
    } catch (error) {
      console.error('Error in getTimeEntriesByEmployee:', error);
      return [];
    }
  },

  // Récupérer les entrées par date
  async getTimeEntriesByDate(date: string): Promise<TimeEntry[]> {
    try {
      console.log('Fetching time entries by date:', date);
      
      const { data: timeEntries, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          employees!inner(name)
        `)
        .eq('date', date)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching time entries by date:', error);
        throw new Error(`Erreur lors de la récupération des pointages: ${error.message}`);
      }
      
      const entriesWithNames: TimeEntry[] = (timeEntries || []).map(entry => ({
        ...entry,
        employeeName: (entry.employees as any)?.name || 'Inconnu'
      }));
      
      return entriesWithNames;
    } catch (error) {
      console.error('Error in getTimeEntriesByDate:', error);
      return [];
    }
  },

  // Créer une nouvelle entrée de pointage
  async createTimeEntry(data: CreateTimeEntryRequest): Promise<TimeEntry> {
    try {
      console.log('Creating time entry:', data);
      
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      
      // Vérifier s'il existe déjà une entrée pour cet employé aujourd'hui
      const { data: existingEntry, error: fetchError } = await supabase
        .from('time_entries')
        .select('*')
        .eq('employee_id', data.employeeId)
        .eq('date', today)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(`Erreur lors de la vérification: ${fetchError.message}`);
      }
      
      if (existingEntry) {
        // Mettre à jour l'entrée existante
        const updateData: any = {};
        
        switch (data.type) {
          case 'clock-in':
            updateData.clock_in = now;
            break;
          case 'clock-out':
            updateData.clock_out = now;
            break;
          case 'break-start':
            updateData.break_start = now;
            break;
          case 'break-end':
            updateData.break_end = now;
            break;
        }
        
        if (data.notes) updateData.notes = data.notes;
        
        // Calculer les nouvelles heures totales et le statut
        const updatedEntry = { ...existingEntry, ...updateData };
        updateData.total_hours = calculateTotalHours(updatedEntry);
        updateData.status = determineStatus(updatedEntry);
        
        const { data: updated, error: updateError } = await supabase
          .from('time_entries')
          .update(updateData)
          .eq('id', existingEntry.id)
          .select()
          .single();
        
        if (updateError) {
          throw new Error(`Erreur lors de la mise à jour: ${updateError.message}`);
        }
        
        return {
          ...updated,
          employeeName: data.employeeName
        };
      } else {
        // Créer une nouvelle entrée
        const newEntryData: TablesInsert<'time_entries'> = {
          employee_id: data.employeeId,
          date: today,
          notes: data.notes
        };
        
        switch (data.type) {
          case 'clock-in':
            newEntryData.clock_in = now;
            break;
          case 'clock-out':
            newEntryData.clock_out = now;
            break;
          case 'break-start':
            newEntryData.break_start = now;
            break;
          case 'break-end':
            newEntryData.break_end = now;
            break;
        }
        
        newEntryData.total_hours = calculateTotalHours(newEntryData);
        newEntryData.status = determineStatus(newEntryData);
        
        const { data: created, error: createError } = await supabase
          .from('time_entries')
          .insert(newEntryData)
          .select()
          .single();
        
        if (createError) {
          throw new Error(`Erreur lors de la création: ${createError.message}`);
        }
        
        return {
          ...created,
          employeeName: data.employeeName
        };
      }
    } catch (error) {
      console.error('Error creating time entry:', error);
      throw error;
    }
  },

  // Mettre à jour une entrée de pointage
  async updateTimeEntry(id: string, data: UpdateTimeEntryRequest): Promise<TimeEntry> {
    try {
      console.log('Updating time entry:', id, data);
      
      // Calculer les nouvelles heures totales et le statut
      const updateData = {
        ...data,
        total_hours: calculateTotalHours(data),
        status: determineStatus(data)
      };
      
      const { data: updated, error } = await supabase
        .from('time_entries')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          employees!inner(name)
        `)
        .single();
      
      if (error) {
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
      }
      
      return {
        ...updated,
        employeeName: (updated.employees as any)?.name || 'Inconnu'
      };
    } catch (error) {
      console.error('Error updating time entry:', error);
      throw error;
    }
  },

  // Supprimer une entrée de pointage
  async deleteTimeEntry(id: string): Promise<void> {
    try {
      console.log('Deleting time entry:', id);
      
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }
      
      console.log('Time entry deleted successfully');
    } catch (error) {
      console.error('Error deleting time entry:', error);
      throw error;
    }
  },

  // Obtenir les statistiques de pointage
  async getTimeTrackingStats(employeeId?: string): Promise<TimeTrackingStats> {
    try {
      console.log('Calculating time tracking stats for employee:', employeeId);
      
      let query = supabase.from('time_entries').select('*');
      
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      const { data: entries, error } = await query;
      
      if (error) {
        throw new Error(`Erreur lors du calcul des statistiques: ${error.message}`);
      }
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const currentMonthEntries = (entries || []).filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
      });
      
      const totalHours = (entries || []).reduce((sum, entry) => sum + (entry.total_hours || 0), 0);
      const presentDays = (entries || []).filter(entry => entry.status === 'present').length;
      const absentDays = (entries || []).filter(entry => entry.status === 'absent').length;
      const lateDays = (entries || []).filter(entry => entry.status === 'late').length;
      
      const currentMonthHours = currentMonthEntries.reduce((sum, entry) => sum + (entry.total_hours || 0), 0);
      const currentMonthPresent = currentMonthEntries.filter(entry => entry.status === 'present').length;
      
      return {
        totalHours,
        averageHours: (entries || []).length > 0 ? totalHours / (entries || []).length : 0,
        presentDays,
        absentDays,
        lateDays,
        currentMonth: {
          totalHours: currentMonthHours,
          workingDays: 22, // Approximation des jours ouvrables
          presentDays: currentMonthPresent
        }
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        totalHours: 0,
        averageHours: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
        currentMonth: {
          totalHours: 0,
          workingDays: 0,
          presentDays: 0
        }
      };
    }
  }
};
