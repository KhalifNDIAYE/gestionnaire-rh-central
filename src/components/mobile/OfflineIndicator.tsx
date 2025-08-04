import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Clock } from 'lucide-react';

export const OfflineIndicator = () => {
  const { isOnline, pendingActions } = useOfflineSync();

  if (isOnline && pendingActions.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {!isOnline ? (
        <Badge variant="destructive" className="flex items-center gap-2">
          <WifiOff className="h-3 w-3" />
          Hors ligne
        </Badge>
      ) : (
        <Badge variant="secondary" className="flex items-center gap-2">
          <Wifi className="h-3 w-3" />
          En ligne
        </Badge>
      )}
      
      {pendingActions.length > 0 && (
        <Badge variant="outline" className="mt-1 flex items-center gap-2">
          <Clock className="h-3 w-3" />
          {pendingActions.length} en attente
        </Badge>
      )}
    </div>
  );
};