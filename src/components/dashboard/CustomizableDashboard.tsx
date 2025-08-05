import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardCustomizer } from './DashboardCustomizer';
import { StatsWidget } from './widgets/StatsWidget';
import { ActivitiesWidget } from './widgets/ActivitiesWidget';
import { ChartWidget } from './widgets/ChartWidget';
import NotificationCenter from '../notifications/NotificationCenter';
import AnnouncementCarousel from '../communication/AnnouncementCarousel';
import { useDashboardPreferences } from '@/hooks/useDashboardPreferences';

export const CustomizableDashboard = () => {
  const { preferences, loading } = useDashboardPreferences();
  
  useEffect(() => {
    // Appliquer le thème sélectionné
    if (preferences.theme && preferences.theme !== 'default') {
      const themes = {
        modern: {
          primary: '263 70% 50%',
          accent: '263 70% 95%',
          background: '270 20% 98%'
        },
        corporate: {
          primary: '210 100% 45%',
          accent: '210 100% 95%',
          background: '210 20% 98%'
        },
        glass: {
          primary: '180 100% 50%',
          accent: '180 100% 95%',
          background: '210 100% 97%'
        }
      };

      const theme = themes[preferences.theme as keyof typeof themes];
      if (theme) {
        const root = document.documentElement;
        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--background', theme.background);
      }
    }
  }, [preferences.theme]);

  const renderWidget = (widget: any) => {
    if (!widget.enabled) return null;

    switch (widget.type) {
      case 'stats':
        return <StatsWidget key={widget.id} config={widget.config} />;
      case 'activities':
        return <ActivitiesWidget key={widget.id} config={widget.config} />;
      case 'notifications':
        return <NotificationCenter key={widget.id} />;
      case 'chart':
        return <ChartWidget key={widget.id} config={widget.config} />;
      default:
        return null;
    }
  };

  const getLayoutClass = () => {
    switch (preferences.layout) {
      case 'masonry':
        return 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6';
      case 'compact':
        return 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4';
      default:
        return 'space-y-6';
    }
  };

  const getCardStyle = () => {
    if (preferences.theme === 'glass') {
      return 'backdrop-blur-md bg-white/70 border-white/20';
    }
    if (preferences.theme === 'modern') {
      return 'border-none shadow-lg';
    }
    return '';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton de personnalisation */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <DashboardCustomizer>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Personnaliser
          </Button>
        </DashboardCustomizer>
      </div>

      {/* Carrousel d'annonces - toujours visible */}
      <AnnouncementCarousel />

      {/* Widgets configurables */}
      <div className={getLayoutClass()}>
        {preferences.widgets
          .sort((a, b) => a.position.y - b.position.y || a.position.x - b.position.x)
          .map(widget => (
            <div
              key={widget.id}
              className={`${preferences.layout === 'masonry' ? 'break-inside-avoid' : ''} ${getCardStyle()}`}
            >
              {renderWidget(widget)}
            </div>
          ))
        }
      </div>

      {/* Style personnalisé pour le thème verre */}
      {preferences.theme === 'glass' && (
        <style>{`
          .backdrop-blur-md {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
          }
        `}</style>
      )}
    </div>
  );
};