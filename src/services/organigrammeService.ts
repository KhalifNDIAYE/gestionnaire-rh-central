
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
  private storageKey = 'organigramme_units';

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
    ];
  }

  private getUnitsFromStorage(): OrganizationalUnit[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.getInitialUnits();
    } catch {
      return this.getInitialUnits();
    }
  }

  private saveUnitsToStorage(units: OrganizationalUnit[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(units));
  }

  async getUnits(): Promise<OrganizationalUnit[]> {
    await this.simulateDelay();
    return this.getUnitsFromStorage();
  }

  async getUnitById(id: string): Promise<OrganizationalUnit | null> {
    await this.simulateDelay();
    const units = this.getUnitsFromStorage();
    return units.find(unit => unit.id === id) || null;
  }

  async createUnit(unitData: Omit<OrganizationalUnit, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrganizationalUnit> {
    await this.simulateDelay();
    
    const units = this.getUnitsFromStorage();
    const newId = Date.now().toString();
    
    const newUnit: OrganizationalUnit = {
      ...unitData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    units.push(newUnit);
    this.saveUnitsToStorage(units);
    
    return newUnit;
  }

  async updateUnit(id: string, updates: Partial<OrganizationalUnit>): Promise<OrganizationalUnit> {
    await this.simulateDelay();
    
    const units = this.getUnitsFromStorage();
    const index = units.findIndex(unit => unit.id === id);
    
    if (index === -1) {
      throw new Error('Unité organisationnelle non trouvée');
    }

    units[index] = {
      ...units[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveUnitsToStorage(units);
    return units[index];
  }

  async deleteUnit(id: string): Promise<void> {
    await this.simulateDelay();
    
    const units = this.getUnitsFromStorage();
    const index = units.findIndex(unit => unit.id === id);
    
    if (index === -1) {
      throw new Error('Unité organisationnelle non trouvée');
    }

    // Vérifier s'il y a des unités enfants
    const hasChildren = units.some(unit => unit.parentId === id);
    if (hasChildren) {
      throw new Error('Impossible de supprimer une unité qui a des sous-unités');
    }

    units.splice(index, 1);
    this.saveUnitsToStorage(units);
  }

  async getHierarchy(): Promise<OrganizationalUnit[]> {
    await this.simulateDelay();
    
    const units = this.getUnitsFromStorage();
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
  }

  private simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const organigrammeService = new OrganigrammeService();
