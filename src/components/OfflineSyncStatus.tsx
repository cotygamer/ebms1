import React from 'react';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Upload,
  Download
} from 'lucide-react';

export default function OfflineSyncStatus() {
  const { status, forceSync } = useOfflineSync();

  const handleForceSync = async () => {
    try {
      await forceSync();
    } catch (error) {
      console.error('Force sync failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        {status.isOnline ? (
          <Wifi className="h-5 w-5 text-green-500 mr-2" />
        ) : (
          <WifiOff className="h-5 w-5 text-red-500 mr-2" />
        )}
        Offline Sync Status
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Connection Status */}
        <div className={`p-4 rounded-lg border-2 ${
          status.isOnline ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900">Connection</span>
            {status.isOnline ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
          </div>
          <p className={`text-sm ${status.isOnline ? 'text-green-700' : 'text-red-700'}`}>
            {status.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>

        {/* Sync Status */}
        <div className={`p-4 rounded-lg border-2 ${
          status.isSyncing ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900">Sync</span>
            {status.isSyncing ? (
              <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
            ) : (
              <CheckCircle className="h-5 w-5 text-gray-500" />
            )}
          </div>
          <p className={`text-sm ${status.isSyncing ? 'text-blue-700' : 'text-gray-700'}`}>
            {status.isSyncing ? 'Syncing...' : 'Idle'}
          </p>
        </div>

        {/* Queue Status */}
        <div className={`p-4 rounded-lg border-2 ${
          status.pendingOperations > 0 ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900">Queue</span>
            {status.pendingOperations > 0 ? (
              <Upload className="h-5 w-5 text-yellow-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-gray-500" />
            )}
          </div>
          <p className={`text-sm ${status.pendingOperations > 0 ? 'text-yellow-700' : 'text-gray-700'}`}>
            {status.pendingOperations} pending
          </p>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Pending Operations:</span>
          <span className="font-medium">{status.pendingOperations}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Failed Operations:</span>
          <span className="font-medium text-red-600">{status.failedOperations}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Storage Used:</span>
          <span className="font-medium">
            {(status.queueStats.totalSize / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>

        {status.lastSyncTime && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last Sync:</span>
            <span className="font-medium">{status.lastSyncTime.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex space-x-3">
        {status.isOnline && status.pendingOperations > 0 && (
          <button
            onClick={handleForceSync}
            disabled={status.isSyncing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${status.isSyncing ? 'animate-spin' : ''}`} />
            {status.isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        )}
      </div>

      {/* Warnings */}
      {status.queueStats.isNearLimit && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-yellow-800">Storage Warning</span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            Local storage is nearly full. Please sync when online to free up space.
          </p>
        </div>
      )}
    </div>
  );
}