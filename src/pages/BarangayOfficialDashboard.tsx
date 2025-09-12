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
  Activity, 
  FileText, 
  Shield, 
  Heart, 
  Calculator, 
  AlertTriangle, 
  UserCog, 
  Camera, 
  BarChart3, 
  Bell, 
  Calendar, 
  Settings, 
  LogOut, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle, 
  Eye,
  Plus,
  Search,
  Filter,
  Download,
  Edit3,
  Trash2,
  MessageSquare,
  Clock,
  Star,
  X
} from 'lucide-react';

export default function BarangayOfficialDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();
  const { residents } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'residents', label: 'Resident Management', icon: Users },
    { id: 'documents', label: 'Document Processing', icon: FileText },
    { id: 'projects', label: 'Projects & Gallery', icon: Camera },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'portals', label: 'Portal Access', icon: Globe },
    { id: 'messages', label: 'Contact Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <BarangayOverview />;
      case 'residents':
        return <ResidentManagement />;
      case 'documents':
        return <DocumentProcessing />;
      case 'projects':
        return <ProjectGallery />;
      case 'announcements':
        return <AnnouncementManagement />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'analytics':
        return <Analytics />;
      case 'portals':
        return <PortalAccess />;
      case 'messages':
        return <ContactMessages />;
      case 'settings':
        return <BarangaySettings />;
      default:
        return <BarangayOverview />;
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

function BarangayOverview() {
  const { residents } = useData();
  
  const stats = [
    { label: 'Total Residents', value: residents.length, icon: Users, color: 'text-blue-600' },
    { label: 'Verified Residents', value: residents.filter(r => r.verificationStatus === 'verified').length, icon: Shield, color: 'text-green-600' },
    { label: 'Pending Documents', value: 23, icon: FileText, color: 'text-yellow-600' },
    { label: 'Active Projects', value: 6, icon: Camera, color: 'text-purple-600' }
  ];

  const recentActivities = [
    { id: 1, type: 'document', message: 'New barangay clearance request from Juan Dela Cruz', time: '2 minutes ago', icon: FileText },
    { id: 2, type: 'resident', message: 'Maria Santos completed verification process', time: '15 minutes ago', icon: CheckCircle },
    { id: 3, type: 'appointment', message: 'Appointment scheduled for tomorrow at 10:00 AM', time: '1 hour ago', icon: Calendar },
    { id: 4, type: 'project', message: 'Road improvement project updated', time: '2 hours ago', icon: Camera }
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <activity.icon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <FileText className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Process Documents</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Verify Residents</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Bell className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Create Announcement</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
              <Calendar className="h-8 w-8 text-yellow-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Schedule Meeting</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentProcessing() {
  const [documents] = useState([
    { id: 1, type: 'Barangay Clearance', resident: 'Juan Dela Cruz', status: 'pending', date: '2024-03-15', fee: 50 },
    { id: 2, type: 'Certificate of Residency', resident: 'Maria Santos', status: 'processing', date: '2024-03-14', fee: 30 },
    { id: 3, type: 'Business Permit', resident: 'Pedro Garcia', status: 'ready', date: '2024-03-13', fee: 1200 },
    { id: 4, type: 'Barangay ID', resident: 'Ana Lopez', status: 'released', date: '2024-03-12', fee: 100 }
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
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Document
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{doc.fee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
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
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Community Health Drive',
      content: 'Free medical checkup and vaccination for all residents.',
      type: 'health',
      priority: 'high',
      status: 'published',
      date: '2024-03-15',
      author: 'Barangay Health Center'
    },
    {
      id: 2,
      title: 'Road Maintenance Schedule',
      content: 'Main Street will undergo maintenance from March 25-27.',
      type: 'notice',
      priority: 'medium',
      status: 'draft',
      date: '2024-03-14',
      author: 'Public Works'
    }
  ]);

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'notice' as 'notice' | 'event' | 'important' | 'emergency' | 'weather' | 'evacuation' | 'health' | 'update',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const handleCreateAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      const announcement = {
        id: Date.now().toString(),
        ...newAnnouncement,
        author: user?.name || 'Barangay Official',
        date: new Date().toISOString().split('T')[0],
        status: 'published',
        createdAt: new Date().toISOString()
      };
      setAnnouncements(prev => [announcement, ...prev]);
      setNewAnnouncement({
        title: '',
        content: '',
        type: 'notice',
        priority: 'medium'
      });
      setShowAnnouncementModal(false);
      
      // Show success message for emergency announcements
      if (newAnnouncement.type === 'emergency' || newAnnouncement.type === 'weather') {
        alert(`${newAnnouncement.type.toUpperCase()} announcement published successfully! All residents will be notified immediately.`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Announcement Management</h2>
        <button 
          onClick={() => setShowAnnouncementModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    announcement.type === 'health' ? 'bg-red-100 text-red-800' :
                    announcement.type === 'notice' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {announcement.type}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    announcement.status === 'published' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {announcement.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{announcement.content}</p>
                <p className="text-sm text-gray-500">By {announcement.author} • {announcement.date}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Announcement</h3>
                <button
                  onClick={() => setShowAnnouncementModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter announcement title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter announcement content"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newAnnouncement.type}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="notice">General Notice</option>
                    <option value="event">Community Event</option>
                    <option value="important">Important Announcement</option>
                    <option value="emergency">🚨 Emergency Alert</option>
                    <option value="weather">🌧️ Weather Warning</option>
                    <option value="evacuation">🏃 Evacuation Notice</option>
                    <option value="health">🏥 Health Advisory</option>
                    <option value="update">📢 System Update</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                  {(newAnnouncement.type === 'emergency' || newAnnouncement.type === 'weather') && (
                    <p className="text-sm text-red-600 mt-1">
                      ⚠️ Emergency and weather announcements are automatically set to HIGH priority
                    </p>
                  )}
                </div>
              </div>
              
              {/* Emergency/Weather specific fields */}
              {(newAnnouncement.type === 'emergency' || newAnnouncement.type === 'weather' || newAnnouncement.type === 'evacuation') && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">🚨 Emergency Announcement</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-1">Affected Areas</label>
                      <input
                        type="text"
                        placeholder="e.g., Zone 1, Zone 2, All areas"
                        className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-1">Contact for Emergency</label>
                      <input
                        type="text"
                        placeholder="Emergency hotline or contact person"
                        className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sendSMS" className="rounded" />
                      <label htmlFor="sendSMS" className="text-sm text-red-700">Send SMS alerts to all residents</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="pushNotification" className="rounded" defaultChecked />
                      <label htmlFor="pushNotification" className="text-sm text-red-700">Send push notifications</label>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAnnouncement}
                  disabled={!newAnnouncement.title || !newAnnouncement.content}
                  className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    newAnnouncement.type === 'emergency' || newAnnouncement.type === 'weather' || newAnnouncement.type === 'evacuation'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {newAnnouncement.type === 'emergency' || newAnnouncement.type === 'weather' || newAnnouncement.type === 'evacuation'
                    ? '🚨 Publish Emergency Alert'
                    : 'Publish Announcement'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AppointmentManagement() {
  const [appointments, setAppointments] = useState([
    { id: 1, resident: 'Juan Dela Cruz', service: 'Document Processing', date: '2024-03-20', time: '09:00 AM', status: 'confirmed' },
    { id: 2, resident: 'Maria Santos', service: 'Consultation', date: '2024-03-20', time: '10:30 AM', status: 'pending' },
    { id: 3, resident: 'Pedro Garcia', service: 'Business Permit', date: '2024-03-21', time: '02:00 PM', status: 'completed' }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    resident: '',
    email: '',
    phone: '',
    service: '',
    serviceType: '',
    date: '',
    time: '',
    notes: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddAppointment = () => {
    if (newAppointment.resident && newAppointment.service && newAppointment.date && newAppointment.time) {
      const appointment = {
        id: Date.now(),
        ...newAppointment,
        status: 'pending'
      };
      setAppointments(prev => [...prev, appointment]);
      setNewAppointment({
        resident: '',
        email: '',
        phone: '',
        service: '',
        serviceType: '',
        date: '',
        time: '',
        notes: ''
      });
      setShowAddModal(false);
    }
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setNewAppointment({
      resident: appointment.resident,
      email: appointment.email || '',
      phone: appointment.phone || '',
      service: appointment.service,
      serviceType: appointment.serviceType || '',
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateAppointment = () => {
    if (selectedAppointment) {
      setAppointments(prev => prev.map(apt => 
        apt.id === selectedAppointment.id ? { ...apt, ...newAppointment } : apt
      ));
      setShowEditModal(false);
      setSelectedAppointment(null);
      setNewAppointment({
        resident: '',
        email: '',
        phone: '',
        service: '',
        serviceType: '',
        date: '',
        time: '',
        notes: ''
      });
    }
  };

  const updateStatus = (appointmentId, newStatus) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Appointment Management</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.resident}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => setSelectedAppointment(appointment)}
                      title="View Details"
                      className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEditAppointment(appointment)}
                      title="Edit Appointment"
                      className="text-green-600 hover:text-green-900">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    {appointment.status === 'pending' && (
                      <button 
                        onClick={() => updateStatus(appointment.id, 'confirmed')}
                        className="text-purple-600 hover:text-purple-900"
                        title="Confirm Appointment"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    {appointment.status === 'confirmed' && (
                      <button 
                        onClick={() => updateStatus(appointment.id, 'completed')}
                        className="text-green-600 hover:text-green-900"
                        title="Mark as Completed"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Schedule New Appointment</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resident Name *</label>
                  <input
                    type="text"
                    value={newAppointment.resident}
                    onChange={(e) => setNewAppointment({ ...newAppointment, resident: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter resident name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newAppointment.email}
                    onChange={(e) => setNewAppointment({ ...newAppointment, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={newAppointment.phone}
                    onChange={(e) => setNewAppointment({ ...newAppointment, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service *</label>
                  <select
                    value={newAppointment.service}
                    onChange={(e) => setNewAppointment({ ...newAppointment, service: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select service</option>
                    <option value="Document Processing">Document Processing</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Business Permit">Business Permit</option>
                    <option value="Verification">Verification</option>
                    <option value="Complaint">Complaint</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <input
                  type="text"
                  value={newAppointment.serviceType}
                  onChange={(e) => setNewAppointment({ ...newAppointment, serviceType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Specify the type of service needed"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <select
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select time</option>
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes or requirements"
                />
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAppointment}
                  disabled={!newAppointment.resident || !newAppointment.service || !newAppointment.date || !newAppointment.time}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Schedule Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit Appointment</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resident Name *</label>
                  <input
                    type="text"
                    value={newAppointment.resident}
                    onChange={(e) => setNewAppointment({ ...newAppointment, resident: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service *</label>
                  <select
                    value={newAppointment.service}
                    onChange={(e) => setNewAppointment({ ...newAppointment, service: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select service</option>
                    <option value="Document Processing">Document Processing</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Business Permit">Business Permit</option>
                    <option value="Verification">Verification</option>
                    <option value="Complaint">Complaint</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <select
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select time</option>
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAppointment}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Appointment Details Modal */}
      {selectedAppointment && !showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Resident</label>
                  <p className="text-gray-900">{selectedAppointment.resident}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Service</label>
                  <p className="text-gray-900">{selectedAppointment.service}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <p className="text-gray-900">{selectedAppointment.date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Time</label>
                  <p className="text-gray-900">{selectedAppointment.time}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEditAppointment(selectedAppointment)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </button>
                {selectedAppointment.status === 'pending' && (
                  <button
                    onClick={() => {
                      updateStatus(selectedAppointment.id, 'confirmed');
                      setSelectedAppointment({ ...selectedAppointment, status: 'confirmed' });
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm
                  </button>
                )}
                {selectedAppointment.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      updateStatus(selectedAppointment.id, 'completed');
                      setSelectedAppointment({ ...selectedAppointment, status: 'completed' });
                    }}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PortalAccess() {
  const portals = [
    {
      name: 'Medical Portal',
      description: 'Access health records, appointments, and medical services',
      icon: Heart,
      color: 'bg-red-500',
      link: '/medical-portal'
    },
    {
      name: 'Accounting Portal',
      description: 'Financial management, revenue tracking, and expenses',
      icon: Calculator,
      color: 'bg-green-500',
      link: '/accounting-portal'
    },
    {
      name: 'Disaster Management Portal',
      description: 'Emergency alerts, evacuation plans, and disaster response',
      icon: AlertTriangle,
      color: 'bg-orange-500',
      link: '/disaster-portal'
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
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className={`${portal.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                <portal.icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {portal.name}
                </h3>
                <p className="text-sm text-gray-600">{portal.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ContactMessages() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: 'Juan Dela Cruz',
      email: 'juan@email.com',
      subject: 'Document Processing Inquiry',
      message: 'I would like to inquire about the status of my barangay clearance application.',
      date: '2024-03-15',
      status: 'unread'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@email.com',
      subject: 'Community Event Suggestion',
      message: 'I suggest organizing a community clean-up drive next month.',
      date: '2024-03-14',
      status: 'read'
    }
  ]);
  
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  const markAsRead = (messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'read' } : msg
    ));
  };

  const markAsUnread = (messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'unread' } : msg
    ));
  };

  const handleReply = (message) => {
    setSelectedMessage(message);
    setShowReplyModal(true);
  };

  const sendReply = () => {
    if (replyText.trim()) {
      alert(`Reply sent to ${selectedMessage.email}: ${replyText}`);
      setShowReplyModal(false);
      setSelectedMessage(null);
      setReplyText('');
      markAsRead(selectedMessage.id);
    }
  };

  const viewMessage = (message) => {
    setSelectedMessage(message);
    markAsRead(message.id);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Contact Messages</h2>
      
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`bg-white rounded-lg shadow-sm p-6 ${message.status === 'unread' ? 'border-l-4 border-blue-500' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{message.subject}</h3>
                  {message.status === 'unread' && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">From: {message.name} ({message.email})</p>
                <p className="text-gray-700 mb-3">{message.message}</p>
                <p className="text-sm text-gray-500">{message.date}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  title="View Message"
                  onClick={() => viewMessage(message)}
                  className="text-blue-600 hover:text-blue-800">
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleReply(message)}
                  title="Reply"
                  className="text-green-600 hover:text-green-800">
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => message.status === 'read' ? markAsUnread(message.id) : markAsRead(message.id)}
                  className="text-purple-600 hover:text-purple-800"
                  title={message.status === 'read' ? 'Mark as Unread' : 'Mark as Read'}
                >
                  {message.status === 'read' ? <Clock className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && !showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{selectedMessage.subject}</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">From: {selectedMessage.name}</h4>
                  <span className="text-sm text-gray-500">{selectedMessage.date}</span>
                </div>
                <p className="text-sm text-gray-600">{selectedMessage.email}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Message:</h4>
                <p className="text-gray-700 leading-relaxed">{selectedMessage.message}</p>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleReply(selectedMessage)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Reply
                </button>
                <button
                  onClick={() => selectedMessage.status === 'read' ? markAsUnread(selectedMessage.id) : markAsRead(selectedMessage.id)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
                >
                  {selectedMessage.status === 'read' ? (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Mark Unread
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Read
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Reply to: {selectedMessage.name}</h3>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedMessage(null);
                    setReplyText('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Original Message:</h4>
                <p className="text-sm text-gray-700">"{selectedMessage.message}"</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply:</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your reply here..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedMessage(null);
                    setReplyText('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={sendReply}
                  disabled={!replyText.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BarangaySettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Barangay Settings</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Office Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Office Hours</label>
            <input
              type="text"
              defaultValue="8:00 AM - 5:00 PM"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
            <input
              type="tel"
              defaultValue="+63 2 8123 4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}