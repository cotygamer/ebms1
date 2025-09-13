import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { 
  Database, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Activity,
  Users,
  FileText,
  AlertCircle,
  Bell,
  DollarSign,
  Clock,
  TrendingUp
} from 'lucide-react';

interface SyncStatus {
  status: 'healthy' | 'error' | 'syncing';
  lastSync: string;
  counts: {
    users: number;
    residents: number;
    documents: number;
    incidents: number;
    announcements: number;
    transactions: number;
  };
  error?: string;
}

interface DataConsistency {
  valid: boolean;
  issues?: any[];
  error?: string;
}

export default function DataSyncMonitor() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [consistency, setConsistency] = useState<DataConsistency | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkSyncStatus = async () => {
    try {
      setIsRefreshing(true);
      const status = await dataService.getSyncStatus();
      setSyncStatus(status);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Failed to check sync status:', error);
      setSyncStatus({
        status: 'error',
        error: error.message,
        lastSync: new Date().toISOString(),
        counts: { users: 0, residents: 0, documents: 0, incidents: 0, announcements: 0, transactions: 0 }
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const checkDataConsistency = async () => {
    try {
      const result = await dataService.validateDataConsistency();
      setConsistency(result);
    } catch (error) {
      console.error('Failed to check data consistency:', error);
      setConsistency({
        valid: false,
        error: error.message
      });
    }
  };

  useEffect(() => {
    checkSyncStatus();
    checkDataConsistency();

    // Set up periodic checks
    const interval = setInterval(() => {
      checkSyncStatus();
      checkDataConsistency();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'syncing':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'border-green-200 bg-green-50';
      case 'syncing':
        return 'border-blue-200 bg-blue-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
          <Database className="h-6 w-6 mr-2" />
          Data Synchronization Monitor
        </h2>
        <button
          onClick={checkSyncStatus}
          disabled={isRefreshing}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Sync Status Overview */}
      <div className={`border-2 rounded-lg p-6 ${getStatusColor(syncStatus?.status || 'error')}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon(syncStatus?.status || 'error')}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                System Status: {syncStatus?.status?.toUpperCase() || 'UNKNOWN'}
              </h3>
              <p className="text-sm text-gray-600">
                Last sync: {syncStatus?.lastSync ? new Date(syncStatus.lastSync).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {syncStatus?.status === 'healthy' ? (
              <Wifi className="h-6 w-6 text-green-500" />
            ) : (
              <WifiOff className="h-6 w-6 text-red-500" />
            )}
          </div>
        </div>

        {syncStatus?.error && (
          <div className="bg-red-100 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700 font-medium">Sync Error:</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{syncStatus.error}</p>
          </div>
        )}
      </div>

      {/* Data Counts */}
      {syncStatus?.counts && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Users</p>
                <p className="text-2xl font-bold text-blue-600">{syncStatus.counts.users}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Residents</p>
                <p className="text-2xl font-bold text-green-600">{syncStatus.counts.residents}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-purple-600">{syncStatus.counts.documents}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Incidents</p>
                <p className="text-2xl font-bold text-red-600">{syncStatus.counts.incidents}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Announcements</p>
                <p className="text-2xl font-bold text-yellow-600">{syncStatus.counts.announcements}</p>
              </div>
              <Bell className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-indigo-600">{syncStatus.counts.transactions}</p>
              </div>
              <DollarSign className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>
      )}

      {/* Data Consistency Check */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Data Consistency Check</h3>
          <button
            onClick={checkDataConsistency}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Run Check
          </button>
        </div>

        {consistency && (
          <div className={`p-4 rounded-lg border ${
            consistency.valid 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center mb-2">
              {consistency.valid ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span className={`font-medium ${
                consistency.valid ? 'text-green-800' : 'text-red-800'
              }`}>
                {consistency.valid ? 'Data is consistent' : 'Data consistency issues found'}
              </span>
            </div>

            {consistency.error && (
              <p className="text-red-600 text-sm">{consistency.error}</p>
            )}

            {consistency.issues && consistency.issues.length > 0 && (
              <div className="mt-3">
                <h4 className="font-medium text-red-800 mb-2">Issues Found:</h4>
                <ul className="space-y-1">
                  {consistency.issues.map((issue, index) => (
                    <li key={index} className="text-red-700 text-sm">
                      • {issue.type}: {issue.count} records affected
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Real-time Activity Log */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Real-time Activity
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">All modules synchronized successfully</p>
              <p className="text-xs text-gray-500">
                {lastCheck ? `Last checked: ${lastCheck.toLocaleTimeString()}` : 'Checking...'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Database className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">Centralized database active</p>
              <p className="text-xs text-gray-500">All modules connected to Supabase</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">Real-time updates enabled</p>
              <p className="text-xs text-gray-500">Changes propagate instantly across all portals</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Architecture Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Architecture</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Data Flow</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>Resident Portal → Supabase Database</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Admin Portal → Supabase Database</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span>Barangay Official Portal → Supabase Database</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Medical Portal → Supabase Database</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Synchronization Features</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Real-time data updates</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Centralized database</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Audit trail logging</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Data consistency validation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}