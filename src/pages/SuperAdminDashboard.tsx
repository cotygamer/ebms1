import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useOfflineSync } from '../hooks/useOfflineSync';
import OfflineIndicator from '../components/OfflineIndicator';
import OfflineSyncStatus from '../components/OfflineSyncStatus';
import UserManagement from '../components/UserManagement';
import ResidentManagement from '../components/ResidentManagement';
import ModuleControl from '../components/ModuleControl';
import SystemSettings from '../components/SystemSettings';
import Analytics from '../components/Analytics';
import ProjectGallery from '../components/ProjectGallery';
import KYCVerificationCenter from '../components/KYCVerificationCenter';
import SyncTestPanel from '../components/SyncTestPanel';
import DataSyncMonitor from '../components/DataSyncMonitor';
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
  X,
  UserCheck,
  Menu,
  Bell,
  Search,
  Home,
  FileText,
  Heart,
  Calculator,
  Building2,
  TestTube,
  Wrench,
  Globe,
  Lock,
  Palette,
  Monitor,
  Smartphone,
  Wifi,
  HardDrive,
  Zap,
  TrendingUp,
  Clock,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Star,
  Award,
  Target,
  Layers,
  Code,
  Server,
  Cloud,
  Key,
  Mail,
  Phone,
  Layers,
  TestTube
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { status: offlineStatus } = useOfflineSync();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    // Main Section
    { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'System overview and analytics', section: 'Main' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Data insights and reports', section: 'Main' },
    { id: 'offline-sync', label: 'Data Sync', icon: Database, description: 'Monitor data synchronization', section: 'Main' },
    
    // User Management Section
    { id: 'users', label: 'User Management', icon: Users, description: 'Manage system users and roles', section: 'User Management' },
    { id: 'residents', label: 'Resident Management', icon: Users, description: 'Manage resident profiles', section: 'User Management' },
    { id: 'kyc-verification', label: 'KYC Verification', icon: UserCheck, description: 'Verify resident identities', section: 'User Management' },
    
    // System Section
    { id: 'modules', label: 'Module Control', icon: Layers, description: 'Enable/disable system modules', section: 'System' },
    { id: 'settings', label: 'System Settings', icon: Settings, description: 'Configure system preferences', section: 'System' },
    { id: 'data-sync', label: 'Data Sync Monitor', icon: Database, description: 'Monitor data synchronization', section: 'System' },
    { id: 'integrations', label: 'Integrations', icon: Globe, description: 'Third-party integrations', section: 'System' },
    { id: 'security', label: 'Security', icon: Lock, description: 'Security settings and logs', section: 'System' },
    
    // Content Section
    { id: 'projects', label: 'Projects Gallery', icon: Camera, description: 'Manage project showcase', section: 'Content' },
    { id: 'announcements', label: 'Announcements', icon: Bell, description: 'Manage community announcements', section: 'Content' },
    
    // Testing Section
    { id: 'sync-tests', label: 'Sync Tests', icon: TestTube, description: 'Test data synchronization', section: 'Testing' },
    { id: 'system-health', label: 'System Health', icon: Activity, description: 'Monitor system performance', section: 'Testing' },
    
    // Portal Management Section
    { id: 'portal-management', label: 'Portal Management', icon: Building2, description: 'Manage specialized portals', section: 'Portal Management' },
    { id: 'user-roles', label: 'User Roles & Permissions', icon: Shield, description: 'Manage user access levels', section: 'Portal Management' },
    { id: 'audit-logs', label: 'Audit Logs', icon: FileText, description: 'View system audit trail', section: 'Portal Management' }
  ];

  const getActiveMenuItem = () => {
    return menuItems.find(item => item.id === activeTab) || menuItems[0];
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <SuperAdminOverview />;
      case 'analytics':
        return <Analytics />;
      case 'offline-sync':
        return <OfflineSyncStatus />;
      case 'users':
        return <UserManagement />;
      case 'residents':
        return <ResidentManagement />;
      case 'kyc-verification':
        return <KYCVerificationCenter />;
      case 'modules':
        return <ModuleControl />;
      case 'settings':
        return <SystemSettings />;
      case 'data-sync':
        return <DataSyncMonitor />;
      case 'integrations':
        return <IntegrationsManagement />;
      case 'security':
        return <SecurityManagement />;
      case 'projects':
        return <ProjectGallery />;
      case 'announcements':
        return <AnnouncementsManagement />;
      case 'sync-tests':
        return <SyncTestPanel />;
      case 'system-health':
        return <SystemHealthMonitor />;
      case 'portal-management':
        return <PortalManagement />;
      case 'user-roles':
        return <UserRolesManagement />;
      case 'audit-logs':
        return <AuditLogsViewer />;
      default:
        return <SuperAdminOverview />;
    }
  };

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <div className="min-h-screen bg-gray-50">
      <OfflineIndicator />
      
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-20' : 'w-80'} bg-gray-900 text-white shadow-xl transition-all duration-300 ease-in-out flex flex-col`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Bucana Portal</h1>
                  <p className="text-sm text-gray-300">Super Admin</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
            {Object.entries(groupedMenuItems).map(([section, items]) => (
              <div key={section}>
                {!sidebarCollapsed && (
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    {section}
                  </h3>
                )}
                <div className="space-y-1">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200 group ${
                        activeTab === item.id
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                      title={sidebarCollapsed ? item.label : ''}
                    >
                      <item.icon className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'} ${
                        activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
                      }`} />
                      {!sidebarCollapsed && (
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-400 group-hover:text-gray-300">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
            )}
            
            <div className="flex space-x-2">
              <button 
                className={`${sidebarCollapsed ? 'w-full' : 'flex-1'} p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors`}
                title="Settings"
              >
                <Settings className="h-4 w-4 mx-auto text-gray-300" />
              </button>
              <button 
                className={`${sidebarCollapsed ? 'w-full' : 'flex-1'} p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors`}
                title="Notifications"
              >
                <Bell className="h-4 w-4 mx-auto text-gray-300" />
              </button>
              <button
                onClick={handleLogout}
                className={`${sidebarCollapsed ? 'w-full' : 'flex-1'} p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors`}
                title="Logout"
              >
                <LogOut className="h-4 w-4 mx-auto text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {getActiveMenuItem().label}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {getActiveMenuItem().description}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
                    />
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Bell className="h-5 w-5" />
                  </button>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-600">Super Administrator</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user?.name?.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function SuperAdminOverview() {
  const { users, residents, documents, announcements, transactions } = useData();
  
  const stats = [
    { 
      label: 'Total Users', 
      value: users.length, 
      icon: Users, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeColor: 'text-green-600'
    },
    { 
      label: 'Total Residents', 
      value: residents.length, 
      icon: Users, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeColor: 'text-green-600'
    },
    { 
      label: 'Verified Residents', 
      value: residents.filter(r => r.verificationStatus === 'verified').length, 
      icon: Shield, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+15%',
      changeColor: 'text-green-600'
    },
    { 
      label: 'Documents Processed', 
      value: documents.length, 
      icon: FileText, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+23%',
      changeColor: 'text-green-600'
    },
    { 
      label: 'Active Modules', 
      value: 12, 
      icon: Database, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: '100%',
      changeColor: 'text-green-600'
    },
    { 
      label: 'System Uptime', 
      value: '99.9%', 
      icon: Activity, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: 'Excellent',
      changeColor: 'text-green-600'
    }
  ];

  const recentActivities = [
    {
      type: 'user',
      title: 'New user registered',
      description: 'Juan Dela Cruz joined as resident',
      time: '2 minutes ago',
      icon: Users,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      type: 'verification',
      title: 'Resident verified',
      description: 'Maria Santos completed KYC verification',
      time: '15 minutes ago',
      icon: Shield,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      type: 'document',
      title: 'Document processed',
      description: 'Barangay clearance approved for Ana Garcia',
      time: '1 hour ago',
      icon: FileText,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      type: 'system',
      title: 'System backup completed',
      description: 'Daily backup completed successfully',
      time: '2 hours ago',
      icon: Database,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    }
  ];

  const systemHealth = [
    { name: 'Database', status: 'healthy', uptime: '99.9%', color: 'text-green-500' },
    { name: 'Authentication', status: 'healthy', uptime: '100%', color: 'text-green-500' },
    { name: 'File Storage', status: 'healthy', uptime: '99.8%', color: 'text-green-500' },
    { name: 'Email Service', status: 'warning', uptime: '98.5%', color: 'text-yellow-500' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-red-100 text-lg">
              Monitor and manage the entire barangay management system
            </p>
            <div className="flex items-center mt-4 space-x-6">
              <div className="flex items-center text-red-100">
                <Shield className="h-4 w-4 mr-2" />
                <span className="text-sm">Super Administrator</span>
              </div>
              <div className="flex items-center text-red-100">
                <Activity className="h-4 w-4 mr-2" />
                <span className="text-sm">All Systems Operational</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <Shield className="h-16 w-16 text-white opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className={`text-xs font-medium ${stat.changeColor}`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                  <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{activity.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">System Health</h2>
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">All Systems Operational</span>
            </div>
          </div>
          <div className="space-y-4">
            {systemHealth.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'healthy' ? 'bg-green-500' :
                    service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium text-gray-900">{service.name}</span>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${service.color}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </p>
                  <p className="text-xs text-gray-500">{service.uptime} uptime</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('users')}
            className="flex items-center p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-left group"
          >
            <Users className="h-8 w-8 text-blue-600 mr-4 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-semibold text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-600">Add, edit, or remove users</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('kyc-verification')}
            className="flex items-center p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-left group"
          >
            <UserCheck className="h-8 w-8 text-green-600 mr-4 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-semibold text-gray-900">KYC Verification</h3>
              <p className="text-sm text-gray-600">Verify resident identities</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('modules')}
            className="flex items-center p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-left group"
          >
            <Layers className="h-8 w-8 text-purple-600 mr-4 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-semibold text-gray-900">Module Control</h3>
              <p className="text-sm text-gray-600">Enable/disable modules</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className="flex items-center p-6 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors text-left group"
          >
            <Settings className="h-8 w-8 text-orange-600 mr-4 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-semibold text-gray-900">System Settings</h3>
              <p className="text-sm text-gray-600">Configure preferences</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function IntegrationsManagement() {
  const { systemSettings, updateSystemSettings } = useData();
  
  const [settings, setSettings] = useState(() => ({
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
  }));
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      await updateSystemSettings(settings);
      setMessage('Integration settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update settings. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Third-Party Integrations</h2>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Maps Integration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <MapPin className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Google Maps</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <input
                type="password"
                value={settings.googleMapsApiKey}
                onChange={(e) => setSettings({ ...settings, googleMapsApiKey: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Google Maps API key"
              />
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                Required for location services and mapping features
              </p>
            </div>
          </div>
        </div>

        {/* Payment Gateway */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Payment Gateway</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="font-medium">GCash</span>
              <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.paymentGateway.gcash?.enabled ? 'bg-green-600' : 'bg-gray-300'
              }`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.paymentGateway.gcash?.enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="font-medium">Maya</span>
              <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.paymentGateway.maya?.enabled ? 'bg-green-600' : 'bg-gray-300'
              }`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.paymentGateway.maya?.enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="font-medium">Cash on Pickup</span>
              <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.paymentGateway.cashOnPickup?.enabled ? 'bg-green-600' : 'bg-gray-300'
              }`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.paymentGateway.cashOnPickup?.enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityManagement() {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    loginAttempts: 5,
    auditLogging: true,
    encryptionEnabled: true
  });

  const securityLogs = [
    {
      id: '1',
      type: 'login',
      user: 'admin@barangay.gov',
      action: 'Successful login',
      timestamp: '2024-03-18T10:30:00Z',
      ip: '192.168.1.100',
      severity: 'info'
    },
    {
      id: '2',
      type: 'failed_login',
      user: 'unknown@email.com',
      action: 'Failed login attempt',
      timestamp: '2024-03-18T10:25:00Z',
      ip: '192.168.1.200',
      severity: 'warning'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Security Management</h2>
      
      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
            </div>
            <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              securitySettings.twoFactorAuth ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Audit Logging</h4>
              <p className="text-sm text-gray-600">Log all system activities</p>
            </div>
            <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              securitySettings.auditLogging ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                securitySettings.auditLogging ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Security Logs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Security Events</h3>
        <div className="space-y-3">
          {securityLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  log.severity === 'info' ? 'bg-blue-500' :
                  log.severity === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">{log.action}</p>
                  <p className="text-sm text-gray-600">{log.user} from {log.ip}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnnouncementsManagement() {
  const { announcements, addAnnouncement } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'notice' as 'important' | 'event' | 'notice' | 'emergency' | 'health' | 'weather',
    priority: 'medium' as 'low' | 'medium' | 'high',
    targetAudience: 'all'
  });

  const handleAddAnnouncement = async () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      try {
        await addAnnouncement({
          ...newAnnouncement,
          status: 'published',
          author: 'Super Admin'
        });
        setNewAnnouncement({
          title: '',
          content: '',
          type: 'notice',
          priority: 'medium',
          targetAudience: 'all'
        });
        setShowAddForm(false);
      } catch (error) {
        console.error('Failed to add announcement:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Announcements Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
        >
          <Bell className="h-4 w-4 mr-2" />
          New Announcement
        </button>
      </div>

      {/* Announcements List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                  <p className="text-gray-600 mb-3">{announcement.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>By {announcement.author}</span>
                    <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                      announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {announcement.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Announcement Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Create New Announcement</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter announcement title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter announcement content"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newAnnouncement.type}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="notice">Notice</option>
                    <option value="important">Important</option>
                    <option value="event">Event</option>
                    <option value="emergency">Emergency</option>
                    <option value="health">Health</option>
                    <option value="weather">Weather</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAnnouncement}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Publish Announcement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SystemHealthMonitor() {
  const [healthData, setHealthData] = useState({
    cpu: 45,
    memory: 62,
    storage: 38,
    network: 95
  });

  const healthMetrics = [
    { name: 'CPU Usage', value: healthData.cpu, unit: '%', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { name: 'Memory Usage', value: healthData.memory, unit: '%', color: 'text-green-600', bgColor: 'bg-green-50' },
    { name: 'Storage Usage', value: healthData.storage, unit: '%', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { name: 'Network Health', value: healthData.network, unit: '%', color: 'text-orange-600', bgColor: 'bg-orange-50' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">System Health Monitor</h2>
      
      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthMetrics.map((metric, index) => (
          <div key={index} className={`${metric.bgColor} rounded-xl p-6 border border-gray-200`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">{metric.name}</h3>
              <Monitor className={`h-5 w-5 ${metric.color}`} />
            </div>
            <div className="space-y-2">
              <div className="flex items-end space-x-1">
                <span className={`text-2xl font-bold ${metric.color}`}>{metric.value}</span>
                <span className="text-sm text-gray-600">{metric.unit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    metric.value > 80 ? 'bg-red-500' :
                    metric.value > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${metric.value}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Services */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">System Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Database Service', status: 'running', uptime: '99.9%' },
            { name: 'Authentication Service', status: 'running', uptime: '100%' },
            { name: 'File Storage Service', status: 'running', uptime: '99.8%' },
            { name: 'Email Service', status: 'warning', uptime: '98.5%' },
            { name: 'Backup Service', status: 'running', uptime: '99.7%' },
            { name: 'Notification Service', status: 'running', uptime: '99.9%' }
          ].map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  service.status === 'running' ? 'bg-green-500' :
                  service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="font-medium text-gray-900">{service.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 capitalize">{service.status}</p>
                <p className="text-xs text-gray-500">{service.uptime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PortalManagement() {
  const portals = [
    {
      id: 'medical-portal',
      name: 'Medical Portal',
      description: 'Health center management and medical records',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      status: 'active',
      users: 5,
      lastActivity: '2 hours ago'
    },
    {
      id: 'accounting-portal',
      name: 'Accounting Portal',
      description: 'Financial management and revenue tracking',
      icon: Calculator,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      status: 'active',
      users: 3,
      lastActivity: '1 hour ago'
    },
    {
      id: 'disaster-portal',
      name: 'Disaster Portal',
      description: 'Emergency management and disaster response',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      status: 'active',
      users: 4,
      lastActivity: '30 minutes ago'
    },
    {
      id: 'peace-order-portal',
      name: 'Peace & Order Portal',
      description: 'Incident management and crime prevention',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      status: 'active',
      users: 6,
      lastActivity: '15 minutes ago'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Portal Management</h2>
      
      {/* Portal Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Portals</p>
              <p className="text-3xl font-bold text-blue-600">{portals.length}</p>
            </div>
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Portal Users</p>
              <p className="text-3xl font-bold text-green-600">
                {portals.reduce((sum, portal) => sum + portal.users, 0)}
              </p>
            </div>
            <Users className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Uptime</p>
              <p className="text-3xl font-bold text-purple-600">99.9%</p>
            </div>
            <Activity className="h-12 w-12 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-3xl font-bold text-orange-600">24</p>
            </div>
            <Monitor className="h-12 w-12 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Portal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portals.map((portal) => (
          <div key={portal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${portal.bgColor}`}>
                  <portal.icon className={`h-6 w-6 ${portal.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{portal.name}</h3>
                  <p className="text-sm text-gray-600">{portal.description}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                portal.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {portal.status.toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{portal.users}</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{portal.lastActivity}</p>
                <p className="text-sm text-gray-600">Last Activity</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Manage Portal
              </button>
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserRolesManagement() {
  const roles = [
    {
      id: 'super-admin',
      name: 'Super Administrator',
      description: 'Full system access and control',
      permissions: ['all'],
      userCount: 1,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'barangay-official',
      name: 'Barangay Official',
      description: 'Resident management and verification',
      permissions: ['residents', 'documents', 'reports', 'announcements'],
      userCount: 3,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'medical-portal',
      name: 'Medical Staff',
      description: 'Health center and medical records',
      permissions: ['health', 'medical-records', 'appointments'],
      userCount: 5,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'accounting-portal',
      name: 'Accounting Staff',
      description: 'Financial management and reporting',
      permissions: ['accounting', 'financial-reports', 'payments'],
      userCount: 3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">User Roles & Permissions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${role.bgColor}`}>
                  <Shield className={`h-6 w-6 ${role.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-900">{role.userCount}</span>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Permissions</h4>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {permission}
                  </span>
                ))}
              </div>
            </div>
            
            <button className="w-full mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Manage Role
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditLogsViewer() {
  const auditLogs = [
    {
      id: '1',
      action: 'User Login',
      user: 'admin@barangay.gov',
      resource: 'Authentication',
      timestamp: '2024-03-18T10:30:00Z',
      ip: '192.168.1.100',
      status: 'success'
    },
    {
      id: '2',
      action: 'Resident Verified',
      user: 'official@barangay.gov',
      resource: 'Resident Management',
      timestamp: '2024-03-18T10:25:00Z',
      ip: '192.168.1.101',
      status: 'success'
    },
    {
      id: '3',
      action: 'Document Processed',
      user: 'official@barangay.gov',
      resource: 'Document Management',
      timestamp: '2024-03-18T10:20:00Z',
      ip: '192.168.1.101',
      status: 'success'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Audit Logs</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.resource}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}