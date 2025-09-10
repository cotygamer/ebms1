import React, { useState } from 'react';
import { ToggleLeft as Toggle, Settings, Shield, Users, Heart, Calculator, AlertTriangle, Camera, FileText, Map, CreditCard, BarChart3, Globe, Wrench, Activity, Database } from 'lucide-react';

interface Module {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
  category: 'core' | 'portal' | 'feature' | 'integration';
  permissions: string[];
  dependencies?: string[];
}

export default function ModuleControl() {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [modules, setModules] = useState<Module[]>([
    // Core Modules
    {
      id: 'user-management',
      name: 'User Management',
      description: 'Manage system users, roles, and permissions',
      icon: Users,
      enabled: true,
      category: 'core',
      permissions: ['super-admin']
    },
    {
      id: 'resident-management',
      name: 'Resident Management',
      description: 'Manage resident profiles, verification, and family trees',
      icon: Users,
      enabled: true,
      category: 'core',
      permissions: ['super-admin', 'barangay-official']
    },
    {
      id: 'document-processing',
      name: 'Document Processing',
      description: 'Handle document requests and approvals',
      icon: FileText,
      enabled: true,
      category: 'core',
      permissions: ['super-admin', 'barangay-official']
    },
    {
      id: 'verification-system',
      name: 'KYC Verification System',
      description: 'Three-tier verification system for residents',
      icon: Shield,
      enabled: true,
      category: 'core',
      permissions: ['super-admin', 'barangay-official']
    },
    {
      id: 'qr-code-system',
      name: 'QR Code System',
      description: 'Generate and manage QR codes for verified residents',
      icon: Camera,
      enabled: true,
      category: 'feature',
      permissions: ['super-admin', 'barangay-official'],
      dependencies: ['verification-system']
    },

    // Portal Modules
    {
      id: 'medical-portal',
      name: 'Medical Portal',
      description: 'Health records, appointments, and medical services',
      icon: Heart,
      enabled: true,
      category: 'portal',
      permissions: ['super-admin', 'barangay-official']
    },
    {
      id: 'accounting-portal',
      name: 'Accounting Portal',
      description: 'Financial management, revenue tracking, and expenses',
      icon: Calculator,
      enabled: true,
      category: 'portal',
      permissions: ['super-admin', 'barangay-official']
    },
    {
      id: 'disaster-portal',
      name: 'NDRRMC Portal',
      description: 'Disaster management, emergency alerts, and evacuation',
      icon: AlertTriangle,
      enabled: true,
      category: 'portal',
      permissions: ['super-admin', 'barangay-official']
    },
    {
      id: 'project-gallery',
      name: 'Project Gallery',
      description: 'Showcase barangay projects and achievements',
      icon: Camera,
      enabled: true,
      category: 'feature',
      permissions: ['super-admin', 'barangay-official']
    },

    // Integration Modules
    {
      id: 'google-maps',
      name: 'Google Maps Integration',
      description: 'Location services and mapping features',
      icon: Map,
      enabled: true,
      category: 'integration',
      permissions: ['super-admin']
    },
    {
      id: 'payment-gateway',
      name: 'Payment Gateway',
      description: 'Online payment processing for services',
      icon: CreditCard,
      enabled: true,
      category: 'integration',
      permissions: ['super-admin']
    },
    {
      id: 'analytics',
      name: 'Analytics & Reporting',
      description: 'System analytics and performance reports',
      icon: BarChart3,
      enabled: true,
      category: 'feature',
      permissions: ['super-admin', 'barangay-official']
    },
    {
      id: 'mobile-app',
      name: 'Mobile App Support',
      description: 'Mobile application integration and API',
      icon: Globe,
      enabled: false,
      category: 'feature',
      permissions: ['super-admin']
    },
    {
      id: 'sms-notifications',
      name: 'SMS Notifications',
      description: 'Send SMS alerts and notifications to residents',
      icon: AlertTriangle,
      enabled: false,
      category: 'integration',
      permissions: ['super-admin', 'barangay-official']
    },
    {
      id: 'email-system',
      name: 'Email System',
      description: 'Automated email notifications and communications',
      icon: FileText,
      enabled: false,
      category: 'integration',
      permissions: ['super-admin', 'barangay-official']
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredModules = modules.filter(module => 
    selectedCategory === 'all' || module.category === selectedCategory
  );

  const toggleModule = (moduleId: string) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        // Check dependencies before disabling
        if (module.enabled && module.dependencies) {
          const dependentModules = modules.filter(m => 
            m.dependencies?.includes(moduleId) && m.enabled
          );
          if (dependentModules.length > 0) {
            alert(`Cannot disable this module. It is required by: ${dependentModules.map(m => m.name).join(', ')}`);
            return module;
          }
        }
        return { ...module, enabled: !module.enabled };
      }
      return module;
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core':
        return 'bg-red-100 text-red-800';
      case 'portal':
        return 'bg-blue-100 text-blue-800';
      case 'feature':
        return 'bg-green-100 text-green-800';
      case 'integration':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConfigure = (module: Module) => {
    setSelectedModule(module);
    setShowConfigModal(true);
  };

  const getModuleStats = () => {
    const total = modules.length;
    const enabled = modules.filter(m => m.enabled).length;
    const core = modules.filter(m => m.category === 'core' && m.enabled).length;
    const portals = modules.filter(m => m.category === 'portal' && m.enabled).length;
    
    return { total, enabled, core, portals };
  };

  const stats = getModuleStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Module Control Center</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Settings className="h-4 w-4" />
          <span>System Configuration</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Modules</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <Settings className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Enabled</p>
              <p className="text-3xl font-bold text-green-600">{stats.enabled}</p>
            </div>
            <Toggle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Core Modules</p>
              <p className="text-3xl font-bold text-red-600">{stats.core}</p>
            </div>
            <Shield className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Portals</p>
              <p className="text-3xl font-bold text-purple-600">{stats.portals}</p>
            </div>
            <Globe className="h-12 w-12 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Modules ({modules.length})
          </button>
          <button
            onClick={() => setSelectedCategory('core')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'core'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Core ({modules.filter(m => m.category === 'core').length})
          </button>
          <button
            onClick={() => setSelectedCategory('portal')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'portal'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Portals ({modules.filter(m => m.category === 'portal').length})
          </button>
          <button
            onClick={() => setSelectedCategory('feature')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'feature'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Features ({modules.filter(m => m.category === 'feature').length})
          </button>
          <button
            onClick={() => setSelectedCategory('integration')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'integration'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Integrations ({modules.filter(m => m.category === 'integration').length})
          </button>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${module.enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <module.icon className={`h-6 w-6 ${module.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{module.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(module.category)}`}>
                    {module.category}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => toggleModule(module.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  module.enabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    module.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{module.description}</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions</h4>
                <div className="flex flex-wrap gap-1">
                  {module.permissions.map((permission, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                      {permission.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              
              {module.dependencies && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Dependencies</h4>
                  <div className="flex flex-wrap gap-1">
                    {module.dependencies.map((dep, index) => (
                      <span key={index} className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded">
                        {modules.find(m => m.id === dep)?.name || dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className={`text-sm font-medium ${module.enabled ? 'text-green-600' : 'text-gray-500'}`}>
                  {module.enabled ? 'Active' : 'Inactive'}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    <span onClick={() => handleConfigure(module)}>Configure</span>
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm" onClick={() => alert(`Viewing logs for ${module.name}...`)}>
                    <span onClick={() => alert(`Viewing logs for ${module.name}...`)}>Logs</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {showConfigModal && selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Wrench className="h-5 w-5 mr-2" />
                  Configure {selectedModule.name}
                </h3>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Module Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {selectedModule.name}</p>
                  <p><strong>Category:</strong> {selectedModule.category}</p>
                  <p><strong>Status:</strong> {selectedModule.enabled ? 'Enabled' : 'Disabled'}</p>
                  <p><strong>Description:</strong> {selectedModule.description}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Configuration Settings</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900">Auto-start on System Boot</h5>
                      <p className="text-sm text-gray-600">Automatically start this module when the system boots</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900">Debug Mode</h5>
                      <p className="text-sm text-gray-600">Enable detailed logging for troubleshooting</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
                    </button>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Performance Settings</h5>
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-700">Memory Limit (MB)</label>
                      <input type="number" defaultValue="512" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button onClick={() => setShowConfigModal(false)} className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">Operational</div>
            <div className="text-sm text-green-800">All core modules running</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">99.9%</div>
            <div className="text-sm text-blue-800">System uptime</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">Latest</div>
            <div className="text-sm text-purple-800">System version 2.1.0</div>
          </div>
        </div>
      </div>
    </div>
  );
}