
import { supabase } from '@/integrations/supabase/client';

// Define local types for organizational units since they're not in the generated types yet
export interface OrganizationalUnit {
  id: string;
  name: string;
  type: 'direction' | 'unite' | 'cellule' | 'comite' | 'service';
  description: string;
  parent_id: string | null;
  manager_id: string | null;
  manager_name: string | null;
  employees: string[];
  color: string;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface CreateOrganizationalUnit {
  name: string;
  type: 'direction' | 'unite' | 'cellule' | 'comite' | 'service';
  description: string;
  parent_id?: string | null;
  manager_id?: string | null;
  manager_name?: string | null;
  employees?: string[];
  color: string;
  level: number;
}

export interface UpdateOrganizationalUnit {
  name?: string;
  type?: 'direction' | 'unite' | 'cellule' | 'comite' | 'service';
  description?: string;
  parent_id?: string | null;
  manager_id?: string | null;
  manager_name?: string | null;
  employees?: string[];
  color?: string;
  level?: number;
}

class OrganigrammeService {
  async getUnits(): Promise<OrganizationalUnit[]> {
    const { data, error } = await supabase
      .from('organizational_units')
      .select('*')
      .order('level', { ascending: true });

    if (error) {
      console.error('Error fetching organizational units:', error);
      throw error;
    }

    return data || [];
  }

  async getUnitById(id: string): Promise<OrganizationalUnit | null> {
    const { data, error } = await supabase
      .from('organizational_units')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching unit:', error);
      throw error;
    }

    return data;
  }

  async createUnit(unitData: CreateOrganizationalUnit): Promise<OrganizationalUnit> {
    const { data, error } = await supabase
      .from('organizational_units')
      .insert(unitData)
      .select()
      .single();

    if (error) {
      console.error('Error creating unit:', error);
      throw new Error('Impossible de créer l\'unité organisationnelle');
    }

    return data;
  }

  async updateUnit(id: string, updates: UpdateOrganizationalUnit): Promise<OrganizationalUnit> {
    const { data, error } = await supabase
      .from('organizational_units')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating unit:', error);
      throw new Error('Impossible de mettre à jour l\'unité organisationnelle');
    }

    return data;
  }

  async deleteUnit(id: string): Promise<void> {
    const { error } = await supabase
      .from('organizational_units')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting unit:', error);
      throw new Error('Impossible de supprimer l\'unité organisationnelle');
    }
  }

  async getHierarchy(): Promise<OrganizationalUnit[]> {
    const units = await this.getUnits();
    const rootUnits = units.filter(unit => !unit.parent_id);
    
    const buildHierarchy = (parentId?: string): OrganizationalUnit[] => {
      return units
        .filter(unit => unit.parent_id === parentId)
        .map(unit => ({
          ...unit,
          children: buildHierarchy(unit.id),
        }));
    };

    return rootUnits.map(unit => ({
      ...unit,
      children: buildHierarchy(unit.id),
    }));
  }
}

export const organigrammeService = new OrganigrammeService();
