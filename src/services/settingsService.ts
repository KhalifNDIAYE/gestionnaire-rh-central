
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

export interface SystemSettings {
  general: GeneralSettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
}

class SettingsService {
  private storageKey = 'rh_system_settings';

  // Paramètres par défaut
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
    await this.simulateDelay();
    return this.getSettingsFromStorage();
  }

  async updateGeneralSettings(data: GeneralSettings): Promise<SystemSettings> {
    await this.simulateDelay();
    
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

  async updateNotificationSettings(data: NotificationSettings): Promise<SystemSettings> {
    await this.simulateDelay();
    
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

  async updateAppearanceSettings(data: AppearanceSettings): Promise<SystemSettings> {
    await this.simulateDelay();
    
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

  private simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const settingsService = new SettingsService();
