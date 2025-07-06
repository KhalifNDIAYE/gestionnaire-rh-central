
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type LeaveRequest = Tables<'leave_requests'>;
export type CreateLeaveRequest = TablesInsert<'leave_requests'>;
export type UpdateLeaveRequest = TablesUpdate<'leave_requests'>;

export const leaveRequestsService = {
  getAllRequests: async (): Promise<LeaveRequest[]> => {
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leave requests:', error);
      throw error;
    }

    return data || [];
  },

  createRequest: async (request: Omit<CreateLeaveRequest, 'id' | 'created_at' | 'updated_at'>): Promise<LeaveRequest> => {
    const { data, error } = await supabase
      .from('leave_requests')
      .insert(request)
      .select()
      .single();

    if (error) {
      console.error('Error creating leave request:', error);
      throw error;
    }

    return data;
  },

  updateRequest: async (id: string, updates: UpdateLeaveRequest): Promise<LeaveRequest> => {
    const { data, error } = await supabase
      .from('leave_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating leave request:', error);
      throw error;
    }

    return data;
  },

  deleteRequest: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('leave_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting leave request:', error);
      throw error;
    }

    return true;
  },

  approveRequest: async (id: string, managerName: string, comment?: string): Promise<LeaveRequest> => {
    return leaveRequestsService.updateRequest(id, {
      status: 'approved',
      manager_comment: comment,
      approved_by: managerName,
      approved_at: new Date().toISOString().split('T')[0]
    });
  },

  rejectRequest: async (id: string, managerName: string, comment?: string): Promise<LeaveRequest> => {
    return leaveRequestsService.updateRequest(id, {
      status: 'rejected',
      manager_comment: comment,
      approved_by: managerName,
      approved_at: new Date().toISOString().split('T')[0]
    });
  }
};
