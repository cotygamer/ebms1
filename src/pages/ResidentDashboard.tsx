import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import VerificationStatus from '../components/VerificationStatus';
import QRCodeGenerator from '../components/QRCodeGenerator';
import FamilyTreeView from '../components/FamilyTreeView';
import { 
  User, 
  FileText, 
  Shield, 
  QrCode, 
  Users, 
  Calendar, 
  Bell, 
  Settings, 
  LogOut,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Camera,
  Upload,
 Building2,
 X,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function ResidentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'documents', label: 'Document Requests', icon: FileText },
    { id: 'verification', label: 'Verification Status', icon: Shield },
    { id: 'qr-code', label: 'My QR Code', icon: QrCode },
    { id: 'family', label: 'Family Tree', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ResidentOverview />;
      case 'profile':
        return <ResidentProfile />;
      case 'documents':
        return <DocumentRequests />;
      case 'verification':
        return <VerificationStatus />;
      case 'qr-code':
        return <QRCodeGenerator />;
      case 'family':
        return <FamilyTreeView />;
      case 'appointments':
        return <ResidentAppointments />;
      case 'announcements':
        return <ResidentAnnouncements />;
      case 'settings':
        return <ResidentSettings />;
      default:
        return <ResidentOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole="resident"
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Resident Dashboard
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:block text-gray-600">Welcome, {user?.name}</span>
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
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

function ResidentOverview() {
  const { user } = useAuth();
  
  const quickStats = [
    { label: 'Verification Status', value: user?.verificationStatus?.replace('-', ' ') || 'Non Verified', icon: Shield, color: 'text-green-600' },
    { label: 'Document Requests', value: '3', icon: FileText, color: 'text-blue-600' },
    { label: 'Family Members', value: user?.familyTree?.length || '0', icon: Users, color: 'text-purple-600' },
    { label: 'Appointments', value: '1', icon: Calendar, color: 'text-orange-600' }
  ];

  const recentActivities = [
    { id: 1, action: 'Document Request Submitted', item: 'Barangay Clearance', date: '2024-03-15', status: 'pending' },
    { id: 2, action: 'Appointment Scheduled', item: 'Health Consultation', date: '2024-03-14', status: 'confirmed' },
    { id: 3, action: 'Profile Updated', item: 'Contact Information', date: '2024-03-13', status: 'completed' }
  ];

  const announcements = [
    {
      id: 1,
      title: 'Community Health Drive - Free Medical Checkup',
      content: 'Free medical checkup and vaccination for all residents. Bring your barangay ID and health records.',
      type: 'health',
      priority: 'high',
      date: '2024-03-20',
      author: 'Barangay Health Center'
    },
    {
      id: 2,
      title: 'Road Maintenance Schedule',
      content: 'Main Street will undergo maintenance from March 25-27. Please use alternative routes.',
      type: 'notice',
      priority: 'medium',
      date: '2024-03-18',
      author: 'Public Works'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} capitalize`}>{stat.value}</p>
              </div>
              <stat.icon className={`h-10 w-10 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'completed' ? 'bg-green-500' :
                  activity.status === 'confirmed' ? 'bg-blue-500' :
                  'bg-yellow-500'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.item}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Announcements */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Announcements</h3>
          <div className="space-y-4">
            {announcements.slice(0, 2).map((announcement) => (
              <div key={announcement.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    announcement.type === 'health' ? 'bg-red-100 text-red-800' :
                    announcement.type === 'emergency' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {announcement.type.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">{announcement.date}</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{announcement.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.href = '#documents'}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
          >
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h4 className="font-semibold text-gray-900">Request Document</h4>
              <p className="text-sm text-gray-600">Apply for certificates</p>
            </div>
          </button>
          
          <button
            onClick={() => window.location.href = '#appointments'}
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
          >
            <Calendar className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h4 className="font-semibold text-gray-900">Book Appointment</h4>
              <p className="text-sm text-gray-600">Schedule consultation</p>
            </div>
          </button>
          
          <button
            onClick={() => window.location.href = '#qr-code'}
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
          >
            <QrCode className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h4 className="font-semibold text-gray-900">My QR Code</h4>
              <p className="text-sm text-gray-600">Digital identification</p>
            </div>
          </button>
          
          <button
            onClick={() => window.location.href = '#verification'}
            className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left"
          >
            <Shield className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <h4 className="font-semibold text-gray-900">Verification</h4>
              <p className="text-sm text-gray-600">Check status</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function ResidentProfile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([
    { id: 1, type: 'Valid Government ID', fileName: 'government_id.jpg', uploadDate: '2024-03-15', status: 'verified' },
    { id: 2, type: 'Proof of Address', fileName: 'utility_bill.pdf', uploadDate: '2024-03-14', status: 'pending' }
  ]);
  const [newDocument, setNewDocument] = useState({
    type: '',
    file: null as File | null
  });
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone_number || '+63 912 345 6789',
    address: user?.address || '123 Main St, Barangay Center',
    birthDate: '1990-01-15',
    gender: 'male',
    civilStatus: 'single',
    occupation: 'Software Developer',
    emergencyContact: 'Maria Dela Cruz - +63 917 123 4567',
    nationality: 'Filipino',
    religion: 'Roman Catholic',
    educationalAttainment: 'College Graduate',
    monthlyIncome: '₱25,000',
    employmentStatus: 'Employed',
    company: 'Tech Solutions Inc.',
    tinNumber: '123-456-789-000',
    sssNumber: '12-3456789-0',
    philhealthNumber: '12-345678901-2',
    pagibigNumber: '1234-5678-9012',
    votersId: 'VID-2024-001234',
    bloodType: 'O+',
    height: '170 cm',
    weight: '65 kg',
    medicalConditions: 'None',
    allergies: 'None known',
    emergencyContactRelation: 'Spouse',
    emergencyContactAddress: '123 Main St, Barangay Center'
  });

  const handleSave = () => {
    updateUser({ name: profileData.name, email: profileData.email });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleDocumentUpload = () => {
    if (newDocument.type && newDocument.file) {
      const document = {
        id: Date.now(),
        type: newDocument.type,
        fileName: newDocument.file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      setUploadedDocuments(prev => [...prev, document]);
      setNewDocument({ type: '', file: null });
      setShowDocumentUpload(false);
      alert('Document uploaded successfully! It will be reviewed within 24 hours.');
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">My Profile</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowDocumentUpload(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Documents
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{profileData.name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            {isEditing ? (
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.phone}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
            {isEditing ? (
              <input
                type="date"
                value={profileData.birthDate}
                onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.birthDate}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            {isEditing ? (
              <select
                value={profileData.gender}
                onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            ) : (
              <p className="text-gray-900 capitalize">{profileData.gender}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Civil Status</label>
            {isEditing ? (
              <select
                value={profileData.civilStatus}
                onChange={(e) => setProfileData({ ...profileData, civilStatus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widowed">Widowed</option>
                <option value="separated">Separated</option>
                <option value="divorced">Divorced</option>
              </select>
            ) : (
              <p className="text-gray-900 capitalize">{profileData.civilStatus}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.nationality}
                onChange={(e) => setProfileData({ ...profileData, nationality: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.nationality}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.religion}
                onChange={(e) => setProfileData({ ...profileData, religion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.religion}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
            {isEditing ? (
              <select
                value={profileData.bloodType}
                onChange={(e) => setProfileData({ ...profileData, bloodType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            ) : (
              <p className="text-gray-900">{profileData.bloodType}</p>
            )}
          </div>
          
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address</label>
            {isEditing ? (
              <textarea
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Employment Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          Employment Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
            {isEditing ? (
              <select
                value={profileData.employmentStatus}
                onChange={(e) => setProfileData({ ...profileData, employmentStatus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Employed">Employed</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Student">Student</option>
                <option value="Retired">Retired</option>
              </select>
            ) : (
              <p className="text-gray-900">{profileData.employmentStatus}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.occupation}
                onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.occupation}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company/Employer</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.company}
                onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.company}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.monthlyIncome}
                onChange={(e) => setProfileData({ ...profileData, monthlyIncome: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.monthlyIncome}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Educational Attainment</label>
            {isEditing ? (
              <select
                value={profileData.educationalAttainment}
                onChange={(e) => setProfileData({ ...profileData, educationalAttainment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Elementary">Elementary</option>
                <option value="High School">High School</option>
                <option value="Vocational">Vocational</option>
                <option value="College Graduate">College Graduate</option>
                <option value="Post Graduate">Post Graduate</option>
              </select>
            ) : (
              <p className="text-gray-900">{profileData.educationalAttainment}</p>
            )}
          </div>
        </div>
      </div>

      {/* Government IDs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Government IDs & Numbers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">TIN Number</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.tinNumber}
                onChange={(e) => setProfileData({ ...profileData, tinNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123-456-789-000"
              />
            ) : (
              <p className="text-gray-900 font-mono">{profileData.tinNumber}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SSS Number</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.sssNumber}
                onChange={(e) => setProfileData({ ...profileData, sssNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12-3456789-0"
              />
            ) : (
              <p className="text-gray-900 font-mono">{profileData.sssNumber}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PhilHealth Number</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.philhealthNumber}
                onChange={(e) => setProfileData({ ...profileData, philhealthNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12-345678901-2"
              />
            ) : (
              <p className="text-gray-900 font-mono">{profileData.philhealthNumber}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pag-IBIG Number</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.pagibigNumber}
                onChange={(e) => setProfileData({ ...profileData, pagibigNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1234-5678-9012"
              />
            ) : (
              <p className="text-gray-900 font-mono">{profileData.pagibigNumber}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voter's ID</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.votersId}
                onChange={(e) => setProfileData({ ...profileData, votersId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VID-2024-001234"
              />
            ) : (
              <p className="text-gray-900 font-mono">{profileData.votersId}</p>
            )}
          </div>
        </div>
      </div>

      {/* Health Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Heart className="h-5 w-5 mr-2" />
          Health Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.height}
                onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="170 cm"
              />
            ) : (
              <p className="text-gray-900">{profileData.height}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.weight}
                onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="65 kg"
              />
            ) : (
              <p className="text-gray-900">{profileData.weight}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.medicalConditions}
                onChange={(e) => setProfileData({ ...profileData, medicalConditions: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="None or list conditions"
              />
            ) : (
              <p className="text-gray-900">{profileData.medicalConditions}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.allergies}
                onChange={(e) => setProfileData({ ...profileData, allergies: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="None known or list allergies"
              />
            ) : (
              <p className="text-gray-900">{profileData.allergies}</p>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Phone className="h-5 w-5 mr-2" />
          Emergency Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.emergencyContact}
                onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Name - Phone Number"
              />
            ) : (
              <p className="text-gray-900">{profileData.emergencyContact}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
            {isEditing ? (
              <select
                value={profileData.emergencyContactRelation}
                onChange={(e) => setProfileData({ ...profileData, emergencyContactRelation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Child">Child</option>
                <option value="Relative">Relative</option>
                <option value="Friend">Friend</option>
              </select>
            ) : (
              <p className="text-gray-900">{profileData.emergencyContactRelation}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Address</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.emergencyContactAddress}
                onChange={(e) => setProfileData({ ...profileData, emergencyContactAddress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Emergency contact address"
              />
            ) : (
              <p className="text-gray-900">{profileData.emergencyContactAddress}</p>
            )}
          </div>
        </div>
      </div>

      {/* Uploaded Documents */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Uploaded Documents
          </h3>
          <button
            onClick={() => setShowDocumentUpload(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </button>
        </div>
        
        <div className="space-y-4">
          {uploadedDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{doc.type}</h4>
                  <p className="text-sm text-gray-600">{doc.fileName}</p>
                  <p className="text-xs text-gray-500">Uploaded: {doc.uploadDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDocumentStatusColor(doc.status)}`}>
                  {doc.status}
                </span>
                <button className="text-blue-600 hover:text-blue-800">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="text-green-600 hover:text-green-800">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {uploadedDocuments.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Documents Uploaded</h4>
            <p className="text-gray-600 mb-4">Upload your government IDs and supporting documents for verification.</p>
            <button
              onClick={() => setShowDocumentUpload(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Upload First Document
            </button>
          </div>
        )}
      </div>
        
        {isEditing && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

      {/* Document Upload Modal */}
      {showDocumentUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
              <button
                onClick={() => setShowDocumentUpload(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                <select
                  value={newDocument.type}
                  onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select document type</option>
                  <option value="Valid Government ID">Valid Government ID</option>
                  <option value="Birth Certificate">Birth Certificate</option>
                  <option value="Proof of Address">Proof of Address</option>
                  <option value="Marriage Certificate">Marriage Certificate</option>
                  <option value="Diploma/Certificate">Diploma/Certificate</option>
                  <option value="Employment Certificate">Employment Certificate</option>
                  <option value="Medical Certificate">Medical Certificate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => setNewDocument({ ...newDocument, file: e.target.files?.[0] || null })}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PDF, JPG, PNG, DOC, DOCX (Max 10MB)</p>
                  </label>
                  {newDocument.file && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Selected: {newDocument.file.name}</p>
                      <p className="text-xs text-blue-600">Size: {(newDocument.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">📋 Document Requirements</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Clear, readable image or scan</li>
                  <li>• Valid and not expired</li>
                  <li>• File size must be under 10MB</li>
                  <li>• Accepted formats: PDF, JPG, PNG, DOC, DOCX</li>
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowDocumentUpload(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDocumentUpload}
                disabled={!newDocument.type || !newDocument.file}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentRequests() {
  const [documents] = useState([
    { id: 1, type: 'Barangay Clearance', status: 'pending', requestDate: '2024-03-15', fee: 50 },
    { id: 2, type: 'Certificate of Residency', status: 'ready', requestDate: '2024-03-10', fee: 30 },
    { id: 3, type: 'Business Permit', status: 'processing', requestDate: '2024-03-08', fee: 500 }
  ]);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: '',
    purpose: '',
    copies: 1
  });

  const handleSubmitRequest = () => {
    if (newRequest.type && newRequest.purpose) {
      alert('Document request submitted successfully!');
      setNewRequest({ type: '', purpose: '', copies: 1 });
      setShowRequestForm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Document Requests</h2>
        <button
          onClick={() => setShowRequestForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FileText className="h-4 w-4 mr-2" />
          Request Document
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.requestDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{doc.fee}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {doc.status === 'ready' ? (
                    <button className="text-green-600 hover:text-green-900 mr-3">
                      <Download className="h-4 w-4" />
                    </button>
                  ) : (
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Document</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                <select
                  value={newRequest.type}
                  onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select document type</option>
                  <option value="Barangay Clearance">Barangay Clearance</option>
                  <option value="Certificate of Residency">Certificate of Residency</option>
                  <option value="Certificate of Indigency">Certificate of Indigency</option>
                  <option value="Business Permit">Business Permit</option>
                  <option value="Cedula">Cedula</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                <input
                  type="text"
                  value={newRequest.purpose}
                  onChange={(e) => setNewRequest({ ...newRequest, purpose: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter purpose of request"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Copies</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newRequest.copies}
                  onChange={(e) => setNewRequest({ ...newRequest, copies: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowRequestForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResidentAppointments() {
  const [appointments] = useState([
    { id: 1, service: 'Health Consultation', date: '2024-03-25', time: '10:00 AM', status: 'confirmed' },
    { id: 2, service: 'Document Processing', date: '2024-03-20', time: '2:00 PM', status: 'pending' }
  ]);

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    service: '',
    date: '',
    time: '',
    notes: ''
  });

  const handleBookAppointment = () => {
    if (newAppointment.service && newAppointment.date && newAppointment.time) {
      alert('Appointment booked successfully!');
      setNewAppointment({ service: '', date: '', time: '', notes: '' });
      setShowBookingForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">My Appointments</h2>
        <button
          onClick={() => setShowBookingForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book Appointment
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{appointment.service}</h4>
                <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {appointment.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Appointment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                <select
                  value={newAppointment.service}
                  onChange={(e) => setNewAppointment({ ...newAppointment, service: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select service</option>
                  <option value="Health Consultation">Health Consultation</option>
                  <option value="Document Processing">Document Processing</option>
                  <option value="Business Permit">Business Permit</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <select
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional notes or requirements"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBookingForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBookAppointment}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResidentAnnouncements() {
  const announcements = [
    {
      id: 1,
      title: '🚨 EMERGENCY: Typhoon Warning - Signal No. 2',
      content: 'Signal No. 2 has been raised for our area. Residents in low-lying areas are advised to evacuate immediately to designated evacuation centers. Emergency hotline: 911',
      type: 'emergency',
      priority: 'high',
      date: '2024-03-20',
      author: 'Disaster Management Team'
    },
    {
      id: 2,
      title: '🌧️ Weather Warning: Heavy Rainfall Expected',
      content: 'Heavy to intense rainfall expected in the next 6-12 hours. Residents are advised to stay indoors and avoid unnecessary travel. Monitor local weather updates.',
      type: 'weather',
      priority: 'high',
      date: '2024-03-20',
      author: 'Weather Monitoring Team'
    },
    {
      id: 3,
      title: 'Community Health Drive - Free Medical Checkup',
      content: 'Free medical checkup and vaccination for all residents. Bring your barangay ID and health records. Schedule: March 25-27, 8:00 AM - 4:00 PM at the Health Center.',
      type: 'health',
      priority: 'medium',
      date: '2024-03-18',
      author: 'Barangay Health Center'
    },
    {
      id: 4,
      title: 'Road Maintenance Schedule',
      content: 'Main Street will undergo maintenance from March 25-27. Please use alternative routes during construction hours (6:00 AM - 6:00 PM).',
      type: 'notice',
      priority: 'medium',
      date: '2024-03-15',
      author: 'Public Works Department'
    },
    {
      id: 5,
      title: 'Barangay Assembly Meeting',
      content: 'Monthly barangay assembly meeting on March 30, 2024 at 7:00 PM at the Barangay Hall. All residents are invited to participate and voice their concerns.',
      type: 'event',
      priority: 'low',
      date: '2024-03-12',
      author: 'Barangay Council'
    }
  ];

  const getAnnouncementColor = (type: string, priority: string) => {
    if (type === 'emergency' || type === 'weather') {
      return 'border-l-4 border-red-500 bg-red-50';
    }
    if (priority === 'high') {
      return 'border-l-4 border-orange-500 bg-orange-50';
    }
    if (type === 'health') {
      return 'border-l-4 border-green-500 bg-green-50';
    }
    return 'border-l-4 border-blue-500 bg-blue-50';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'weather': return 'bg-blue-100 text-blue-800';
      case 'health': return 'bg-green-100 text-green-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Community Announcements</h2>
      
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className={`rounded-lg p-6 ${getAnnouncementColor(announcement.type, announcement.priority)}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(announcement.type)}`}>
                  {announcement.type.toUpperCase()}
                </span>
                <div className="flex items-center space-x-1">
                  {getPriorityIcon(announcement.priority)}
                  <span className="text-xs font-medium text-gray-600 uppercase">{announcement.priority}</span>
                </div>
              </div>
              <span className="text-sm text-gray-500">{announcement.date}</span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{announcement.title}</h3>
            <p className="text-gray-700 mb-4">{announcement.content}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">By {announcement.author}</span>
              {(announcement.type === 'emergency' || announcement.type === 'weather') && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">Emergency Hotline: 911</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResidentSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    language: 'English',
    theme: 'light'
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">SMS Notifications</h4>
              <p className="text-sm text-gray-600">Receive updates via SMS</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, smsNotifications: !settings.smsNotifications })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.smsNotifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Push Notifications</h4>
              <p className="text-sm text-gray-600">Receive browser notifications</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, pushNotifications: !settings.pushNotifications })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="English">English</option>
              <option value="Filipino">Filipino</option>
              <option value="Tagalog">Tagalog</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}