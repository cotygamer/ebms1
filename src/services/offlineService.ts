import { openDB, IDBPDatabase } from 'idb';

export interface OfflineOperation {
  id: string;
  entityType: 'document' | 'incident' | 'resident' | 'announcement' | 'transaction';
  operationType: 'create' | 'update' | 'delete';
  entityId?: string;
  payload: any;
  timestamp: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number;
  lastError?: string;
}

export interface OfflineData {
  [key: string]: any;
}

class OfflineService {
  private db: IDBPDatabase | null = null;
  private isOnline = navigator.onLine;
  private syncInProgress = false;
  private maxRetries = 3;
  private maxQueueSize = 1000;
  private maxStorageSize = 100 * 1024 * 1024; // 100MB

  async initialize() {
    this.db = await openDB('BarangayOfflineDB', 1, {
      upgrade(db) {
        // Operations queue store
        if (!db.objectStoreNames.contains('operations')) {
          const operationsStore = db.createObjectStore('operations', { keyPath: 'id' });
          operationsStore.createIndex('status', 'status');
          operationsStore.createIndex('timestamp', 'timestamp');
          operationsStore.createIndex('entityType', 'entityType');
        }

        // Cached data store
        if (!db.objectStoreNames.contains('cachedData')) {
          const cachedStore = db.createObjectStore('cachedData', { keyPath: 'key' });
          cachedStore.createIndex('entityType', 'entityType');
          cachedStore.createIndex('lastUpdated', 'lastUpdated');
        }

        // Sync metadata store
        if (!db.objectStoreNames.contains('syncMetadata')) {
          db.createObjectStore('syncMetadata', { keyPath: 'key' });
        }
      },
    });

    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Start periodic sync attempts
    this.startPeriodicSync();
  }

  private handleOnline() {
    this.isOnline = true;
    console.log('🌐 Connection restored - starting sync...');
    this.triggerSync();
    this.dispatchEvent('connectionRestored');
  }

  private handleOffline() {
    this.isOnline = false;
    console.log('📴 Connection lost - switching to offline mode...');
    this.dispatchEvent('connectionLost');
  }

  private dispatchEvent(type: string, data?: any) {
    window.dispatchEvent(new CustomEvent(`offline-${type}`, { detail: data }));
  }

  // Queue offline operations
  async queueOperation(operation: Omit<OfflineOperation, 'id' | 'status' | 'retryCount'>) {
    if (!this.db) throw new Error('Offline service not initialized');

    // Check queue size limits
    const queueSize = await this.getQueueSize();
    if (queueSize >= this.maxQueueSize) {
      throw new Error('Offline queue is full. Please sync when online.');
    }

    const offlineOp: OfflineOperation = {
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...operation,
      status: 'pending',
      retryCount: 0
    };

    await this.db.add('operations', offlineOp);
    
    // Try immediate sync if online
    if (this.isOnline) {
      this.triggerSync();
    }

    return offlineOp.id;
  }

  // Cache data for offline access
  async cacheData(entityType: string, data: any[], lastUpdated?: string) {
    if (!this.db) return;

    const cacheEntry = {
      key: entityType,
      entityType,
      data,
      lastUpdated: lastUpdated || new Date().toISOString(),
      size: JSON.stringify(data).length
    };

    await this.db.put('cachedData', cacheEntry);
  }

  // Get cached data
  async getCachedData(entityType: string): Promise<any[]> {
    if (!this.db) return [];

    const cached = await this.db.get('cachedData', entityType);
    return cached?.data || [];
  }

