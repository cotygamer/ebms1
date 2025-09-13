import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import KYCVerificationCenter from '../components/KYCVerificationCenter';
import ResidentManagement from '../components/ResidentManagement';
import { 
  Building2, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Heart, 
  Calculator, 
  AlertTriangle, 
  LogOut, 
  ArrowLeft,
  Bell,
  Calendar,
  MapPin,
  Shield,
  Activity,
  Camera,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  UserPlus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  UserCheck,
  Home,
  Phone,
  Mail
} from 'lucide-react';

export default function BarangayOfficialDashboard() {
  const { user, logout } = useAuth();
  const { residents } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    { 
      label: 'Total Residents', 
      value: residents.length.toString(), 
      icon: Users, 
      color: 'bg-blue-500',
      trend: '+12 this month'
    },
    { 
      label: 'Verified Residents', 
      value: residents.filter(r => r.verificationStatus === 'verified').length.toString(), 
      icon: Shield, 
      color: 'bg-green-500',
      trend: '+8 this month'
    },
    { 
      label: 'Pending Verification', 
      value: residents.filter(r => r.verificationStatus === 'semi-verified').length.toString(), 
      icon: Clock, 
      color: 'bg-yellow-500',
      trend: '5 awaiting approval'
    },
    { 
      label: 'Documents Processed', 
      value: '2,341', 
      icon: FileText, 
      color: 'bg-purple-500',
      trend: '+156 this month'
    }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.trend}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('kyc-verification')}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <UserCheck className="h-8 w-8 text-blue-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Verify Residents</h4>
              <p className="text-sm text-gray-600">Review KYC applications</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('residents')}
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Manage Residents</h4>
              <p className="text-sm text-gray-600">View resident profiles</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <FileText className="h-8 w-8 text-purple-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Process Documents</h4>
              <p className="text-sm text-gray-600">Handle document requests</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <Bell className="h-8 w-8 text-red-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Send Announcements</h4>
              <p className="text-sm text-gray-600">Notify residents</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Verification Requests */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Verification Requests</h3>
          <button 
            onClick={() => setActiveTab('kyc-verification')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {residents.filter(r => r.verificationStatus === 'semi-verified').slice(0, 5).map((resident) => (
            <div key={resident.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{resident.name}</p>
                  <p className="text-sm text-gray-600">Semi-verified • Awaiting approval</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setActiveTab('kyc-verification')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'residents':
        return <ResidentManagement />;
      case 'kyc-verification':
        return <KYCVerificationCenter />;
      case 'documents':
        return <div className="text-center py-12"><FileText className="h-24 w-24 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Document management coming soon</p></div>;
      case 'announcements':
        return <div className="text-center py-12"><Bell className="h-24 w-24 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Announcement system coming soon</p></div>;
      case 'analytics':
        return <div className="text-center py-12"><BarChart3 className="h-24 w-24 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Analytics dashboard coming soon</p></div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                  <Building2 className="mr-3 h-8 w-8" />
                  Barangay Official Dashboard
                </h1>
                <p className="text-green-100 mt-2 text-sm sm:text-base">Comprehensive Community Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-green-100 text-sm">Welcome, {user?.name}</p>
                <p className="text-xs text-green-200 capitalize">{user?.role?.replace('-', ' ')}</p>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-green-200 hover:text-white hover:bg-green-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'residents', label: 'Residents', icon: Users },
              { id: 'kyc-verification', label: 'KYC Verification', icon: UserCheck },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'announcements', label: 'Announcements', icon: Bell },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
        
        {/* Portal Links Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Specialized Portals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/medical-portal"
              className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Heart className="h-8 w-8 text-red-600 mr-3" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Medical Portal</h4>
                <p className="text-sm text-gray-600">Health center management</p>
              </div>
            </Link>
            
            <Link
              to="/accounting-portal"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Calculator className="h-8 w-8 text-blue-600 mr-3" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Accounting Portal</h4>
                <p className="text-sm text-gray-600">Financial management</p>
              </div>
            </Link>
            
            <Link
              to="/disaster-portal-dashboard"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">NDRRMC Portal</h4>
                <p className="text-sm text-gray-600">Emergency management</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}