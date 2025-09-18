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
import ServiceRequests from '../components/ServiceRequests';
import EmergencyAlerts from '../components/EmergencyAlerts';
import HealthAid from '../components/HealthAid';
import BookAppointment from '../components/BookAppointment';
import AnnouncementsList from '../components/AnnouncementsList';
import BarangayMap from '../components/BarangayMap';
import CommunityChat from '../components/CommunityChat';
import InfoCenter from '../components/InfoCenter';
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
  ChevronRight,
  Wrench,
  Heart,
  Calendar,
  MessageSquare,
  Info,
  PhoneCall
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
    // Main Section
    { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Overview and quick actions', section: 'Main' },
    { id: 'profile', label: 'My Profile', icon: User, description: 'Personal information and settings', section: 'Main' },
    { id: 'qr-code', label: 'My QR Code', icon: QrCode, description: 'Digital identification', section: 'Main' },
    { id: 'household', label: 'Household', icon: Users, description: 'Family members and household info', section: 'Main' },
    
    // Services Section
    { id: 'documents', label: 'Document Requests', icon: FileText, description: 'Request and track documents', section: 'Services' },
    { id: 'incidents', label: 'Incident Reports', icon: Shield, description: 'Report issues and complaints', section: 'Services' },
    { id: 'service-requests', label: 'Service Requests', icon: Wrench, description: 'Request barangay services', section: 'Services' },
    { id: 'emergency-alerts', label: 'Emergency Alerts', icon: AlertTriangle, description: 'Emergency notifications', section: 'Services' },
    { id: 'health-aid', label: 'Health & Aid', icon: Heart, description: 'Health services and assistance', section: 'Services' },
    { id: 'book-appointment', label: 'Book Appointment', icon: Calendar, description: 'Schedule appointments', section: 'Services' },
    
    // Community Section
    { id: 'announcements', label: 'Announcements', icon: Bell, description: 'Community news and updates', section: 'Community' },
    { id: 'barangay-map', label: 'Barangay Map', icon: MapPin, description: 'Interactive community map', section: 'Community' },
    { id: 'community-chat', label: 'Community Chat', icon: MessageSquare, description: 'Connect with neighbors', section: 'Community' },
    { id: 'info-center', label: 'Info Center', icon: Info, description: 'Helpful information and guides', section: 'Community' },
    
    // Emergency Section
    { id: 'call-911', label: 'Call 911', icon: PhoneCall, description: 'Emergency hotline', section: 'Emergency' }
  ];

  const getActiveMenuItem = () => {
    return menuItems.find(item => item.id === activeTab) || menuItems[0];
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ResidentDashboardOverview setActiveTab={setActiveTab} />;
      case 'profile':
        return <ResidentProfileView />;
      case 'documents':
        return <ResidentDocumentList />;
      case 'incidents':
        return <ResidentIncidentList />;
      case 'qr-code':
        return <QRCodeDisplay />;
      case 'household':
        return <FamilyTreeView />;
      case 'verification':
        return <VerificationStatus />;
      case 'location':
        return <HouseholdMapPinning />;
      case 'service-requests':
        return <ServiceRequests />;
      case 'emergency-alerts':
        return <EmergencyAlerts />;
      case 'health-aid':
        return <HealthAid />;
      case 'book-appointment':
        return <BookAppointment />;
      case 'announcements':
        return <AnnouncementsList />;
      case 'barangay-map':
        return <BarangayMap />;
      case 'community-chat':
        return <CommunityChat />;
      case 'info-center':
        return <InfoCenter />;
      case 'call-911':
        return <EmergencyCall />;
      default:
        return <ResidentDashboardOverview setActiveTab={setActiveTab} />;
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
              <span className="font-semibold text-gray-900">Bucana Portal</span>
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
        <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-gray-900 text-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:h-screen ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-gray-900" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Bucana Portal</h1>
                <p className="text-sm text-gray-300">Resident</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
            {Object.entries(groupedMenuItems).map(([section, items]) => (
              <div key={section}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {section}
                </h3>
                <div className="space-y-1">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'call-911') {
                          window.open('tel:911', '_self');
                        } else {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }
                      }}
                      className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200 group ${
                        activeTab === item.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      } ${item.id === 'call-911' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
                    >
                      <item.icon className={`h-5 w-5 mr-3 ${
                        activeTab === item.id ? 'text-white' : 
                        item.id === 'call-911' ? 'text-white' : 'text-gray-400 group-hover:text-white'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                      </div>
                      {activeTab === item.id && item.id !== 'call-911' && (
                        <ChevronRight className="h-4 w-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white text-sm">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getVerificationStatusColor()}`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {user?.verificationStatus?.replace('-', ' ') || 'Non Verified'}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Settings className="h-4 w-4 mx-auto text-gray-300" />
              </button>
              <button className="flex-1 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Bell className="h-4 w-4 mx-auto text-gray-300" />
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4 mx-auto text-white" />
              </button>
            </div>
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

// Emergency Call Component
function EmergencyCall() {
  return (
    <div className="space-y-8">
      <div className="bg-red-600 rounded-xl shadow-sm border border-red-200 p-8 text-white text-center">
        <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <PhoneCall className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Emergency Hotline</h1>
        <p className="text-red-100 text-lg mb-8">
          For immediate emergency assistance, call 911 or contact our barangay emergency response team
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:911"
            className="bg-white text-red-600 px-8 py-4 rounded-xl hover:bg-red-50 transition-colors font-bold text-xl"
          >
            📞 Call 911
          </a>
          <a
            href="tel:+6328123456"
            className="bg-red-700 text-white px-8 py-4 rounded-xl hover:bg-red-800 transition-colors font-bold"
          >
            📞 Barangay Emergency
          </a>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Emergency Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg">
              <PhoneCall className="h-6 w-6 text-red-600" />
              <div>
                <h4 className="font-medium text-gray-900">Police Emergency</h4>
                <p className="text-sm text-gray-600">911 or 117</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg">
              <Heart className="h-6 w-6 text-red-600" />
              <div>
                <h4 className="font-medium text-gray-900">Medical Emergency</h4>
                <p className="text-sm text-gray-600">911 or Red Cross</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <div>
                <h4 className="font-medium text-gray-900">Fire Emergency</h4>
                <p className="text-sm text-gray-600">911 or 116</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Barangay Hall</h4>
                <p className="text-sm text-gray-600">+63 2 8123 4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}