  // Get pending operations
  async getPendingOperations(): Promise<OfflineOperation[]> {
    if (!this.db) return [];

    const operations = await this.db.getAllFromIndex('operations', 'status', 'pending');
    return operations.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Get queue statistics
  async getQueueStats() {
    if (!this.db) return { pending: 0, failed: 0, totalSize: 0 };

    const [pending, failed, all] = await Promise.all([
      this.db.getAllFromIndex('operations', 'status', 'pending'),
      this.db.getAllFromIndex('operations', 'status', 'failed'),
      this.db.getAll('operations')
    ]);

    const totalSize = all.reduce((size, op) => size + JSON.stringify(op).length, 0);

    return {
      pending: pending.length,
      failed: failed.length,
      totalSize,
      isNearLimit: totalSize > this.maxStorageSize * 0.8
    };
  }

  private async getQueueSize(): Promise<number> {
    if (!this.db) return 0;
    const operations = await this.db.getAll('operations');
    return operations.length;
  }

  // Trigger synchronization
  async triggerSync() {
    if (!this.isOnline || this.syncInProgress) return;

    this.syncInProgress = true;
    this.dispatchEvent('syncStarted');

    try {
      const pendingOps = await this.getPendingOperations();
      
      if (pendingOps.length === 0) {
        this.dispatchEvent('syncCompleted', { synced: 0, failed: 0 });
        return;
      }

      let syncedCount = 0;
      let failedCount = 0;

      // Process operations in batches
      const batchSize = 10;
      for (let i = 0; i < pendingOps.length; i += batchSize) {
        const batch = pendingOps.slice(i, i + batchSize);
        
        for (const operation of batch) {
          try {
            await this.syncOperation(operation);
            await this.markOperationSynced(operation.id);
            syncedCount++;
          } catch (error) {
            await this.markOperationFailed(operation.id, error.message);
            failedCount++;
          }
        }

        // Small delay between batches to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      this.dispatchEvent('syncCompleted', { synced: syncedCount, failed: failedCount });

    } catch (error) {
      console.error('Sync process failed:', error);
      this.dispatchEvent('syncFailed', { error: error.message });
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncOperation(operation: OfflineOperation) {
    const { dataService } = await import('./dataService');

    switch (operation.entityType) {
      case 'document':
        if (operation.operationType === 'create') {
          return await dataService.createDocument(operation.payload);
        } else if (operation.operationType === 'update') {
          return await dataService.updateDocument(operation.entityId!, operation.payload);
        }
        break;

      case 'incident':
        if (operation.operationType === 'create') {
          return await dataService.createIncident(operation.payload);
        } else if (operation.operationType === 'update') {
          return await dataService.updateIncident(operation.entityId!, operation.payload);
        }
        break;

      case 'resident':
        if (operation.operationType === 'update') {
          return await dataService.updateResident(operation.entityId!, operation.payload);
        }
        break;

      case 'announcement':
        if (operation.operationType === 'create') {
          return await dataService.createAnnouncement(operation.payload);
        }
        break;

      case 'transaction':
        if (operation.operationType === 'create') {
          return await dataService.createTransaction(operation.payload);
        }
        break;

      default:
        throw new Error(`Unsupported entity type: ${operation.entityType}`);
    }
  }

  private async markOperationSynced(operationId: string) {
    if (!this.db) return;
    await this.db.delete('operations', operationId);
  }

  private async markOperationFailed(operationId: string, error: string) {
    if (!this.db) return;

    const operation = await this.db.get('operations', operationId);
    if (operation) {
      operation.status = 'failed';
      operation.retryCount++;
      operation.lastError = error;
      
      // Remove operation if max retries exceeded
      if (operation.retryCount >= this.maxRetries) {
        await this.db.delete('operations', operationId);
        console.warn(`Operation ${operationId} removed after ${this.maxRetries} failed attempts`);
      } else {
        await this.db.put('operations', operation);
      }
    }
  }

  private startPeriodicSync() {
    // Attempt sync every 30 seconds when online
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.triggerSync();
      }
    }, 30000);
  }

  // Clear old synced data
  async clearSyncedData() {
    if (!this.db) return;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7); // Keep 7 days of history

    const tx = this.db.transaction('operations', 'readwrite');
    const store = tx.objectStore('operations');
    const operations = await store.getAll();

    for (const op of operations) {
      if (op.status === 'synced' && new Date(op.timestamp) < cutoffDate) {
        await store.delete(op.id);
      }
    }

    await tx.done;
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isOnline: this.isOnline,
      isSyncing: this.syncInProgress
    };
  }

  // Force sync attempt
  async forcSync() {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }
    return this.triggerSync();
  }
}

export const offlineService = new OfflineService();