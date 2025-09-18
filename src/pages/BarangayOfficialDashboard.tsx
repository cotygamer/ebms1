import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import ResidentManagement from '../components/ResidentManagement';
import UserManagement from '../components/UserManagement';
import ProjectGallery from '../components/ProjectGallery';
import Analytics from '../components/Analytics';
import { Users, Activity, FileText, Shield, Heart, Calculator, AlertTriangle, UserCog, Camera, BarChart3, Bell, Calendar, Settings, LogOut, MapPin, Phone, Mail } from 'lucide-react';
import { Globe, CheckCircle } from 'lucide-react';

export default function BarangayOfficialDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'residents', label: 'Residents', icon: Users },
    { id: 'officials', label: 'Officials Management', icon: UserCog },
    { id: 'projects', label: 'Projects & Gallery', icon: Camera },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: Shield },
    { id: 'social-media', label: 'Social Media Settings', icon: Globe },
    { id: 'contact-messages', label: 'Contact Messages', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OfficialOverview />;
      case 'residents':
        return <ResidentManagement />;
      case 'officials':
        return <BarangayOfficialsManagement />;
      case 'projects':
        return <ProjectGallery />;
      case 'documents':
        return <DocumentManagement />;
      case 'analytics':
        return <Analytics />;
      case 'announcements':
        return <AnnouncementManagement />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'reports':
        return <ReportsManagement />;
      case 'social-media':
        return <SocialMediaSettings />;
      case 'contact-messages':
        return <ContactMessages />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return <OfficialOverview />;
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

function BarangayOfficialsManagement() {
  const [officials, setOfficials] = useState([
    {
      id: '1',
      name: 'Hon. Maria Elena Santos',
      position: 'Barangay Captain',
      email: 'captain@barangaysanmiguel.gov.ph',
      phone: '+63 912 345 6789',
      termStart: '2019-05-13',
      termEnd: '2025-05-13',
      status: 'active',
      address: '123 Main St, Barangay Center'
    },
    {
      id: '2',
      name: 'Hon. Juan Carlos Reyes',
      position: 'Kagawad - Health & Sanitation',
      email: 'health@barangaysanmiguel.gov.ph',
      phone: '+63 917 234 5678',
      termStart: '2019-05-13',
      termEnd: '2025-05-13',
      status: 'active',
      address: '456 Oak Ave, Barangay North'
    },
    {
      id: '3',
      name: 'Hon. Ana Marie Cruz',
      position: 'Kagawad - Education & Youth',
      email: 'education@barangaysanmiguel.gov.ph',
      phone: '+63 918 345 6789',
      termStart: '2019-05-13',
      termEnd: '2025-05-13',
      status: 'active',
      address: '789 Pine St, Barangay South'
    }
  ]);
  
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  const [showAddOfficial, setShowAddOfficial] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Barangay Officials</h2>
        <button
          onClick={() => setShowAddOfficial(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Add Official
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {officials.map((official) => (
          <div key={official.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <UserCog className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{official.name}</h3>
              <p className="text-sm text-green-600 font-medium">{official.position}</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">{official.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">{official.phone}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">{official.address}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">Term: {official.termStart} - {official.termEnd}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingOfficial(official)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => setSelectedOfficial(official)}
                  className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Election Information</h3>
        <p className="text-sm text-blue-700 mb-2">
          Next Barangay Election: <strong>October 30, 2025</strong>
        </p>
        <p className="text-xs text-blue-600">
          Officials can be updated after election results are finalized.
        </p>
      </div>
    </div>
  );
}

function OfficialOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Residents</p>
              <p className="text-3xl font-bold text-blue-600">1,245</p>
            </div>
            <Users className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified Residents</p>
              <p className="text-3xl font-bold text-green-600">892</p>
            </div>
            <Shield className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
              <p className="text-3xl font-bold text-yellow-600">45</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/medical-portal"
            className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Heart className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Medical Portal</h3>
              <p className="text-sm text-gray-600">Access health center system</p>
            </div>
          </Link>
          <Link
            to="/accounting-portal"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Calculator className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Accounting Portal</h3>
              <p className="text-sm text-gray-600">Access accounting system</p>
            </div>
          </Link>
          <Link
            to="/disaster-portal"
            className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Disaster Portal</h3>
              <p className="text-sm text-gray-600">Access disaster management</p>
            </div>
          </Link>
        </div>
        
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-800">Total Residents</h3>
            <p className="text-2xl font-bold text-blue-600">1,245</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800">Verified</h3>
            <p className="text-2xl font-bold text-green-600">892</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <FileText className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-semibold text-yellow-800">Documents</h3>
            <p className="text-2xl font-bold text-yellow-600">156</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-800">Appointments</h3>
            <p className="text-2xl font-bold text-purple-600">24</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentManagement() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Requests</h2>
        <div className="space-y-4">
          {[
            { name: 'Juan Dela Cruz', document: 'Barangay Clearance', status: 'pending', date: '2024-03-15' },
            { name: 'Maria Santos', document: 'Certificate of Residency', status: 'approved', date: '2024-03-14' },
            { name: 'Pedro Garcia', document: 'Business Permit', status: 'processing', date: '2024-03-13' },
          ].map((request, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">{request.name}</h3>
                <p className="text-sm text-gray-600">{request.document} - {request.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {request.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportsManagement() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Population Report</h3>
            <p className="text-sm text-blue-600 mt-2">Total residents: 1,245</p>
            <p className="text-sm text-blue-600">New registrations: 23</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Revenue Report</h3>
            <p className="text-sm text-green-600 mt-2">Total collected: ₱45,300</p>
            <p className="text-sm text-green-600">Document fees: ₱12,500</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'New Digital ID Registration',
      content: 'All residents are encouraged to register for the new digital ID system.',
      type: 'important',
      status: 'published',
      date: '2024-03-15',
      author: 'Barangay Captain'
    },
    {
      id: 2,
      title: 'Community Health Fair',
      content: 'Free medical checkups and vaccinations for all residents.',
      type: 'event',
      status: 'draft',
      date: '2024-03-12',
      author: 'Health Officer'
    }
  ]);

  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'important' as 'important' | 'event' | 'notice',
    status: 'published' as 'published' | 'draft'
  });
  const { user } = useAuth();

  const handleAddAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      const announcement = {
        id: Date.now(),
        ...newAnnouncement,
        date: new Date().toISOString().split('T')[0],
        author: user?.name || 'Barangay Official'
      };
      setAnnouncements(prev => [announcement, ...prev]);
      setNewAnnouncement({
        title: '',
        content: '',
        type: 'important',
        status: 'published'
      });
      setShowAddAnnouncement(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Announcement Management</h2>
        <button 
          onClick={() => setShowAddAnnouncement(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Create Announcement
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <tr key={announcement.id}>
                  <td className="px-4 sm:px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{announcement.title}</div>
                      <div className="text-sm text-gray-500 hidden sm:block">{announcement.content.substring(0, 50)}...</div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      announcement.type === 'important' ? 'bg-red-100 text-red-800' :
                      announcement.type === 'event' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {announcement.type}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      announcement.status === 'published' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {announcement.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {announcement.date}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-2 sm:mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Announcement Modal */}
      {showAddAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Announcement</h3>
                <button
                  onClick={() => setShowAddAnnouncement(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter announcement title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter announcement content"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newAnnouncement.type}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="important">Important</option>
                    <option value="event">Event</option>
                    <option value="notice">Notice</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newAnnouncement.status}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddAnnouncement(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAnnouncement}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Create Announcement
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
    {
      id: 1,
      resident: 'Juan Dela Cruz',
      service: 'Document Processing',
      type: 'Barangay Clearance',
      date: '2024-03-20',
      time: '10:00 AM',
      status: 'confirmed'
    },
    {
      id: 2,
      resident: 'Maria Santos',
      service: 'Health Consultation',
      type: 'General Checkup',
      date: '2024-03-25',
      time: '2:00 PM',
      status: 'pending'
    }
  ]);

  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    resident: '',
    service: '',
    type: '',
    date: '',
    time: '',
    status: 'pending' as 'pending' | 'confirmed' | 'completed' | 'cancelled'
  });

  const handleAddAppointment = () => {
    if (newAppointment.resident && newAppointment.service && newAppointment.date && newAppointment.time) {
      const appointment = {
        id: Date.now(),
        ...newAppointment
      };
      setAppointments(prev => [appointment, ...prev]);
      setNewAppointment({
        resident: '',
        service: '',
        type: '',
        date: '',
        time: '',
        status: 'pending'
      });
      setShowAddAppointment(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Appointment Management</h2>
        <button 
          onClick={() => setShowAddAppointment(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Schedule Appointment
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Appointments</h3>
          <p className="text-3xl font-bold text-blue-600">8</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">This Week</h3>
          <p className="text-3xl font-bold text-green-600">24</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">5</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resident
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{appointment.resident}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-sm text-gray-900">{appointment.service}</div>
                    <div className="text-sm text-gray-500 hidden sm:block">{appointment.type}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-sm text-gray-900">{appointment.date}</div>
                    <div className="text-sm text-gray-500 hidden sm:block">{appointment.time}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900 mr-1 sm:mr-3">Confirm</button>
                    <button className="text-blue-600 hover:text-blue-900 mr-1 sm:mr-3">Reschedule</button>
                    <button className="text-red-600 hover:text-red-900">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Schedule New Appointment</h3>
                <button
                  onClick={() => setShowAddAppointment(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resident Name</label>
                <input
                  type="text"
                  value={newAppointment.resident}
                  onChange={(e) => setNewAppointment({ ...newAppointment, resident: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter resident name"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                  <select
                    value={newAppointment.service}
                    onChange={(e) => setNewAppointment({ ...newAppointment, service: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select service</option>
                    <option value="Document Processing">Document Processing</option>
                    <option value="Health Consultation">Health Consultation</option>
                    <option value="Business Permit">Business Permit</option>
                    <option value="Barangay Clearance">Barangay Clearance</option>
                    <option value="Certificate Request">Certificate Request</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type/Details</label>
                  <input
                    type="text"
                    value={newAppointment.type}
                    onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter service details"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <select
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select time</option>
                    <option value="8:00 AM">8:00 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newAppointment.status}
                  onChange={(e) => setNewAppointment({ ...newAppointment, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddAppointment(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAppointment}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Schedule Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsManagement() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Portal Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Email Notifications</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">SMS Alerts</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Push Notifications</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portal Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default View</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Overview Dashboard</option>
                <option>Resident Management</option>
                <option>Analytics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Items per Page</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <p className="font-medium text-gray-900">Office Address</p>
              <p className="text-gray-600">San Miguel, Metro Manila, Philippines</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Phone className="h-5 w-5 text-green-600 mt-1" />
            <div>
              <p className="font-medium text-gray-900">Phone</p>
              <p className="text-gray-600">+63 2 8123 4567</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-purple-600 mt-1" />
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-gray-600">official@barangaysanmiguel.gov.ph</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialMediaSettings() {
  const [socialMedia, setSocialMedia] = useState({
    facebook: 'https://facebook.com/barangaysanmiguel',
    twitter: 'https://twitter.com/barangaysanmiguel',
    instagram: 'https://instagram.com/barangaysanmiguel',
    youtube: 'https://youtube.com/barangaysanmiguel',
    enabled: {
      facebook: true,
      twitter: true,
      instagram: true,
      youtube: false
    }
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateSocialMedia = async () => {
    setIsUpdating(true);
    setMessage('');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('socialMediaSettings', JSON.stringify(socialMedia));
      setMessage('Social media settings updated successfully!');
    } catch (error) {
      setMessage('Failed to update social media settings. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleSocialMedia = (platform: string) => {
    setSocialMedia(prev => ({
      ...prev,
      enabled: {
        ...prev.enabled,
        [platform]: !prev.enabled[platform as keyof typeof prev.enabled]
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Social Media Settings</h2>
        <button
          onClick={handleUpdateSocialMedia}
          disabled={isUpdating}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? 'Updating...' : 'Save Changes'}
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

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h3>
        <div className="space-y-6">
          {/* Facebook */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">f</span>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                <input
                  type="url"
                  value={socialMedia.facebook}
                  onChange={(e) => setSocialMedia({...socialMedia, facebook: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://facebook.com/barangaysanmiguel"
                />
              </div>
            </div>
            <button
              onClick={() => toggleSocialMedia('facebook')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                socialMedia.enabled.facebook ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                socialMedia.enabled.facebook ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Twitter */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">𝕏</span>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter / X</label>
                <input
                  type="url"
                  value={socialMedia.twitter}
                  onChange={(e) => setSocialMedia({...socialMedia, twitter: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://twitter.com/barangaysanmiguel"
                />
              </div>
            </div>
            <button
              onClick={() => toggleSocialMedia('twitter')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                socialMedia.enabled.twitter ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                socialMedia.enabled.twitter ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Instagram */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">📷</span>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                <input
                  type="url"
                  value={socialMedia.instagram}
                  onChange={(e) => setSocialMedia({...socialMedia, instagram: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://instagram.com/barangaysanmiguel"
                />
              </div>
            </div>
            <button
              onClick={() => toggleSocialMedia('instagram')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                socialMedia.enabled.instagram ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                socialMedia.enabled.instagram ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* YouTube */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">▶</span>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
                <input
                  type="url"
                  value={socialMedia.youtube}
                  onChange={(e) => setSocialMedia({...socialMedia, youtube: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://youtube.com/barangaysanmiguel"
                />
              </div>
            </div>
            <button
              onClick={() => toggleSocialMedia('youtube')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                socialMedia.enabled.youtube ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                socialMedia.enabled.youtube ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Preview</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-3">This is how your social media links will appear on the website:</p>
          <div className="flex space-x-3">
            {socialMedia.enabled.facebook && (
              <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
                <span className="font-bold text-sm">f</span>
              </a>
            )}
            {socialMedia.enabled.twitter && (
              <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition-colors">
                <span className="font-bold text-sm">𝕏</span>
              </a>
            )}
            {socialMedia.enabled.instagram && (
              <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors">
                <span className="font-bold text-sm">📷</span>
              </a>
            )}
            {socialMedia.enabled.youtube && (
              <a href={socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors">
                <span className="font-bold text-sm">▶</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactMessages() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      email: 'juan@email.com',
      subject: 'Barangay Clearance Inquiry',
      message: 'Good day! I would like to inquire about the requirements for barangay clearance. Thank you.',
      date: '2024-03-15T10:30:00Z',
      status: 'unread',
      priority: 'normal'
    },
    {
      id: '2',
      firstName: 'Maria',
      lastName: 'Santos',
      email: 'maria@email.com',
      subject: 'Health Center Schedule',
      message: 'Hello, I would like to know the schedule of the health center for vaccination. My child needs to get vaccinated.',
      date: '2024-03-14T14:20:00Z',
      status: 'read',
      priority: 'high'
    },
    {
      id: '3',
      firstName: 'Pedro',
      lastName: 'Garcia',
      email: 'pedro@email.com',
      subject: 'Road Repair Request',
      message: 'The road in our area has potholes that need immediate attention. It\'s becoming dangerous for vehicles.',
      date: '2024-03-13T09:15:00Z',
      status: 'replied',
      priority: 'urgent'
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [replyText, setReplyText] = useState('');
  const { user } = useAuth();

  const filteredMessages = messages.filter(message => 
    filterStatus === 'all' || message.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-red-100 text-red-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'normal':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleMarkAsRead = (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, status: 'read' } : msg
    ));
  };

  const handleReply = (id: string) => {
    if (replyText.trim()) {
      setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, status: 'replied' } : msg
      ));
      setReplyText('');
      setSelectedMessage(null);
      // In real app, send email reply here
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Contact Messages</h2>
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-3xl font-bold text-green-600">{messages.length}</p>
            </div>
            <Mail className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-3xl font-bold text-red-600">
                {messages.filter(m => m.status === 'unread').length}
              </p>
            </div>
            <Bell className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Replied</p>
              <p className="text-3xl font-bold text-green-600">
                {messages.filter(m => m.status === 'replied').length}
              </p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgent</p>
              <p className="text-3xl font-bold text-orange-600">
                {messages.filter(m => m.priority === 'urgent').length}
              </p>
            </div>
            <AlertTriangle className="h-12 w-12 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMessages.map((message) => (
              <tr key={message.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {message.firstName} {message.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{message.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{message.subject}</div>
                  <div className="text-sm text-gray-500">
                    {message.message.substring(0, 50)}...
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getPriorityColor(message.priority)}`}>
                    {message.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}>
                    {message.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(message.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setSelectedMessage(message)}
                    className="text-green-600 hover:text-green-900"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {message.status === 'unread' && (
                    <button
                      onClick={() => handleMarkAsRead(message.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <UserCheck className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Message Details</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">From</label>
                  <p className="text-sm text-gray-900">
                    {selectedMessage.firstName} {selectedMessage.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedMessage.date).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <p className="text-sm text-gray-900">{selectedMessage.subject}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Message</label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-900">{selectedMessage.message}</p>
                </div>
              </div>
              
              {selectedMessage.status !== 'replied' && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Reply</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Type your reply here..."
                  />
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => handleReply(selectedMessage.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Send Reply
                    </button>
                    <button
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Mark as Read
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}