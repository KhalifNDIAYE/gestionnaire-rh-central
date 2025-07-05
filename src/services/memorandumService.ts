
import { supabase } from '@/integrations/supabase/client';

export interface Memorandum {
  id: string;
  title: string;
  content: string;
  category: 'information' | 'directive' | 'rappel' | 'urgent';
  priority: 'low' | 'medium' | 'high';
  authorId: string;
  authorName: string;
  createdAt: string;
  status: 'draft' | 'level1_pending' | 'level2_pending' | 'level3_pending' | 'approved' | 'rejected';
  validationHistory: ValidationStep[];
  targetAudience: string[];
}

export interface ValidationStep {
  level: 1 | 2 | 3;
  validatorId: string;
  validatorName: string;
  validatorRole: string;
  action: 'approved' | 'rejected';
  comment?: string;
  timestamp: string;
}

// Transform database row to Memorandum interface
const transformMemorandum = (dbMemo: any, validationSteps: any[] = []): Memorandum => {
  return {
    id: dbMemo.id,
    title: dbMemo.title,
    content: dbMemo.content,
    category: dbMemo.category,
    priority: dbMemo.priority,
    authorId: dbMemo.author_id,
    authorName: dbMemo.author_name,
    createdAt: dbMemo.created_at,
    status: dbMemo.status,
    targetAudience: dbMemo.target_audience || ['tous'],
    validationHistory: validationSteps.map(step => ({
      level: step.level,
      validatorId: step.validator_id,
      validatorName: step.validator_name,
      validatorRole: step.validator_role,
      action: step.action,
      comment: step.comment,
      timestamp: step.timestamp
    }))
  };
};

export const memorandumService = {
  async getMemorandums(): Promise<Memorandum[]> {
    try {
      const { data: memorandums, error: memoError } = await supabase
        .from('memorandums')
        .select('*')
        .order('created_at', { ascending: false });

      if (memoError) throw memoError;

      // Get all validation steps for these memorandums
      const { data: validationSteps, error: validationError } = await supabase
        .from('validation_steps')
        .select('*')
        .order('timestamp', { ascending: true });

      if (validationError) throw validationError;

      // Group validation steps by memorandum_id
      const stepsByMemo = validationSteps?.reduce((acc, step) => {
        if (!acc[step.memorandum_id]) acc[step.memorandum_id] = [];
        acc[step.memorandum_id].push(step);
        return acc;
      }, {} as Record<string, any[]>) || {};

      return memorandums?.map(memo => 
        transformMemorandum(memo, stepsByMemo[memo.id] || [])
      ) || [];
    } catch (error) {
      console.error('Error fetching memorandums:', error);
      throw error;
    }
  },

  async createMemorandum(memorandum: Omit<Memorandum, 'id' | 'createdAt' | 'status' | 'validationHistory'>): Promise<Memorandum> {
    try {
      const { data, error } = await supabase
        .from('memorandums')
        .insert({
          title: memorandum.title,
          content: memorandum.content,
          category: memorandum.category,
          priority: memorandum.priority,
          author_id: memorandum.authorId,
          author_name: memorandum.authorName,
          target_audience: memorandum.targetAudience,
          status: 'level1_pending'
        })
        .select()
        .single();

      if (error) throw error;

      return transformMemorandum(data);
    } catch (error) {
      console.error('Error creating memorandum:', error);
      throw error;
    }
  },

  async validateMemorandum(
    id: string, 
    level: 1 | 2 | 3, 
    action: 'approved' | 'rejected', 
    validatorInfo: { id: string; name: string; role: string },
    comment?: string
  ): Promise<Memorandum> {
    try {
      // Create validation step
      const { error: stepError } = await supabase
        .from('validation_steps')
        .insert({
          memorandum_id: id,
          level,
          validator_id: validatorInfo.id,
          validator_name: validatorInfo.name,
          validator_role: validatorInfo.role,
          action,
          comment
        });

      if (stepError) throw stepError;

      // Update memorandum status
      let newStatus: string;
      if (action === 'rejected') {
        newStatus = 'rejected';
      } else if (level === 3) {
        newStatus = 'approved';
      } else {
        newStatus = `level${level + 1}_pending`;
      }

      const { data, error } = await supabase
        .from('memorandums')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Get updated validation history
      const { data: validationSteps, error: validationError } = await supabase
        .from('validation_steps')
        .select('*')
        .eq('memorandum_id', id)
        .order('timestamp', { ascending: true });

      if (validationError) throw validationError;

      return transformMemorandum(data, validationSteps || []);
    } catch (error) {
      console.error('Error validating memorandum:', error);
      throw error;
    }
  },

  async getMemorandumsByStatus(status: Memorandum['status']): Promise<Memorandum[]> {
    try {
      const { data: memorandums, error: memoError } = await supabase
        .from('memorandums')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (memoError) throw memoError;

      // Get validation steps for these memorandums
      const memorandumIds = memorandums?.map(m => m.id) || [];
      const { data: validationSteps, error: validationError } = await supabase
        .from('validation_steps')
        .select('*')
        .in('memorandum_id', memorandumIds)
        .order('timestamp', { ascending: true });

      if (validationError) throw validationError;

      // Group validation steps by memorandum_id
      const stepsByMemo = validationSteps?.reduce((acc, step) => {
        if (!acc[step.memorandum_id]) acc[step.memorandum_id] = [];
        acc[step.memorandum_id].push(step);
        return acc;
      }, {} as Record<string, any[]>) || {};

      return memorandums?.map(memo => 
        transformMemorandum(memo, stepsByMemo[memo.id] || [])
      ) || [];
    } catch (error) {
      console.error('Error fetching memorandums by status:', error);
      throw error;
    }
  },

  async updateMemorandum(id: string, updates: Partial<Memorandum>): Promise<Memorandum> {
    try {
      const updateData: any = {};
      
      if (updates.title) updateData.title = updates.title;
      if (updates.content) updateData.content = updates.content;
      if (updates.category) updateData.category = updates.category;
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.targetAudience) updateData.target_audience = updates.targetAudience;

      const { data, error } = await supabase
        .from('memorandums')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Get validation history
      const { data: validationSteps, error: validationError } = await supabase
        .from('validation_steps')
        .select('*')
        .eq('memorandum_id', id)
        .order('timestamp', { ascending: true });

      if (validationError) throw validationError;

      return transformMemorandum(data, validationSteps || []);
    } catch (error) {
      console.error('Error updating memorandum:', error);
      throw error;
    }
  },

  async deleteMemorandum(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('memorandums')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting memorandum:', error);
      throw error;
    }
  }
};
