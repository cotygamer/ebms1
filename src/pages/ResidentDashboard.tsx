import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import ResidentDashboardOverview from '../components/ResidentDashboardOverview';
import ResidentProfileView from '../components/ResidentProfileView';
import ResidentDocumentList from '../components/ResidentDocumentList';
import ResidentIncidentList from '../components/ResidentIncidentList';
import QRCodeDisplay from '../components/QRCodeDisplay';
import FamilyTreeView from '../components/FamilyTreeView';
import VerificationStatus from '../components/VerificationStatus';
import HouseholdMapPinning from '../components/HouseholdMapPinning';
import OfflineIndicator from '../components/OfflineIndicator';
import { 
  Home,
  User,
  FileText,
  AlertTriangle,
  QrCode,
  Users,
  Shield,
  MapPin,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  Building2,
  ChevronRight
} from 'lucide-react';

export default function ResidentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Overview and quick actions' },
    { id: 'profile', label: 'My Profile', icon: User, description: 'Personal information and settings' },
    { id: 'documents', label: 'Documents', icon: FileText, description: 'Request and track documents' },
    { id: 'incidents', label: 'Report Incident', icon: AlertTriangle, description: 'Report issues and complaints' },
    { id: 'qr-code', label: 'My QR Code', icon: QrCode, description: 'Digital identification' },
    { id: 'family', label: 'Family Tree', icon: Users, description: 'Manage family members' },
    { id: 'verification', label: 'Verification', icon: Shield, description: 'Account verification status' },
    { id: 'location', label: 'House Location', icon: MapPin, description: 'Pin your house location' }
  ];

  const getActiveMenuItem = () => {
    return menuItems.find(item => item.id === activeTab) || menuItems[0];
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ResidentDashboardOverview />;
      case 'profile':
        return <ResidentProfileView />;
      case 'documents':
        return <ResidentDocumentList />;
      case 'incidents':
        return <ResidentIncidentList />;
      case 'qr-code':
        return <QRCodeDisplay />;
      case 'family':
        return <FamilyTreeView />;
      case 'verification':
        return <VerificationStatus />;
      case 'location':
        return <HouseholdMapPinning />;
      default:
        return <ResidentDashboardOverview />;
    }
  };

  const getVerificationStatusColor = () => {
    switch (user?.verificationStatus) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'semi-verified':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'details-updated':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <OfflineIndicator />
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Resident Portal</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-400" />
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-screen lg:h-auto">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:h-screen ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Resident Portal</h1>
                <p className="text-sm text-gray-600">Barangay San Miguel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mt-2 ${getVerificationStatusColor()}`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {user?.verificationStatus?.replace('-', ' ') || 'Non Verified'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 ${
                  activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                }`} />
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${
                    activeTab === item.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </div>
                </div>
                {activeTab === item.id && (
                  <ChevronRight className="h-4 w-4 text-white" />
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Desktop Header */}
          <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
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
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Bell className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Settings className="h-5 w-5" />
                  </button>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-600">{user?.email}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user?.name?.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}