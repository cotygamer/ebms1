import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Bell, 
  Shield, 
  Cloud, 
  Zap, 
  Waves, 
  Wind,
  Thermometer,
  Eye,
  Clock,
  MapPin,
  Volume2,
  VolumeX,
  Settings,
  CheckCircle,
  X
} from 'lucide-react';

interface EmergencyAlert {
  id: string;
  type: 'weather' | 'disaster' | 'health' | 'security' | 'evacuation' | 'general';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  issuedAt: string;
  expiresAt?: string;
  location?: string;
  instructions?: string[];
  isActive: boolean;
}

export default function EmergencyAlerts() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([
    {
      id: '1',
      type: 'weather',
      title: 'Heavy Rainfall Warning',
      message: 'Heavy to intense rainfall expected in the next 6 hours. Residents in low-lying areas should be prepared for possible flooding.',
      severity: 'high',
      issuedAt: '2024-03-18T14:30:00Z',
      expiresAt: '2024-03-19T06:00:00Z',
      location: 'All areas',
      instructions: [
        'Stay indoors if possible',
        'Avoid walking or driving through flooded areas',
        'Keep emergency supplies ready',
        'Monitor weather updates'
      ],
      isActive: true
    },
    {
      id: '2',
      type: 'health',
      title: 'Health Advisory',
      message: 'Dengue cases reported in nearby areas. Residents are advised to eliminate stagnant water and use mosquito repellent.',
      severity: 'medium',
      issuedAt: '2024-03-17T09:00:00Z',
      location: 'Purok 1-3',
      instructions: [
        'Remove stagnant water from containers',
        'Use mosquito nets and repellent',
        'Seek medical attention for fever symptoms',
        'Report suspected cases to health center'
      ],
      isActive: true
    },
    {
      id: '3',
      type: 'security',
      title: 'Security Alert',
      message: 'Increased security patrols in response to recent incidents. Residents are advised to remain vigilant.',
      severity: 'medium',
      issuedAt: '2024-03-16T18:00:00Z',
      location: 'Main Street area',
      instructions: [
        'Lock doors and windows securely',
        'Report suspicious activities immediately',
        'Avoid walking alone at night',
        'Keep emergency contacts handy'
      ],
      isActive: true
    }
  ]);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesType = filterType === 'all' || alert.type === filterType;
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    return matchesType && matchesSeverity && alert.isActive;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return <Cloud className="h-6 w-6" />;
      case 'disaster':
        return <AlertTriangle className="h-6 w-6" />;
      case 'health':
        return <Shield className="h-6 w-6" />;
      case 'security':
        return <Shield className="h-6 w-6" />;
      case 'evacuation':
        return <MapPin className="h-6 w-6" />;
      default:
        return <Bell className="h-6 w-6" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600 text-white border-red-600';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'weather':
        return 'text-blue-600 bg-blue-50';
      case 'disaster':
        return 'text-red-600 bg-red-50';
      case 'health':
        return 'text-green-600 bg-green-50';
      case 'security':
        return 'text-purple-600 bg-purple-50';
      case 'evacuation':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const stats = [
    {
      title: 'Active Alerts',
      value: alerts.filter(a => a.isActive).length,
      icon: Bell,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Critical',
      value: alerts.filter(a => a.severity === 'critical' && a.isActive).length,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Weather Alerts',
      value: alerts.filter(a => a.type === 'weather' && a.isActive).length,
      icon: Cloud,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Health Advisories',
      value: alerts.filter(a => a.type === 'health' && a.isActive).length,
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Emergency Alerts</h2>
          <p className="text-gray-600 mt-1">Stay informed about important community alerts and advisories</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              notificationsEnabled 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {notificationsEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
            {notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="weather">Weather</option>
            <option value="disaster">Disaster</option>
            <option value="health">Health</option>
            <option value="security">Security</option>
            <option value="evacuation">Evacuation</option>
          </select>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className={`bg-white rounded-xl shadow-sm border-l-4 ${
            alert.severity === 'critical' ? 'border-red-600' :
            alert.severity === 'high' ? 'border-orange-500' :
            alert.severity === 'medium' ? 'border-yellow-500' :
            'border-blue-500'
          } p-6 hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className={`p-3 rounded-lg ${getTypeColor(alert.type)}`}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(alert.type)}`}>
                      {alert.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{alert.message}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Issued: {new Date(alert.issuedAt).toLocaleString()}</span>
                    </div>
                    {alert.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{alert.location}</span>
                      </div>
                    )}
                    {alert.expiresAt && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Expires: {new Date(alert.expiresAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {alert.instructions && alert.instructions.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Safety Instructions:</h4>
                      <ul className="space-y-1">
                        {alert.instructions.map((instruction, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {instruction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedAlert(alert)}
                className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Alerts</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            There are currently no emergency alerts for your area. We'll notify you immediately if any emergency situations arise.
          </p>
        </div>
      )}

      {/* Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Alert Details</h3>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-lg ${getTypeColor(selectedAlert.type)}`}>
                  {getAlertIcon(selectedAlert.type)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedAlert.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(selectedAlert.severity)}`}>
                      {selectedAlert.severity.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedAlert.type)}`}>
                      {selectedAlert.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed">{selectedAlert.message}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Alert Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issued:</span>
                      <span className="font-medium">{new Date(selectedAlert.issuedAt).toLocaleString()}</span>
                    </div>
                    {selectedAlert.expiresAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expires:</span>
                        <span className="font-medium">{new Date(selectedAlert.expiresAt).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedAlert.location && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{selectedAlert.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedAlert.instructions && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Safety Instructions</h4>
                    <ul className="space-y-2">
                      {selectedAlert.instructions.map((instruction, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Push Notifications</h4>
              <p className="text-sm text-gray-600">Receive instant alerts on your device</p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationsEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}