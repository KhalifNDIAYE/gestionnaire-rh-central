
export interface TimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  breakStart?: string;
  breakEnd?: string;
  totalHours: number;
  status: 'present' | 'absent' | 'late' | 'partial';
  notes?: string;
  createdAt: string;
  updatedAt: string;
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
  clockIn?: string;
  clockOut?: string;
  breakStart?: string;
  breakEnd?: string;
  notes?: string;
}
