import { useState, useEffect, useCallback } from 'react';
import { offlineService } from '../services/offlineService';
import { useOfflineSync } from './useOfflineSync';

export function useOfflineData<T>(
  entityType: string,
  onlineDataFetcher: () => Promise<T[]>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const { status } = useOfflineSync();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (status.isOnline) {
        // Try to fetch fresh data when online
        try {
          const freshData = await onlineDataFetcher();
          setData(freshData);
          setIsFromCache(false);
          
          // Cache the fresh data for offline use
          await offlineService.cacheData(entityType, freshData);
        } catch (onlineError) {
          console.warn(`Failed to fetch fresh ${entityType} data, falling back to cache:`, onlineError);
          
          // Fall back to cached data if online fetch fails
          const cachedData = await offlineService.getCachedData(entityType);
          setData(cachedData);
          setIsFromCache(true);
          setError('Using cached data - sync when online');
        }
      } else {
        // Use cached data when offline
        const cachedData = await offlineService.getCachedData(entityType);
        setData(cachedData);
        setIsFromCache(true);
        
        if (cachedData.length === 0) {
          setError('No cached data available offline');
        }
      }
    } catch (err: any) {
      setError(err.message || `Failed to load ${entityType} data`);
      console.error(`Error in useOfflineData for ${entityType}:`, err);
    } finally {
      setLoading(false);
    }
  }, [entityType, onlineDataFetcher, status.isOnline]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  // Refresh data when connection is restored
  useEffect(() => {
    const handleConnectionRestored = () => {
      fetchData();
    };

    window.addEventListener('offline-connectionRestored', handleConnectionRestored);
    return () => {
      window.removeEventListener('offline-connectionRestored', handleConnectionRestored);
    };
  }, [fetchData]);

  const createOffline = useCallback(async (payload: any) => {
    try {
      const operationId = await offlineService.queueOperation({
        entityType: entityType as any,
        operationType: 'create',
        payload,
        timestamp: new Date().toISOString()
      });

      // Optimistically update local data
      const tempId = `temp_${Date.now()}`;
      const tempItem = { ...payload, id: tempId, _isOffline: true, _operationId: operationId };
      setData(prev => [tempItem as T, ...prev]);

      return operationId;
    } catch (error) {
      console.error('Failed to queue offline operation:', error);
      throw error;
    }
  }, [entityType]);

  const updateOffline = useCallback(async (entityId: string, payload: any) => {
    try {
      const operationId = await offlineService.queueOperation({
        entityType: entityType as any,
        operationType: 'update',
        entityId,
        payload,
        timestamp: new Date().toISOString()
      });

      // Optimistically update local data
      setData(prev => prev.map(item => 
        (item as any).id === entityId 
          ? { ...item, ...payload, _isOffline: true, _operationId: operationId }
          : item
      ));

      return operationId;
    } catch (error) {
      console.error('Failed to queue offline update:', error);
      throw error;
    }
  }, [entityType]);

  return {
    data,
    loading,
    error,
    isFromCache,
    isOnline: status.isOnline,
    createOffline,
    updateOffline,
    refresh: fetchData
  };
}