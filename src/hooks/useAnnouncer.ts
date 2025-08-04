import { useCallback, useRef } from 'react';

type PolitenessLevel = 'polite' | 'assertive';

export const useAnnouncer = () => {
  const announceRef = useRef<(message: string, politeness?: PolitenessLevel) => void>();

  const announce = useCallback((message: string, politeness: PolitenessLevel = 'polite') => {
    // Create or get existing live region
    let liveRegion = document.getElementById(`live-region-${politeness}`);
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = `live-region-${politeness}`;
      liveRegion.setAttribute('aria-live', politeness);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    // Clear content first to ensure change is detected
    liveRegion.textContent = '';
    
    // Add message after a brief delay
    setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = message;
      }
    }, 100);

    // Clear after announcement
    setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = '';
      }
    }, 1000);
  }, []);

  const announceError = useCallback((message: string) => {
    announce(`Erreur: ${message}`, 'assertive');
  }, [announce]);

  const announceSuccess = useCallback((message: string) => {
    announce(`Succès: ${message}`, 'polite');
  }, [announce]);

  const announceLoading = useCallback((message: string = 'Chargement en cours...') => {
    announce(message, 'polite');
  }, [announce]);

  const announceLoadingComplete = useCallback((message: string = 'Chargement terminé') => {
    announce(message, 'polite');
  }, [announce]);

  return {
    announce,
    announceError,
    announceSuccess,
    announceLoading,
    announceLoadingComplete
  };
};