import { apiService } from './apiService';

export interface GeneralSettings {
  appName: string;
  companyName: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  logoUrl?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  appNotifications: boolean;
  leaveRequestNotify: boolean;
  payrollNotify: boolean;
  newEmployeeNotify: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  language: 'fr' | 'en';
  sidebarCollapsed: boolean;
}

export interface ModuleSettings {
  directory: boolean;
  memorandum: boolean;
  employees: boolean;
  functions: boolean;
  leaveRequests: boolean;
  organigramme: boolean;
  timeTracking: boolean;
  payroll: boolean;
  salary: boolean;
  projects: boolean;
  communication: boolean;
}

export interface BudgetCode {
  id: string;
  libelle: string;
  codeProjet: string;
  codeComposante: string;
  codeActivite: string;
  active: boolean;
}

export interface BudgetCodeSettings {
  codes: BudgetCode[];
}

export interface SystemSettings {
  general: GeneralSettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  modules: ModuleSettings;
  budgetCodes: BudgetCodeSettings;
}

class SettingsService {
  private storageKey = 'rh_system_settings';

  private defaultSettings: SystemSettings = {
    general: {
      appName: 'RH System',
      companyName: 'Votre Entreprise',
      companyAddress: '123 Rue Principale',
      companyPhone: '+123456789',
      companyEmail: 'contact@entreprise.com',
    },
    notifications: {
      emailNotifications: true,
      appNotifications: true,
      leaveRequestNotify: true,
      payrollNotify: true,
      newEmployeeNotify: false,
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      language: 'fr',
      sidebarCollapsed: false,
    },
    modules: {
      directory: true,
      memorandum: true,
      employees: true,
      functions: true,
      leaveRequests: true,
      organigramme: true,
      timeTracking: true,
      payroll: true,
      salary: true,
      projects: true,
      communication: true,
    },
    budgetCodes: {
      codes: [
        {
          id: '1',
          libelle: 'EQUIPEMENTS BUREAUTIQUE ET INFORMATIQUE',
          codeProjet: '05006',
          codeComposante: '0500601',
          codeActivite: '050060101',
          active: true
        },
        {
          id: '2',
          libelle: 'FOURNITURES BUREAUTIQUES ET INFORMATIQUES',
          codeProjet: '05007',
          codeComposante: '0500701',
          codeActivite: '050070101',
          active: true
        },
        {
          id: '3',
          libelle: 'ACTION DE VISIBILITE',
          codeProjet: '05007',
          codeComposante: '0500701',
          codeActivite: '050070101',
          active: true
        },
        {
          id: '4',
          libelle: 'TELEPHONE',
          codeProjet: '05008',
          codeComposante: '0500801',
          codeActivite: '050080101',
          active: true
        },
        {
          id: '5',
          libelle: 'ELECTRICITE',
          codeProjet: '05008',
          codeComposante: '0500801',
          codeActivite: '050080102',
          active: true
        },
        {
          id: '6',
          libelle: 'CARBURANTS',
          codeProjet: '05008',
          codeComposante: '0500801',
          codeActivite: '050080103',
          active: true
        },
        {
          id: '7',
          libelle: 'CARTE A PEAGES',
          codeProjet: '05008',
          codeComposante: '0500801',
          codeActivite: '050080104',
          active: true
        },
        {
          id: '8',
          libelle: 'DIVERS ET IMPREVUS',
          codeProjet: '05009',
          codeComposante: '0500901',
          codeActivite: '050090101',
          active: true
        }
      ]
    }
  };

  private getSettingsFromStorage(): SystemSettings {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.defaultSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return this.defaultSettings;
    }
  }

  private saveSettingsToStorage(settings: SystemSettings): void {
    localStorage.setItem(this.storageKey, JSON.stringify(settings));
  }

  async getSettings(): Promise<SystemSettings> {
    try {
      const settings = await apiService.get<SystemSettings>('/settings');
      return settings;
    } catch (error) {
      console.error('Error fetching settings from API, using local storage:', error);
      return this.getSettingsFromStorage();
    }
  }

  async updateGeneralSettings(data: GeneralSettings): Promise<SystemSettings> {
    try {
      const updatedSettings = await apiService.put<SystemSettings>('/settings/general', data);
      return updatedSettings;
    } catch (error) {
      console.error('Error updating general settings via API, using local fallback:', error);
      
      const currentSettings = this.getSettingsFromStorage();
      const updatedSettings = {
        ...currentSettings,
        general: {
          ...currentSettings.general,
          ...data,
        }
      };
      
      this.saveSettingsToStorage(updatedSettings);
      return updatedSettings;
    }
  }

  async updateNotificationSettings(data: NotificationSettings): Promise<SystemSettings> {
    try {
      const updatedSettings = await apiService.put<SystemSettings>('/settings/notifications', data);
      return updatedSettings;
    } catch (error) {
      console.error('Error updating notification settings via API, using local fallback:', error);
      
      const currentSettings = this.getSettingsFromStorage();
      const updatedSettings = {
        ...currentSettings,
        notifications: {
          ...currentSettings.notifications,
          ...data,
        }
      };
      
      this.saveSettingsToStorage(updatedSettings);
      return updatedSettings;
    }
  }

  async updateAppearanceSettings(data: AppearanceSettings): Promise<SystemSettings> {
    try {
      const updatedSettings = await apiService.put<SystemSettings>('/settings/appearance', data);
      return updatedSettings;
    } catch (error) {
      console.error('Error updating appearance settings via API, using local fallback:', error);
      
      const currentSettings = this.getSettingsFromStorage();
      const updatedSettings = {
        ...currentSettings,
        appearance: {
          ...currentSettings.appearance,
          ...data,
        }
      };
      
      this.saveSettingsToStorage(updatedSettings);
      return updatedSettings;
    }
  }

  async updateModuleSettings(data: Partial<ModuleSettings>): Promise<SystemSettings> {
    try {
      const updatedSettings = await apiService.put<SystemSettings>('/settings/modules', data);
      return updatedSettings;
    } catch (error) {
      console.error('Error updating module settings via API, using local fallback:', error);
      
      const currentSettings = this.getSettingsFromStorage();
      const updatedSettings = {
        ...currentSettings,
        modules: {
          ...currentSettings.modules,
          ...data,
        }
      };
      
      this.saveSettingsToStorage(updatedSettings);
      return updatedSettings;
    }
  }

  async updateBudgetCodeSettings(data: BudgetCodeSettings): Promise<SystemSettings> {
    try {
      const updatedSettings = await apiService.put<SystemSettings>('/settings/budget-codes', data);
      return updatedSettings;
    } catch (error) {
      console.error('Error updating budget code settings via API, using local fallback:', error);
      
      const currentSettings = this.getSettingsFromStorage();
      const updatedSettings = {
        ...currentSettings,
        budgetCodes: {
          ...currentSettings.budgetCodes,
          ...data,
        }
      };
      
      this.saveSettingsToStorage(updatedSettings);
      return updatedSettings;
    }
  }
}

export const settingsService = new SettingsService();
