import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import VerificationStatus from '../components/VerificationStatus';
import QRCodeGenerator from '../components/QRCodeGenerator';
import FamilyTreeView from '../components/FamilyTreeView';
import { 
  User, 
  Shield, 
  QrCode, 
  Users, 
  FileText, 
  Bell, 
  Settings, 
  LogOut, 
  Activity,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Edit,
  Save,
  Camera,
  Upload,
  TrendingUp,
  Building2,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  Plus,
  Heart,
  Star,
  Award,
  Target
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
    { id: 'verification', label: 'Verification Status', icon: Shield },
    { id: 'qr-code', label: 'QR Code', icon: QrCode },
    { id: 'family', label: 'Family Tree', icon: Users },
    { id: 'documents', label: 'My Documents', icon: FileText },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'services', label: 'Services', icon: Building2 }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ResidentOverview />;
      case 'profile':
        return <ResidentProfile />;
      case 'verification':
        return <VerificationStatus />;
      case 'qr-code':
        return <QRCodeGenerator />;
      case 'family':
        return <FamilyTreeView />;
      case 'documents':
        return <DocumentRequests />;
      case 'announcements':
        return <AnnouncementsList />;
      case 'services':
        return <ServicesList />;
      default:
        return <ResidentOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Resident Portal</h2>
              <p className="text-sm text-gray-600">Barangay Services</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
      
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
  
  const stats = [
    { label: 'Verification Status', value: user?.verificationStatus || 'Non-verified', icon: Shield, color: 'text-green-600' },
    { label: 'Documents Requested', value: '5', icon: FileText, color: 'text-blue-600' },
    { label: 'Family Members', value: user?.familyTree?.length || '0', icon: Users, color: 'text-purple-600' },
    { label: 'QR Code Status', value: user?.qrCode ? 'Active' : 'Inactive', icon: QrCode, color: 'text-orange-600' }
  ];

  const recentActivities = [
    { id: 1, action: 'Barangay Clearance requested', date: '2024-03-15', status: 'pending' },
    { id: 2, action: 'Profile updated', date: '2024-03-14', status: 'completed' },
    { id: 3, action: 'Family member added', date: '2024-03-13', status: 'completed' },
    { id: 4, action: 'Document verification submitted', date: '2024-03-12', status: 'processing' }
  ];

  const quickActions = [
    { label: 'Request Document', icon: FileText, color: 'blue', action: () => {} },
    { label: 'Update Profile', icon: User, color: 'green', action: () => {} },
    { label: 'View QR Code', icon: QrCode, color: 'purple', action: () => {} },
    { label: 'Add Family Member', icon: Users, color: 'orange', action: () => {} }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
            <p className="text-purple-100">
              Your verification status: <span className="font-semibold capitalize">
                {user?.verificationStatus?.replace('-', ' ') || 'Non-verified'}
              </span>
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} capitalize`}>
                  {typeof stat.value === 'string' ? stat.value.replace('-', ' ') : stat.value}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`flex items-center p-4 bg-${action.color}-50 rounded-lg hover:bg-${action.color}-100 transition-colors`}
            >
              <action.icon className={`h-8 w-8 text-${action.color}-600 mr-3`} />
              <span className="font-medium text-gray-900">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                  activity.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements Preview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Announcements</h3>
          <div className="space-y-4">
            <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
              <h4 className="font-medium text-red-800">Health Drive</h4>
              <p className="text-sm text-red-700">Free medical checkup this weekend</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-blue-800">Road Maintenance</h4>
              <p className="text-sm text-blue-700">Main street closure on March 25-27</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-medium text-green-800">Community Meeting</h4>
              <p className="text-sm text-green-700">Monthly assembly on March 30</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResidentProfile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+63 912 345 6789',
    address: '123 Main Street, Barangay Center',
    birthDate: '1990-01-15',
    gender: 'Male',
    civilStatus: 'Single',
    occupation: 'Software Developer',
    emergencyContact: 'Maria Dela Cruz - +63 917 654 3210',
    profileImage: null as string | null
  });

  const handleSave = () => {
    updateUser({ name: profileData.name, email: profileData.email });
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({ ...profileData, profileImage: e.target?.result as string });
      };
      reader.readAsDataURL(file);
      setShowImageUpload(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">My Profile</h2>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
        >
          {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden">
                {profileData.profileImage ? (
                  <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
              </div>
              {isEditing && (
                <button
                  onClick={() => setShowImageUpload(true)}
                  className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
                >
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>
            <div className="text-white">
              <h3 className="text-2xl font-bold">{profileData.name}</h3>
              <p className="text-purple-100">{profileData.email}</p>
              <div className="flex items-center mt-2">
                <Shield className="h-4 w-4 mr-2" />
                <span className="capitalize">
                  {user?.verificationStatus?.replace('-', ' ') || 'Non-verified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                {isEditing ? (
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.address}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profileData.birthDate}
                    onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.birthDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                {isEditing ? (
                  <select
                    value={profileData.gender}
                    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{profileData.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
                {isEditing ? (
                  <select
                    value={profileData.civilStatus}
                    onChange={(e) => setProfileData({ ...profileData, civilStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{profileData.civilStatus}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.occupation}
                    onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.occupation}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.emergencyContact}
                    onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.emergencyContact}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900">Password</h5>
              <p className="text-sm text-gray-600">Last changed 30 days ago</p>
            </div>
            <button className="text-purple-600 hover:text-purple-800 font-medium">
              Change Password
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900">Two-Factor Authentication</h5>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <button className="text-purple-600 hover:text-purple-800 font-medium">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Profile Picture</h3>
              <button
                onClick={() => setShowImageUpload(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-upload"
                />
                <label
                  htmlFor="profile-upload"
                  className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentRequests() {
  const [documents] = useState([
    { id: 1, type: 'Barangay Clearance', status: 'pending', date: '2024-03-15', fee: 50 },
    { id: 2, type: 'Certificate of Residency', status: 'ready', date: '2024-03-10', fee: 30 },
    { id: 3, type: 'Business Permit', status: 'processing', date: '2024-03-08', fee: 200 },
    { id: 4, type: 'Barangay ID', status: 'released', date: '2024-03-05', fee: 100 }
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
        <h2 className="text-2xl font-semibold text-gray-900">My Documents</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Request Document
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Requested</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{doc.fee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-purple-600 hover:text-purple-900 mr-3">
                      <Eye className="h-4 w-4" />
                    </button>
                    {doc.status === 'ready' && (
                      <button className="text-green-600 hover:text-green-900">
                        <Download className="h-4 w-4" />
                      </button>
                    )}
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

function AnnouncementsList() {
  const announcements = [
    {
      id: 1,
      title: 'Community Health Drive',
      content: 'Free medical checkup and vaccination for all residents. Bring your barangay ID and health records.',
      type: 'health',
      priority: 'high',
      date: '2024-03-15',
      author: 'Barangay Health Center'
    },
    {
      id: 2,
      title: 'Road Maintenance Schedule',
      content: 'Main Street will undergo maintenance from March 25-27. Please use alternative routes.',
      type: 'notice',
      priority: 'medium',
      date: '2024-03-12',
      author: 'Public Works'
    },
    {
      id: 3,
      title: 'Barangay Assembly Meeting',
      content: 'Monthly barangay assembly meeting on March 30, 2024 at 7:00 PM. All residents are invited.',
      type: 'event',
      priority: 'medium',
      date: '2024-03-10',
      author: 'Barangay Council'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Announcements</h2>
      
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    announcement.type === 'health' ? 'bg-red-100 text-red-800' :
                    announcement.type === 'event' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
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
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                <p className="text-gray-600 mb-3">{announcement.content}</p>
                <div className="text-sm text-gray-500">
                  <p>By {announcement.author} • {announcement.date}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesList() {
  const services = [
    {
      name: 'Document Services',
      description: 'Request barangay clearance, certificates, and permits',
      icon: FileText,
      color: 'blue',
      available: true
    },
    {
      name: 'Health Services',
      description: 'Access health programs and medical assistance',
      icon: Heart,
      color: 'red',
      available: true
    },
    {
      name: 'Business Registration',
      description: 'Register your business and get permits',
      icon: Building2,
      color: 'green',
      available: true
    },
    {
      name: 'Emergency Services',
      description: 'Report emergencies and get assistance',
      icon: AlertTriangle,
      color: 'orange',
      available: true
    },
    {
      name: 'Community Programs',
      description: 'Join community activities and programs',
      icon: Users,
      color: 'purple',
      available: true
    },
    {
      name: 'Online Payments',
      description: 'Pay fees and taxes online',
      icon: Target,
      color: 'indigo',
      available: false
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Available Services</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500 ${
              service.available ? 'hover:shadow-md cursor-pointer' : 'opacity-60'
            } transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${service.color}-100`}>
                <service.icon className={`h-8 w-8 text-${service.color}-600`} />
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                service.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {service.available ? 'Available' : 'Coming Soon'}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{service.description}</p>
            {service.available && (
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Access Service
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}