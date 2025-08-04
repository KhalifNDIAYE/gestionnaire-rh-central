import { useState, useEffect, useCallback } from 'react';
import { openDB, IDBPDatabase } from 'idb';

interface OfflineAction {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  synced: boolean;
}

interface CacheItem {
  id: string;
  data: any;
  timestamp: number;
  expiry?: number;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState<OfflineAction[]>([]);
  const [db, setDb] = useState<IDBPDatabase | null>(null);

  // Initialize IndexedDB
  useEffect(() => {
    const initDB = async () => {
      const database = await openDB('offline-sync', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('actions')) {
            const actionStore = db.createObjectStore('actions', { keyPath: 'id' });
            actionStore.createIndex('by-synced', 'synced');
          }
          
          if (!db.objectStoreNames.contains('cache')) {
            const cacheStore = db.createObjectStore('cache', { keyPath: 'id' });
            cacheStore.createIndex('by-timestamp', 'timestamp');
          }
        },
      });
      setDb(database);
    };
    initDB();
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync pending actions when online
  useEffect(() => {
    if (isOnline && db) {
      syncPendingActions();
    }
  }, [isOnline, db]);

  const addOfflineAction = useCallback(async (type: string, data: any) => {
    if (!db) return;

    const action: OfflineAction = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      data,
      timestamp: Date.now(),
      synced: false,
    };

    await db.add('actions', action);
    setPendingActions(prev => [...prev, action]);
  }, [db]);

  const syncPendingActions = useCallback(async () => {
    if (!db) return;

    const allActions = await db.getAll('actions');
    const unsyncedActions = allActions.filter(action => !action.synced);
    
    for (const action of unsyncedActions) {
      try {
        // Here you would implement the actual sync logic
        // For example, sending data to your API
        console.log('Syncing action:', action);
        
        // Mark as synced
        action.synced = true;
        await db.put('actions', action);
        
        setPendingActions(prev => 
          prev.filter(a => a.id !== action.id)
        );
      } catch (error) {
        console.error('Failed to sync action:', action, error);
      }
    }
  }, [db]);

  const cacheData = useCallback(async (key: string, data: any, expiry?: number) => {
    if (!db) return;

    await db.put('cache', {
      id: key,
      data,
      timestamp: Date.now(),
      expiry,
    });
  }, [db]);

  const getCachedData = useCallback(async (key: string) => {
    if (!db) return null;

    const cached = await db.get('cache', key);
    if (!cached) return null;

    // Check if expired
    if (cached.expiry && Date.now() > cached.expiry) {
      await db.delete('cache', key);
      return null;
    }

    return cached.data;
  }, [db]);

  const clearExpiredCache = useCallback(async () => {
    if (!db) return;

    const all = await db.getAll('cache');
    const now = Date.now();
    
    for (const item of all) {
      if (item.expiry && now > item.expiry) {
        await db.delete('cache', item.id);
      }
    }
  }, [db]);

  return {
    isOnline,
    pendingActions,
    addOfflineAction,
    syncPendingActions,
    cacheData,
    getCachedData,
    clearExpiredCache,
  };
};