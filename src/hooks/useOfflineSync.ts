import { useState, useEffect, useCallback } from 'react';
import { offlineService, OfflineOperation } from '../services/offlineService';

export interface OfflineStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingOperations: number;
  failedOperations: number;
  lastSyncTime?: Date;
  queueStats: {
    pending: number;
    failed: number;
    totalSize: number;
    isNearLimit: boolean;
  };
}

export function useOfflineSync() {
  const [status, setStatus] = useState<OfflineStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    pendingOperations: 0,
    failedOperations: 0,
    queueStats: {
      pending: 0,
      failed: 0,
      totalSize: 0,
      isNearLimit: false
    }
  });

  const updateStatus = useCallback(async () => {
    const connectionStatus = offlineService.getConnectionStatus();
    const queueStats = await offlineService.getQueueStats();
    
    setStatus(prev => ({
      ...prev,
      isOnline: connectionStatus.isOnline,
      isSyncing: connectionStatus.isSyncing,
      pendingOperations: queueStats.pending,
      failedOperations: queueStats.failed,
      queueStats
    }));
  }, []);

  useEffect(() => {
    // Initialize offline service
    offlineService.initialize();

    // Update status initially
    updateStatus();

    // Listen for offline service events
    const handleConnectionRestored = () => {
      updateStatus();
    };

    const handleConnectionLost = () => {
      updateStatus();
    };

    const handleSyncStarted = () => {
      setStatus(prev => ({ ...prev, isSyncing: true }));
    };

    const handleSyncCompleted = (event: CustomEvent) => {
      setStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date()
      }));
      updateStatus();
    };

    const handleSyncFailed = (event: CustomEvent) => {
      setStatus(prev => ({ ...prev, isSyncing: false }));
      updateStatus();
    };

    window.addEventListener('offline-connectionRestored', handleConnectionRestored);
    window.addEventListener('offline-connectionLost', handleConnectionLost);
    window.addEventListener('offline-syncStarted', handleSyncStarted);
    window.addEventListener('offline-syncCompleted', handleSyncCompleted as EventListener);
    window.addEventListener('offline-syncFailed', handleSyncFailed as EventListener);

    // Update status periodically
    const interval = setInterval(updateStatus, 5000);

    return () => {
      window.removeEventListener('offline-connectionRestored', handleConnectionRestored);
      window.removeEventListener('offline-connectionLost', handleConnectionLost);
      window.removeEventListener('offline-syncStarted', handleSyncStarted);
      window.removeEventListener('offline-syncCompleted', handleSyncCompleted as EventListener);
      window.removeEventListener('offline-syncFailed', handleSyncFailed as EventListener);
      clearInterval(interval);
    };
  }, [updateStatus]);

  const queueOperation = useCallback(async (
    entityType: OfflineOperation['entityType'],
    operationType: OfflineOperation['operationType'],
    payload: any,
    entityId?: string
  ) => {
    return await offlineService.queueOperation({
      entityType,
      operationType,
      entityId,
      payload,
      timestamp: new Date().toISOString()
    });
  }, []);

  const forceSync = useCallback(async () => {
    if (!status.isOnline) {
      throw new Error('Cannot sync while offline');
    }
    return await offlineService.forcSync();
  }, [status.isOnline]);

  const clearSyncedData = useCallback(async () => {
    return await offlineService.clearSyncedData();
  }, []);

  return {
    status,
    queueOperation,
    forceSync,
    clearSyncedData,
    updateStatus
  };
}