import React from 'react';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Database,
  Upload,
  X
} from 'lucide-react';

export default function OfflineIndicator() {
  const { status, forceSync } = useOfflineSync();
  const [showDetails, setShowDetails] = React.useState(false);

  const getStatusColor = () => {
    if (!status.isOnline) return 'bg-red-500';
    if (status.isSyncing) return 'bg-blue-500';
    if (status.pendingOperations > 0) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (!status.isOnline) return 'Offline';
    if (status.isSyncing) return 'Syncing...';
    if (status.pendingOperations > 0) return `${status.pendingOperations} pending`;
    return 'Online';
  };

  const getStatusIcon = () => {
    if (!status.isOnline) return <WifiOff className="h-4 w-4" />;
    if (status.isSyncing) return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (status.pendingOperations > 0) return <Upload className="h-4 w-4" />;
    return <Wifi className="h-4 w-4" />;
  };

  const handleForceSync = async () => {
    try {
      await forceSync();
    } catch (error) {
      console.error('Force sync failed:', error);
    }
  };

  return (
    <>
      {/* Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-white shadow-lg transition-all ${getStatusColor()} hover:opacity-90`}
        >
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
        </button>
      </div>

      {/* Detailed Status Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Sync Status
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Connection Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  {status.isOnline ? (
                    <Wifi className="h-5 w-5 text-green-500" />
                  ) : (
                    <WifiOff className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">Connection</span>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  status.isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {status.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Sync Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  {status.isSyncing ? (
                    <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <span className="font-medium">Sync Status</span>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  status.isSyncing ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {status.isSyncing ? 'Syncing' : 'Idle'}
                </span>
              </div>

              {/* Queue Statistics */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Queue Statistics</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Pending</span>
                    </div>
                    <p className="text-lg font-bold text-yellow-600">{status.pendingOperations}</p>
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Failed</span>
                    </div>
                    <p className="text-lg font-bold text-red-600">{status.failedOperations}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Storage Used</span>
                    <span className="text-sm text-gray-600">
                      {(status.queueStats.totalSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        status.queueStats.isNearLimit ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ 
                        width: `${Math.min((status.queueStats.totalSize / (100 * 1024 * 1024)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Last Sync Time */}
              {status.lastSyncTime && (
                <div className="text-center text-sm text-gray-600">
                  Last sync: {status.lastSyncTime.toLocaleString()}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                {status.isOnline && status.pendingOperations > 0 && (
                  <button
                    onClick={handleForceSync}
                    disabled={status.isSyncing}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {status.isSyncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                )}
              </div>

              {/* Warnings */}
              {status.queueStats.isNearLimit && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-yellow-800">Storage Warning</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Local storage is nearly full. Please sync when online.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}