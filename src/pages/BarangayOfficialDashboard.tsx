import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Sidebar from '../components/Sidebar';
import ResidentManagement from '../components/ResidentManagement';
import ProjectGallery from '../components/ProjectGallery';
import Analytics from '../components/Analytics';
import { 
  Users, 
  FileText, 
  Camera, 
  BarChart3, 
  Activity, 
  LogOut,
  Bell,
  Calendar,
  MapPin,
  Heart,
  Calculator,
  AlertTriangle,
  Plus,
  TrendingUp,
  Shield,
  CheckCircle,
  Clock,
  UserCheck,
  Building2,
  Settings,
  Eye,
  Download,
  Filter,
  Search
} from 'lucide-react';

export default function BarangayOfficialDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();
  const { residents } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/');
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'residents', label: 'Resident Management', icon: Users },
    { id: 'documents', label: 'Document Processing', icon: FileText },
    { id: 'projects', label: 'Projects & Gallery', icon: Camera },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'portals', label: 'Portal Access', icon: Building2 }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <BarangayOfficialOverview />;
      case 'residents':
        return <ResidentManagement />;
      case 'documents':
        return <DocumentProcessing />;
      case 'projects':
        return <ProjectGallery />;
      case 'announcements':
        return <AnnouncementManagement />;
      case 'analytics':
        return <Analytics />;
      case 'portals':
        return <PortalAccess />;
      default:
        return <BarangayOfficialOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole="barangay-official"
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Barangay Official Dashboard
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:block text-gray-600">Welcome, {user?.name}</span>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
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

function BarangayOfficialOverview() {
  const { residents } = useData();
  
  const stats = [
    { label: 'Total Residents', value: residents.length, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Verified Residents', value: residents.filter(r => r.verificationStatus === 'verified').length, icon: Shield, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Pending Documents', value: '23', icon: FileText, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { label: 'Active Projects', value: '8', icon: Camera, color: 'text-purple-600', bgColor: 'bg-purple-100' }
  ];

  const recentActivities = [
    { id: 1, action: 'New resident registration', user: 'Maria Santos', time: '2 minutes ago', type: 'registration' },
    { id: 2, action: 'Document approved', user: 'Juan Dela Cruz', time: '15 minutes ago', type: 'approval' },
    { id: 3, action: 'Project updated', user: 'Road Improvement', time: '1 hour ago', type: 'project' },
    { id: 4, action: 'Announcement published', user: 'Health Drive', time: '2 hours ago', type: 'announcement' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/medical-portal"
            className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Heart className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <h4 className="font-semibold text-gray-900">Medical Portal</h4>
              <p className="text-sm text-gray-600">Health management</p>
            </div>
          </Link>
          
          <Link
            to="/accounting-portal"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Calculator className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h4 className="font-semibold text-gray-900">Accounting Portal</h4>
              <p className="text-sm text-gray-600">Financial management</p>
            </div>
          </Link>
          
          <Link
            to="/disaster-portal"
            className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <h4 className="font-semibold text-gray-900">Disaster Portal</h4>
              <p className="text-sm text-gray-600">Emergency management</p>
            </div>
          </Link>
          
          <button className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Plus className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h4 className="font-semibold text-gray-900">New Document</h4>
              <p className="text-sm text-gray-600">Process request</p>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'registration' ? 'bg-blue-500' :
                  activity.type === 'approval' ? 'bg-green-500' :
                  activity.type === 'project' ? 'bg-purple-500' : 'bg-orange-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Medical Portal</span>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Accounting Portal</span>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Disaster Portal</span>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Document Processing</span>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-yellow-600">Processing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Portal Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrated Portal Network</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/medical-portal"
              className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <Heart className="h-6 w-6 text-red-600" />
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <h4 className="font-semibold text-red-800">Medical Portal</h4>
              <p className="text-xs text-red-700">Health center operational</p>
            </Link>
            
            <Link
              to="/accounting-portal"
              className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <Calculator className="h-6 w-6 text-green-600" />
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <h4 className="font-semibold text-green-800">Accounting Portal</h4>
              <p className="text-xs text-green-700">Financial systems online</p>
            </Link>
            
            <Link
              to="/disaster-portal"
              className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <h4 className="font-semibold text-orange-800">Disaster Portal</h4>
              <p className="text-xs text-orange-700">Emergency systems enhanced</p>
            </Link>
            
            <Link
              to="/security-portal"
              className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <Shield className="h-6 w-6 text-purple-600" />
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <h4 className="font-semibold text-purple-800">Security Portal</h4>
              <p className="text-xs text-purple-700">Security network active</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentProcessing() {
  const [documents] = useState([
    { id: 1, type: 'Barangay Clearance', resident: 'Maria Santos', status: 'pending', date: '2024-03-15', fee: 50 },
    { id: 2, type: 'Business Permit', resident: 'Juan Dela Cruz', status: 'processing', date: '2024-03-14', fee: 200 },
    { id: 3, type: 'Certificate of Residency', resident: 'Ana Garcia', status: 'ready', date: '2024-03-13', fee: 30 },
    { id: 4, type: 'Barangay ID', resident: 'Pedro Martinez', status: 'released', date: '2024-03-12', fee: 100 }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'released': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Document Processing</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{documents.filter(d => d.status === 'pending').length}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600">{documents.filter(d => d.status === 'processing').length}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ready</p>
              <p className="text-2xl font-bold text-green-600">{documents.filter(d => d.status === 'ready').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Released</p>
              <p className="text-2xl font-bold text-gray-600">{documents.filter(d => d.status === 'released').length}</p>
            </div>
            <UserCheck className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.resident}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{doc.fee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      Process
                    </button>
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

function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Community Health Drive',
      content: 'Free medical checkup and vaccination for all residents.',
      type: 'health',
      priority: 'high' as 'low' | 'medium' | 'high',
      status: 'published',
      date: '2024-03-15'
    },
    {
      id: 2,
      title: 'Road Maintenance Schedule',
      content: 'Main Street will undergo maintenance from March 25-27.',
      type: 'notice',
      priority: 'medium' as 'low' | 'medium' | 'high',
      status: 'draft',
      date: '2024-03-14'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Announcements</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    announcement.type === 'health' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {announcement.type.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                    announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {announcement.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    announcement.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {announcement.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                <p className="text-gray-600 mb-2">{announcement.content}</p>
                <p className="text-sm text-gray-500">{announcement.date}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-800">Edit</button>
                <button className="text-red-600 hover:text-red-800">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortalAccess() {
  const portals = [
    {
      name: 'Medical Portal',
      description: 'Health center management and patient records',
      icon: Heart,
      color: 'red',
      link: '/medical-portal',
      status: 'online'
    },
    {
      name: 'Accounting Portal',
      description: 'Financial management and revenue tracking',
      icon: Calculator,
      color: 'green',
      link: '/accounting-portal',
      status: 'online'
    },
    {
      name: 'Disaster Portal',
      description: 'Emergency management and disaster response',
      icon: AlertTriangle,
      color: 'orange',
      link: '/disaster-portal',
      status: 'online'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Portal Access</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portals.map((portal, index) => (
          <Link
            key={index}
            to={portal.link}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${portal.color}-100`}>
                <portal.icon className={`h-8 w-8 text-${portal.color}-600`} />
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                portal.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {portal.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{portal.name}</h3>
            <p className="text-gray-600 text-sm">{portal.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}