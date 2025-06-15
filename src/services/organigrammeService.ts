import { apiService } from './apiService';
import { API_ENDPOINTS } from '../config/api';

export interface OrganizationalUnit {
  id: string;
  name: string;
  type: 'direction' | 'unite' | 'cellule' | 'comite' | 'service';
  description: string;
  parentId?: string;
  managerId?: string;
  managerName?: string;
  employees: string[];
  color: string;
  level: number;
  children?: OrganizationalUnit[];
  createdAt: string;
  updatedAt: string;
}

class OrganigrammeService {
  private getInitialUnits(): OrganizationalUnit[] {
    return [
      {
        id: '1',
        name: 'Assemblée Générale',
        type: 'direction',
        description: 'Assemblée générale de l\'organisation',
        level: 0,
        color: '#22c55e',
        employees: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Directeur Général (DG)',
        type: 'direction',
        description: 'Direction générale',
        parentId: '1',
        level: 1,
        color: '#22c55e',
        employees: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Directeur Technique (DT)',
        type: 'direction',
        description: 'Direction technique',
        parentId: '2',
        level: 2,
        color: '#eab308',
        employees: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Conseillers',
        type: 'service',
        description: 'Conseillers de direction',
        parentId: '2',
        level: 2,
        color: '#6b7280',
        employees: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'Directeur Administratif et Financier (DAF)',
        type: 'direction',
        description: 'Direction administrative et financière',
        parentId: '2',
        level: 2,
        color: '#eab308',
        employees: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '6',
        name: 'UNITÉ 1 - Veille Environnementale, Recherche et Formation (VERF)',
        type: 'unite',
        description: 'Unité de veille environnementale, recherche et formation',
        parentId: '3',
        level: 3,
        color: '#84cc16',
        employees: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '7',
        name: 'UNITÉ 2 - Biodiversité et écosystèmes Terrestres et Marins (BETM)',
        type: 'unite',
        description: 'Unité biodiversité et écosystèmes terrestres et marins',
        parentId: '3',
        level: 3,
        color: '#84cc16',
        employees: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '8',
        name: 'UNITÉ 3 - Évaluation environnementale et sociale et gestion des Risques (EESGR)',
        type: 'unite',
        description: 'Unité évaluation environnementale et sociale et gestion des risques',
        parentId: '3',
        level: 3,
        color: '#84cc16',
        employees: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '9',
        name: 'CELLULE - Communication et gestion des Ressources Documentaires',
        type: 'cellule',
        description: 'Cellule communication et gestion des ressources documentaires',
        parentId: '3',
        level: 3,
        color: '#f97316',
        employees: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '10',
        name: 'CELLULE - Informatique, gestion de données et services techniques',
        type: 'cellule',
        description: 'Cellule informatique, gestion de données et services techniques',
        parentId: '3',
        level: 3,
        color: '#f97316',
        employees: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '11',
        name: 'CELLULE - Mobilisation des ressources financières',
        type: 'cellule',
        description: 'Cellule mobilisation des ressources financières',
        parentId: '3',
        level: 3,
        color: '#f97316',
        employees: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '12',
        name: 'UNITÉ 4 - Océan-Littoral et Ecosystèmes Aquatiques',
        type: 'unite',
        description: 'Unité océan-littoral et écosystèmes aquatiques',
        parentId: '3',
        level: 3,
        color: '#84cc16',
        employees: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '13',
        name: 'UNITE 5 - Sécurité Alimentaire et Systèmes de Production Durable',
        type: 'unite',
        description: 'Unité sécurité alimentaire et systèmes de production durable',
        parentId: '3',
        level: 3,
        color: '#84cc16',
        employees: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '14',
        name: 'UNITE 6 - Finances et Réponses Climatiques',
        type: 'unite',
        description: 'Unité finances et réponses climatiques',
        parentId: '3',
        level: 3,
        color: '#84cc16',
        employees: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '15',
        name: 'CELLULE - Suivi Evaluation et Qualité',
        type: 'cellule',
        description: 'Cellule suivi évaluation et qualité',
        parentId: '3',
        level: 3,
        color: '#f97316',
        employees: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  async getUnits(): Promise<OrganizationalUnit[]> {
    try {
      const units = await apiService.get<OrganizationalUnit[]>(API_ENDPOINTS.organizationalUnits);
      return units;
    } catch (error) {
      console.error('Error fetching organizational units from API, using fallback:', error);
      return this.getInitialUnits();
    }
  }

  async getUnitById(id: string): Promise<OrganizationalUnit | null> {
    try {
      const unit = await apiService.get<OrganizationalUnit>(API_ENDPOINTS.organizationalUnit(id));
      return unit;
    } catch (error) {
      console.error('Error fetching unit from API, using fallback:', error);
      const units = this.getInitialUnits();
      return units.find(unit => unit.id === id) || null;
    }
  }

  async createUnit(unitData: Omit<OrganizationalUnit, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrganizationalUnit> {
    try {
      const newUnit = await apiService.post<OrganizationalUnit>(API_ENDPOINTS.organizationalUnits, unitData);
      return newUnit;
    } catch (error) {
      console.error('Error creating unit via API:', error);
      throw new Error('Impossible de créer l\'unité organisationnelle');
    }
  }

  async updateUnit(id: string, updates: Partial<OrganizationalUnit>): Promise<OrganizationalUnit> {
    try {
      const updatedUnit = await apiService.put<OrganizationalUnit>(API_ENDPOINTS.organizationalUnit(id), updates);
      return updatedUnit;
    } catch (error) {
      console.error('Error updating unit via API:', error);
      throw new Error('Impossible de mettre à jour l\'unité organisationnelle');
    }
  }

  async deleteUnit(id: string): Promise<void> {
    try {
      await apiService.delete(API_ENDPOINTS.organizationalUnit(id));
    } catch (error) {
      console.error('Error deleting unit via API:', error);
      throw new Error('Impossible de supprimer l\'unité organisationnelle');
    }
  }

  async getHierarchy(): Promise<OrganizationalUnit[]> {
    try {
      const units = await this.getUnits();
      const rootUnits = units.filter(unit => !unit.parentId);
      
      const buildHierarchy = (parentId?: string): OrganizationalUnit[] => {
        return units
          .filter(unit => unit.parentId === parentId)
          .map(unit => ({
            ...unit,
            children: buildHierarchy(unit.id),
          }));
      };

      return rootUnits.map(unit => ({
        ...unit,
        children: buildHierarchy(unit.id),
      }));
    } catch (error) {
      console.error('Error building hierarchy:', error);
      return [];
    }
  }
}

export const organigrammeService = new OrganigrammeService();
