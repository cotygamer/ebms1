import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Sidebar from '../components/Sidebar';
import UserManagement from '../components/UserManagement';
import ResidentManagement from '../components/ResidentManagement';
import ModuleControl from '../components/ModuleControl';
import SystemSettings from '../components/SystemSettings';
import Analytics from '../components/Analytics';
import ProjectGallery from '../components/ProjectGallery';
import { 
  Users, 
  Shield, 
  Settings, 
  BarChart3, 
  Activity, 
  Database, 
  LogOut, 
  Camera,
  CreditCard,
  MapPin,
  Save,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'residents', label: 'Resident Management', icon: Users },
    { id: 'modules', label: 'Module Control', icon: Database },
    { id: 'projects', label: 'Projects & Gallery', icon: Camera },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'integrations', label: 'Integrations', icon: CreditCard },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SuperAdminOverview />;
      case 'users':
        return <UserManagement />;
      case 'residents':
        return <ResidentManagement />;
      case 'modules':
        return <ModuleControl />;
      case 'projects':
        return <ProjectGallery />;
      case 'analytics':
        return <Analytics />;
      case 'integrations':
        return <IntegrationsManagement />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <SuperAdminOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole="super-admin"
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Super Admin Dashboard
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:block text-gray-600">Welcome, {user?.name}</span>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0)}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function SuperAdminOverview() {
  const { users, residents } = useData();
  
  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600' },
    { label: 'Total Residents', value: residents.length, icon: Users, color: 'text-green-600' },
    { label: 'Verified Residents', value: residents.filter(r => r.verificationStatus === 'verified').length, icon: Shield, color: 'text-purple-600' },
    { label: 'Active Modules', value: 12, icon: Database, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`h-12 w-12 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 mb-2">Operational</div>
            <div className="text-sm text-green-800">All systems running</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Activity className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600 mb-2">99.9%</div>
            <div className="text-sm text-blue-800">System uptime</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Database className="h-12 w-12 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600 mb-2">Latest</div>
            <div className="text-sm text-purple-800">System version 2.1.0</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '#users'}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
          >
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-600">Add, edit, or remove system users</p>
            </div>
          </button>
          
          <button
            onClick={() => window.location.href = '#modules'}
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
          >
            <Database className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Module Control</h3>
              <p className="text-sm text-gray-600">Enable/disable system modules</p>
            </div>
          </button>
          
          <button
            onClick={() => window.location.href = '#settings'}
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
          >
            <Settings className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">System Settings</h3>
              <p className="text-sm text-gray-600">Configure system preferences</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function IntegrationsManagement() {
  const { systemSettings, updateSystemSettings } = useData();
  const [settings, setSettings] = useState({
    googleMapsApiKey: systemSettings.googleMapsApiKey || '',
    paymentGateway: systemSettings.paymentGateway || {
      provider: 'PayPal',
      apiKey: '',
      secretKey: '',
      gcash: { enabled: false, merchantId: '', apiKey: '' },
      maya: { enabled: false, publicKey: '', secretKey: '' },
      dragonpay: { enabled: false, merchantId: '', password: '' },
      cashOnPickup: { enabled: true }
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeIntegration, setActiveIntegration] = useState('maps');

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      await updateSystemSettings(settings);
      setMessage('Integration settings updated successfully!');
    } catch (error) {
      setMessage('Failed to update settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePaymentMethod = (method: string, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      paymentGateway: {
        ...prev.paymentGateway,
        [method]: {
          ...prev.paymentGateway[method as keyof typeof prev.paymentGateway],
          enabled
        }
      }
    }));
  };

  const integrationTabs = [
    { id: 'maps', label: 'Google Maps', icon: MapPin },
    { id: 'payments', label: 'Payment Gateway', icon: CreditCard }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Third-Party Integrations</h2>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') ? 'bg-green-50 border border-green-200 text-green-700' :
          'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {integrationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveIntegration(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                  activeIntegration === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {activeIntegration === 'maps' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Google Maps Integration</h3>
                <p className="text-gray-600 mb-4">
                  Configure Google Maps API for location services and mapping features.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Maps API Key
                </label>
                <input
                  type="text"
                  value={settings.googleMapsApiKey}
                  onChange={(e) => setSettings({ ...settings, googleMapsApiKey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your Google Maps API key"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Get your API key from the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a>
                </p>
              </div>
              
              {/* Google Maps Preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Map Preview</h4>
                {settings.googleMapsApiKey ? (
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                      <div 
                        id="google-map-preview" 
                        className="w-full h-64 bg-gray-100 flex items-center justify-center"
                        style={{
                          backgroundImage: `url('https://maps.googleapis.com/maps/api/staticmap?center=14.5995,120.9842&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7Clabel:B%7C14.5995,120.9842&key=${settings.googleMapsApiKey}')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        {!settings.googleMapsApiKey && (
                          <div className="text-center">
                            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Enter API key to preview map</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>Location:</strong> Barangay San Miguel, Metro Manila</p>
                      <p><strong>Coordinates:</strong> 14.5995°N, 120.9842°E</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No API key configured</p>
                    <p className="text-sm text-gray-400">Enter your Google Maps API key above to see the map preview</p>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Required APIs</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Maps JavaScript API</li>
                  <li>• Geocoding API</li>
                  <li>• Places API</li>
                </ul>
              </div>
            </div>
          )}

          {activeIntegration === 'payments' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Gateway Configuration</h3>
                <p className="text-gray-600 mb-6">
                  Configure payment methods available for residents to pay barangay fees and services.
                </p>
              </div>

              {/* GCash */}
              <div className={`p-4 border rounded-lg ${settings.paymentGateway.gcash?.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">GCash</h4>
                  <button
                    onClick={() => togglePaymentMethod('gcash', !settings.paymentGateway.gcash?.enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.paymentGateway.gcash?.enabled ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.paymentGateway.gcash?.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                {settings.paymentGateway.gcash?.enabled && (
                  <div className="space-y-3 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Merchant ID</label>
                      <input
                        type="text"
                        value={settings.paymentGateway.gcash?.merchantId || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          paymentGateway: {
                            ...prev.paymentGateway,
                            gcash: { ...prev.paymentGateway.gcash, merchantId: e.target.value }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter GCash Merchant ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                      <input
                        type="password"
                        value={settings.paymentGateway.gcash?.apiKey || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          paymentGateway: {
                            ...prev.paymentGateway,
                            gcash: { ...prev.paymentGateway.gcash, apiKey: e.target.value }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter GCash API Key"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Maya */}
              <div className={`p-4 border rounded-lg ${settings.paymentGateway.maya?.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Maya (PayMaya)</h4>
                  <button
                    onClick={() => togglePaymentMethod('maya', !settings.paymentGateway.maya?.enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.paymentGateway.maya?.enabled ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.paymentGateway.maya?.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                {settings.paymentGateway.maya?.enabled && (
                  <div className="space-y-3 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Public Key</label>
                      <input
                        type="text"
                        value={settings.paymentGateway.maya?.publicKey || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          paymentGateway: {
                            ...prev.paymentGateway,
                            maya: { ...prev.paymentGateway.maya, publicKey: e.target.value }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter Maya Public Key"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                      <input
                        type="password"
                        value={settings.paymentGateway.maya?.secretKey || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          paymentGateway: {
                            ...prev.paymentGateway,
                            maya: { ...prev.paymentGateway.maya, secretKey: e.target.value }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter Maya Secret Key"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* DragonPay */}
              <div className={`p-4 border rounded-lg ${settings.paymentGateway.dragonpay?.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">DragonPay</h4>
                  <button
                    onClick={() => togglePaymentMethod('dragonpay', !settings.paymentGateway.dragonpay?.enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.paymentGateway.dragonpay?.enabled ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.paymentGateway.dragonpay?.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                {settings.paymentGateway.dragonpay?.enabled && (
                  <div className="space-y-3 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Merchant ID</label>
                      <input
                        type="text"
                        value={settings.paymentGateway.dragonpay?.merchantId || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          paymentGateway: {
                            ...prev.paymentGateway,
                            dragonpay: { ...prev.paymentGateway.dragonpay, merchantId: e.target.value }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter DragonPay Merchant ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={settings.paymentGateway.dragonpay?.password || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          paymentGateway: {
                            ...prev.paymentGateway,
                            dragonpay: { ...prev.paymentGateway.dragonpay, password: e.target.value }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter DragonPay Password"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Cash on Pickup */}
              <div className={`p-4 border rounded-lg ${settings.paymentGateway.cashOnPickup?.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">Cash on Pickup</h4>
                    <p className="text-sm text-gray-600">Allow residents to pay when picking up documents</p>
                  </div>
                  <button
                    onClick={() => togglePaymentMethod('cashOnPickup', !settings.paymentGateway.cashOnPickup?.enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.paymentGateway.cashOnPickup?.enabled ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.paymentGateway.cashOnPickup?.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Security Notice</h4>
                    <p className="text-sm text-yellow-700">
                      Keep your API keys secure and never share them publicly. Use test keys during development and switch to live keys only in production.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}