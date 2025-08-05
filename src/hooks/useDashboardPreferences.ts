import { useState, useEffect } from 'react';
import { settingsService } from '@/services/settingsService';

export interface Widget {
  id: string;
  type: 'stats' | 'activities' | 'notifications' | 'chart' | 'custom';
  title: string;
  enabled: boolean;
  position: { x: number; y: number; w: number; h: number };
  config?: Record<string, any>;
}

export interface DashboardTheme {
  id: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  background: string;
  cardStyle: 'default' | 'minimal' | 'glassmorphism';
}

export interface DashboardPreferences {
  theme: string;
  layout: 'grid' | 'masonry' | 'compact';
  widgets: Widget[];
  filters: Record<string, any>;
  customViews: Array<{
    id: string;
    name: string;
    config: Record<string, any>;
  }>;
}

const defaultPreferences: DashboardPreferences = {
  theme: 'default',
  layout: 'grid',
  widgets: [
    {
      id: 'stats',
      type: 'stats',
      title: 'Statistiques',
      enabled: true,
      position: { x: 0, y: 0, w: 12, h: 2 }
    },
    {
      id: 'activities',
      type: 'activities',
      title: 'Activités récentes',
      enabled: true,
      position: { x: 0, y: 2, w: 8, h: 4 }
    },
    {
      id: 'notifications',
      type: 'notifications',
      title: 'Notifications',
      enabled: true,
      position: { x: 8, y: 2, w: 4, h: 4 }
    }
  ],
  filters: {},
  customViews: []
};

export const useDashboardPreferences = () => {
  const [preferences, setPreferences] = useState<DashboardPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = localStorage.getItem('dashboard-preferences');
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<DashboardPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    
    try {
      localStorage.setItem('dashboard-preferences', JSON.stringify(newPreferences));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
    }
  };

  const updateWidget = (widgetId: string, updates: Partial<Widget>) => {
    const updatedWidgets = preferences.widgets.map(widget =>
      widget.id === widgetId ? { ...widget, ...updates } : widget
    );
    updatePreferences({ widgets: updatedWidgets });
  };

  const addWidget = (widget: Widget) => {
    updatePreferences({ widgets: [...preferences.widgets, widget] });
  };

  const removeWidget = (widgetId: string) => {
    const updatedWidgets = preferences.widgets.filter(widget => widget.id !== widgetId);
    updatePreferences({ widgets: updatedWidgets });
  };

  const saveCustomView = (name: string, config: Record<string, any>) => {
    const newView = {
      id: Date.now().toString(),
      name,
      config
    };
    updatePreferences({
      customViews: [...preferences.customViews, newView]
    });
  };

  const applyCustomView = (viewId: string) => {
    const view = preferences.customViews.find(v => v.id === viewId);
    if (view) {
      updatePreferences(view.config);
    }
  };

  return {
    preferences,
    loading,
    updatePreferences,
    updateWidget,
    addWidget,
    removeWidget,
    saveCustomView,
    applyCustomView
  };
};