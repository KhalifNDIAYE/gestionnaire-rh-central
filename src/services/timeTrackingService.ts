
import { TimeEntry, TimeTrackingStats, CreateTimeEntryRequest, UpdateTimeEntryRequest } from '@/types/timeTracking';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';

// Données de test pour le développement
const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Jean Dupont',
    date: '2024-01-15',
    clockIn: '08:00',
    clockOut: '17:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    totalHours: 8,
    status: 'present',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T17:00:00Z'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Marie Martin',
    date: '2024-01-15',
    clockIn: '08:30',
    clockOut: '17:30',
    breakStart: '12:30',
    breakEnd: '13:30',
    totalHours: 8,
    status: 'late',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T17:30:00Z'
  },
  {
    id: '3',
    employeeId: '1',
    employeeName: 'Jean Dupont',
    date: '2024-01-16',
    clockIn: '08:00',
    totalHours: 0,
    status: 'partial',
    notes: 'Pointage en cours',
    createdAt: '2024-01-16T08:00:00Z',
    updatedAt: '2024-01-16T08:00:00Z'
  }
];

const calculateTotalHours = (entry: Partial<TimeEntry>): number => {
  if (!entry.clockIn || !entry.clockOut) return 0;
  
  const clockIn = new Date(`1970-01-01T${entry.clockIn}:00`);
  const clockOut = new Date(`1970-01-01T${entry.clockOut}:00`);
  
  let totalMinutes = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60);
  
  // Soustraire la pause si elle existe
  if (entry.breakStart && entry.breakEnd) {
    const breakStart = new Date(`1970-01-01T${entry.breakStart}:00`);
    const breakEnd = new Date(`1970-01-01T${entry.breakEnd}:00`);
    const breakMinutes = (breakEnd.getTime() - breakStart.getTime()) / (1000 * 60);
    totalMinutes -= breakMinutes;
  }
  
  return Math.max(0, totalMinutes / 60);
};

const determineStatus = (entry: Partial<TimeEntry>): TimeEntry['status'] => {
  if (!entry.clockIn) return 'absent';
  if (!entry.clockOut) return 'partial';
  
  const clockIn = new Date(`1970-01-01T${entry.clockIn}:00`);
  const standardStart = new Date(`1970-01-01T08:00:00`);
  
  if (clockIn > standardStart) return 'late';
  return 'present';
};

export const timeTrackingService = {
  // Récupérer toutes les entrées de pointage
  async getTimeEntries(): Promise<TimeEntry[]> {
    try {
      // Simulation d'appel API
      return new Promise((resolve) => {
        setTimeout(() => resolve([...mockTimeEntries]), 500);
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des pointages:', error);
      return mockTimeEntries;
    }
  },

  // Récupérer les entrées par employé
  async getTimeEntriesByEmployee(employeeId: string): Promise<TimeEntry[]> {
    try {
      const entries = await this.getTimeEntries();
      return entries.filter(entry => entry.employeeId === employeeId);
    } catch (error) {
      console.error('Erreur lors de la récupération des pointages par employé:', error);
      return [];
    }
  },

  // Récupérer les entrées par date
  async getTimeEntriesByDate(date: string): Promise<TimeEntry[]> {
    try {
      const entries = await this.getTimeEntries();
      return entries.filter(entry => entry.date === date);
    } catch (error) {
      console.error('Erreur lors de la récupération des pointages par date:', error);
      return [];
    }
  },

  // Créer une nouvelle entrée de pointage
  async createTimeEntry(data: CreateTimeEntryRequest): Promise<TimeEntry> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      
      // Vérifier s'il existe déjà une entrée pour cet employé aujourd'hui
      const existingEntries = await this.getTimeEntriesByEmployee(data.employeeId);
      const todayEntry = existingEntries.find(entry => entry.date === today);
      
      if (todayEntry) {
        // Mettre à jour l'entrée existante
        const updatedEntry = { ...todayEntry };
        
        switch (data.type) {
          case 'clock-in':
            updatedEntry.clockIn = now;
            break;
          case 'clock-out':
            updatedEntry.clockOut = now;
            break;
          case 'break-start':
            updatedEntry.breakStart = now;
            break;
          case 'break-end':
            updatedEntry.breakEnd = now;
            break;
        }
        
        updatedEntry.totalHours = calculateTotalHours(updatedEntry);
        updatedEntry.status = determineStatus(updatedEntry);
        updatedEntry.updatedAt = new Date().toISOString();
        if (data.notes) updatedEntry.notes = data.notes;
        
        // Mettre à jour dans les données mock
        const index = mockTimeEntries.findIndex(e => e.id === todayEntry.id);
        if (index !== -1) {
          mockTimeEntries[index] = updatedEntry;
        }
        
        return updatedEntry;
      } else {
        // Créer une nouvelle entrée
        const newEntry: TimeEntry = {
          id: Date.now().toString(),
          employeeId: data.employeeId,
          employeeName: data.employeeName,
          date: today,
          totalHours: 0,
          status: 'partial',
          notes: data.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        switch (data.type) {
          case 'clock-in':
            newEntry.clockIn = now;
            break;
          case 'clock-out':
            newEntry.clockOut = now;
            break;
          case 'break-start':
            newEntry.breakStart = now;
            break;
          case 'break-end':
            newEntry.breakEnd = now;
            break;
        }
        
        newEntry.totalHours = calculateTotalHours(newEntry);
        newEntry.status = determineStatus(newEntry);
        
        mockTimeEntries.push(newEntry);
        return newEntry;
      }
    } catch (error) {
      console.error('Erreur lors de la création du pointage:', error);
      throw error;
    }
  },

  // Mettre à jour une entrée de pointage
  async updateTimeEntry(id: string, data: UpdateTimeEntryRequest): Promise<TimeEntry> {
    try {
      const index = mockTimeEntries.findIndex(entry => entry.id === id);
      if (index === -1) {
        throw new Error('Entrée de pointage non trouvée');
      }
      
      const updatedEntry = {
        ...mockTimeEntries[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      updatedEntry.totalHours = calculateTotalHours(updatedEntry);
      updatedEntry.status = determineStatus(updatedEntry);
      
      mockTimeEntries[index] = updatedEntry;
      return updatedEntry;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du pointage:', error);
      throw error;
    }
  },

  // Supprimer une entrée de pointage
  async deleteTimeEntry(id: string): Promise<void> {
    try {
      const index = mockTimeEntries.findIndex(entry => entry.id === id);
      if (index === -1) {
        throw new Error('Entrée de pointage non trouvée');
      }
      
      mockTimeEntries.splice(index, 1);
    } catch (error) {
      console.error('Erreur lors de la suppression du pointage:', error);
      throw error;
    }
  },

  // Obtenir les statistiques de pointage
  async getTimeTrackingStats(employeeId?: string): Promise<TimeTrackingStats> {
    try {
      const entries = employeeId 
        ? await this.getTimeEntriesByEmployee(employeeId)
        : await this.getTimeEntries();
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const currentMonthEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
      });
      
      const totalHours = entries.reduce((sum, entry) => sum + entry.totalHours, 0);
      const presentDays = entries.filter(entry => entry.status === 'present').length;
      const absentDays = entries.filter(entry => entry.status === 'absent').length;
      const lateDays = entries.filter(entry => entry.status === 'late').length;
      
      const currentMonthHours = currentMonthEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
      const currentMonthPresent = currentMonthEntries.filter(entry => entry.status === 'present').length;
      
      return {
        totalHours,
        averageHours: entries.length > 0 ? totalHours / entries.length : 0,
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
      console.error('Erreur lors du calcul des statistiques:', error);
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
