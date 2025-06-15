
export interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  managerComment?: string;
  approvedBy?: string;
  approvedAt?: string;
}

const STORAGE_KEY = 'leave_requests';

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
    submittedAt: '2024-05-25',
    managerComment: 'Approuvé, bon rétablissement',
    approvedBy: 'Manager RH',
    approvedAt: '2024-05-26'
  },
  {
    id: '3',
    employeeName: 'Paul Bernard',
    type: 'RTT',
    startDate: '2024-06-03',
    endDate: '2024-06-03',
    reason: 'Récupération',
    status: 'rejected',
    submittedAt: '2024-05-22',
    managerComment: 'Charge de travail trop importante cette semaine',
    approvedBy: 'Manager RH',
    approvedAt: '2024-05-23'
  },
];

export const leaveRequestsService = {
  getAllRequests: (): LeaveRequest[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockLeaveRequests));
      return mockLeaveRequests;
    }
    return JSON.parse(stored);
  },

  createRequest: (request: Omit<LeaveRequest, 'id' | 'submittedAt' | 'status'>): LeaveRequest => {
    const requests = leaveRequestsService.getAllRequests();
    const newRequest: LeaveRequest = {
      ...request,
      id: Date.now().toString(),
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    
    const updatedRequests = [newRequest, ...requests];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
    return newRequest;
  },

  updateRequest: (id: string, updates: Partial<LeaveRequest>): LeaveRequest | null => {
    const requests = leaveRequestsService.getAllRequests();
    const requestIndex = requests.findIndex(req => req.id === id);
    
    if (requestIndex === -1) return null;
    
    const updatedRequest = { ...requests[requestIndex], ...updates };
    requests[requestIndex] = updatedRequest;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    return updatedRequest;
  },

  deleteRequest: (id: string): boolean => {
    const requests = leaveRequestsService.getAllRequests();
    const filteredRequests = requests.filter(req => req.id !== id);
    
    if (filteredRequests.length === requests.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRequests));
    return true;
  },

  approveRequest: (id: string, managerName: string, comment?: string): LeaveRequest | null => {
    return leaveRequestsService.updateRequest(id, {
      status: 'approved',
      managerComment: comment,
      approvedBy: managerName,
      approvedAt: new Date().toISOString().split('T')[0]
    });
  },

  rejectRequest: (id: string, managerName: string, comment?: string): LeaveRequest | null => {
    return leaveRequestsService.updateRequest(id, {
      status: 'rejected',
      managerComment: comment,
      approvedBy: managerName,
      approvedAt: new Date().toISOString().split('T')[0]
    });
  }
};
