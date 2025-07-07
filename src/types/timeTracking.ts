
import { Tables } from '@/integrations/supabase/types';

export interface TimeEntry extends Tables<'time_entries'> {
  employeeName: string;
}

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
