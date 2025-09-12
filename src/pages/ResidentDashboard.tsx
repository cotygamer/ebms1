import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import VerificationStatus from '../components/VerificationStatus';
import QRCodeGenerator from '../components/QRCodeGenerator';
import FamilyTreeView from '../components/FamilyTreeView';
import { User, Shield, QrCode, Users, FileText, Bell, Settings, LogOut, Activity, Calendar, MapPin, Phone, Mail, Edit, Save, Camera, Upload, TrendingUp, Building2, X, CheckCircle, Clock, AlertTriangle, Download, Eye, Plus, Heart, Star, Award, Target, CreditCard, Car as IdCard, FileCheck, UserCheck, Lock, Key, Smartphone, Globe, Home, Briefcase, GraduationCap } from 'lucide-react';

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
    { id: 'government-id', label: 'Government ID', icon: IdCard },
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
      case 'government-id':
        return <GovernmentIDManagement />;
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
    // Basic Information
    firstName: user?.name?.split(' ')[0] || '',
    middleName: '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    suffix: '',
    nickname: '',
    email: user?.email || '',
    
    // Contact Information
    primaryPhone: '+63 912 345 6789',
    alternatePhone: '',
    landlinePhone: '',
    
    // Address Information
    houseNumber: '123',
    street: 'Main Street',
    subdivision: 'Barangay Center',
    purok: 'Purok 1',
    zipCode: '1000',
    city: 'Manila',
    province: 'Metro Manila',
    region: 'NCR',
    
    // Personal Details
    birthDate: '1990-01-15',
    birthPlace: 'Manila, Philippines',
    gender: 'Male',
    civilStatus: 'Single',
    nationality: 'Filipino',
    religion: 'Catholic',
    bloodType: 'O+',
    height: '170',
    weight: '65',
    
    // Professional Information
    occupation: 'Software Developer',
    employer: 'Tech Company Inc.',
    workAddress: 'Makati City',
    monthlyIncome: '50000',
    educationalAttainment: 'College Graduate',
    
    // Emergency Contacts
    emergencyContact1: {
      name: 'Maria Dela Cruz',
      relationship: 'Mother',
      phone: '+63 917 654 3210',
      address: '456 Oak Street, Manila'
    },
    emergencyContact2: {
      name: 'Pedro Dela Cruz',
      relationship: 'Father',
      phone: '+63 918 765 4321',
      address: '456 Oak Street, Manila'
    },
    
    // Additional Information
    profileImage: null as string | null,
    disabilities: '',
    medicalConditions: '',
    allergies: '',
    medications: '',
    specialNeeds: ''
  });

  const handleSave = () => {
    const fullName = `${profileData.firstName} ${profileData.middleName} ${profileData.lastName} ${profileData.suffix}`.trim().replace(/\s+/g, ' ');
    updateUser({ name: fullName, email: profileData.email });
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
        <h2 className="text-2xl font-semibold text-gray-900">Complete Profile Information</h2>
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
              <h3 className="text-2xl font-bold">
                {`${profileData.firstName} ${profileData.middleName} ${profileData.lastName} ${profileData.suffix}`.trim().replace(/\s+/g, ' ')}
              </h3>
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
          {/* Basic Information */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.middleName}
                    onChange={(e) => setProfileData({ ...profileData, middleName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.middleName || 'N/A'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Suffix</label>
                {isEditing ? (
                  <select
                    value={profileData.suffix}
                    onChange={(e) => setProfileData({ ...profileData, suffix: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">None</option>
                    <option value="Jr.">Jr.</option>
                    <option value="Sr.">Sr.</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                  </select>
                ) : (
                  <p className="text-gray-900 py-2">{profileData.suffix || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone *</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.primaryPhone}
                    onChange={(e) => setProfileData({ ...profileData, primaryPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.primaryPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.alternatePhone}
                    onChange={(e) => setProfileData({ ...profileData, alternatePhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.alternatePhone || 'N/A'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Address Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">House Number *</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.houseNumber}
                    onChange={(e) => setProfileData({ ...profileData, houseNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.houseNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street *</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.street}
                    onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.street}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purok/Zone *</label>
                {isEditing ? (
                  <select
                    value={profileData.purok}
                    onChange={(e) => setProfileData({ ...profileData, purok: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Purok</option>
                    <option value="Purok 1">Purok 1</option>
                    <option value="Purok 2">Purok 2</option>
                    <option value="Purok 3">Purok 3</option>
                    <option value="Purok 4">Purok 4</option>
                    <option value="Purok 5">Purok 5</option>
                  </select>
                ) : (
                  <p className="text-gray-900 py-2">{profileData.purok}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.zipCode}
                    onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.zipCode}</p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <IdCard className="h-5 w-5 mr-2" />
              Personal Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date *</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profileData.birthDate}
                    onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.birthDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place *</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.birthPlace}
                    onChange={(e) => setProfileData({ ...profileData, birthPlace: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.birthPlace}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                {isEditing ? (
                  <select
                    value={profileData.gender}
                    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  <p className="text-gray-900 py-2">{profileData.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Civil Status *</label>
                {isEditing ? (
                  <select
                    value={profileData.civilStatus}
                    onChange={(e) => setProfileData({ ...profileData, civilStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                ) : (
                  <p className="text-gray-900 py-2">{profileData.civilStatus}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.nationality}
                    onChange={(e) => setProfileData({ ...profileData, nationality: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.nationality}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.religion}
                    onChange={(e) => setProfileData({ ...profileData, religion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.religion}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                {isEditing ? (
                  <select
                    value={profileData.bloodType}
                    onChange={(e) => setProfileData({ ...profileData, bloodType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Blood Type</option>
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
                  <p className="text-gray-900 py-2">{profileData.bloodType || 'N/A'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profileData.height}
                    onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.height} cm</p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Emergency Contacts
            </h4>
            
            {/* Emergency Contact 1 */}
            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <h5 className="font-medium text-gray-900 mb-3">Primary Emergency Contact</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.emergencyContact1.name}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        emergencyContact1: { ...profileData.emergencyContact1, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.emergencyContact1.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
                  {isEditing ? (
                    <select
                      value={profileData.emergencyContact1.relationship}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        emergencyContact1: { ...profileData.emergencyContact1, relationship: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select Relationship</option>
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Child">Child</option>
                      <option value="Relative">Relative</option>
                      <option value="Friend">Friend</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.emergencyContact1.relationship}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.emergencyContact1.phone}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        emergencyContact1: { ...profileData.emergencyContact1, phone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.emergencyContact1.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.emergencyContact1.address}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        emergencyContact1: { ...profileData.emergencyContact1, address: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.emergencyContact1.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact 2 */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3">Secondary Emergency Contact</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.emergencyContact2.name}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        emergencyContact2: { ...profileData.emergencyContact2, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.emergencyContact2.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  {isEditing ? (
                    <select
                      value={profileData.emergencyContact2.relationship}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        emergencyContact2: { ...profileData.emergencyContact2, relationship: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Relationship</option>
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Child">Child</option>
                      <option value="Relative">Relative</option>
                      <option value="Friend">Friend</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.emergencyContact2.relationship || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.emergencyContact2.phone}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        emergencyContact2: { ...profileData.emergencyContact2, phone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.emergencyContact2.phone || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.emergencyContact2.address}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        emergencyContact2: { ...profileData.emergencyContact2, address: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.emergencyContact2.address || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Professional Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <p className="text-gray-900 py-2">{profileData.occupation}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employer</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.employer}
                    onChange={(e) => setProfileData({ ...profileData, employer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.employer}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profileData.monthlyIncome}
                    onChange={(e) => setProfileData({ ...profileData, monthlyIncome: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">₱{parseInt(profileData.monthlyIncome).toLocaleString()}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Educational Attainment</label>
                {isEditing ? (
                  <select
                    value={profileData.educationalAttainment}
                    onChange={(e) => setProfileData({ ...profileData, educationalAttainment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Education Level</option>
                    <option value="Elementary">Elementary</option>
                    <option value="High School">High School</option>
                    <option value="Vocational">Vocational</option>
                    <option value="College Graduate">College Graduate</option>
                    <option value="Post Graduate">Post Graduate</option>
                  </select>
                ) : (
                  <p className="text-gray-900 py-2">{profileData.educationalAttainment}</p>
                )}
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Medical Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                {isEditing ? (
                  <textarea
                    value={profileData.medicalConditions}
                    onChange={(e) => setProfileData({ ...profileData, medicalConditions: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="List any medical conditions..."
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.medicalConditions || 'None reported'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                {isEditing ? (
                  <textarea
                    value={profileData.allergies}
                    onChange={(e) => setProfileData({ ...profileData, allergies: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="List any allergies..."
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.allergies || 'None reported'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lock className="h-5 w-5 mr-2" />
          Account Security
        </h4>
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

function GovernmentIDManagement() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [idData, setIdData] = useState({
    // National ID
    nationalId: {
      number: '',
      dateIssued: '',
      expiryDate: '',
      issuingOffice: '',
      status: 'not-submitted'
    },
    
    // Driver's License
    driversLicense: {
      number: '',
      licenseType: '',
      dateIssued: '',
      expiryDate: '',
      restrictions: '',
      status: 'not-submitted'
    },
    
    // Passport
    passport: {
      number: '',
      dateIssued: '',
      expiryDate: '',
      issuingCountry: 'Philippines',
      status: 'not-submitted'
    },
    
    // Other IDs
    otherIds: [
      {
        type: 'SSS',
        number: '',
        dateIssued: '',
        status: 'not-submitted'
      },
      {
        type: 'TIN',
        number: '',
        dateIssued: '',
        status: 'not-submitted'
      },
      {
        type: 'PhilHealth',
        number: '',
        dateIssued: '',
        status: 'not-submitted'
      },
      {
        type: 'Pag-IBIG',
        number: '',
        dateIssued: '',
        status: 'not-submitted'
      }
    ]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <Upload className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Government ID Verification</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
        >
          {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
          {isEditing ? 'Save Changes' : 'Edit Information'}
        </button>
      </div>

      {/* Verification Progress */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ID Verification Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <IdCard className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">4</div>
            <div className="text-sm text-blue-800">Total IDs</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-green-800">Verified</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">0</div>
            <div className="text-sm text-yellow-800">Pending</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Upload className="h-12 w-12 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-600">4</div>
            <div className="text-sm text-gray-800">Not Submitted</div>
          </div>
        </div>
      </div>

      {/* National ID */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <IdCard className="h-5 w-5 mr-2" />
            National ID (PhilID)
          </h3>
          <div className="flex items-center space-x-2">
            {getStatusIcon(idData.nationalId.status)}
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(idData.nationalId.status)}`}>
              {idData.nationalId.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
            {isEditing ? (
              <input
                type="text"
                value={idData.nationalId.number}
                onChange={(e) => setIdData({
                  ...idData,
                  nationalId: { ...idData.nationalId, number: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="1234-5678-9012"
              />
            ) : (
              <p className="text-gray-900 py-2">{idData.nationalId.number || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Issued</label>
            {isEditing ? (
              <input
                type="date"
                value={idData.nationalId.dateIssued}
                onChange={(e) => setIdData({
                  ...idData,
                  nationalId: { ...idData.nationalId, dateIssued: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-gray-900 py-2">{idData.nationalId.dateIssued || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            {isEditing ? (
              <input
                type="date"
                value={idData.nationalId.expiryDate}
                onChange={(e) => setIdData({
                  ...idData,
                  nationalId: { ...idData.nationalId, expiryDate: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-gray-900 py-2">{idData.nationalId.expiryDate || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Office</label>
            {isEditing ? (
              <input
                type="text"
                value={idData.nationalId.issuingOffice}
                onChange={(e) => setIdData({
                  ...idData,
                  nationalId: { ...idData.nationalId, issuingOffice: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="PSA Office"
              />
            ) : (
              <p className="text-gray-900 py-2">{idData.nationalId.issuingOffice || 'Not provided'}</p>
            )}
          </div>
        </div>
        
        {!isEditing && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Upload National ID Copy
            </button>
          </div>
        )}
      </div>

      {/* Driver's License */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Driver's License
          </h3>
          <div className="flex items-center space-x-2">
            {getStatusIcon(idData.driversLicense.status)}
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(idData.driversLicense.status)}`}>
              {idData.driversLicense.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
            {isEditing ? (
              <input
                type="text"
                value={idData.driversLicense.number}
                onChange={(e) => setIdData({
                  ...idData,
                  driversLicense: { ...idData.driversLicense, number: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="N01-12-345678"
              />
            ) : (
              <p className="text-gray-900 py-2">{idData.driversLicense.number || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">License Type</label>
            {isEditing ? (
              <select
                value={idData.driversLicense.licenseType}
                onChange={(e) => setIdData({
                  ...idData,
                  driversLicense: { ...idData.driversLicense, licenseType: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Type</option>
                <option value="Non-Professional">Non-Professional</option>
                <option value="Professional">Professional</option>
                <option value="Motorcycle">Motorcycle</option>
                <option value="Conductor">Conductor</option>
              </select>
            ) : (
              <p className="text-gray-900 py-2">{idData.driversLicense.licenseType || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Issued</label>
            {isEditing ? (
              <input
                type="date"
                value={idData.driversLicense.dateIssued}
                onChange={(e) => setIdData({
                  ...idData,
                  driversLicense: { ...idData.driversLicense, dateIssued: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-gray-900 py-2">{idData.driversLicense.dateIssued || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            {isEditing ? (
              <input
                type="date"
                value={idData.driversLicense.expiryDate}
                onChange={(e) => setIdData({
                  ...idData,
                  driversLicense: { ...idData.driversLicense, expiryDate: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-gray-900 py-2">{idData.driversLicense.expiryDate || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Restrictions</label>
            {isEditing ? (
              <input
                type="text"
                value={idData.driversLicense.restrictions}
                onChange={(e) => setIdData({
                  ...idData,
                  driversLicense: { ...idData.driversLicense, restrictions: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="None"
              />
            ) : (
              <p className="text-gray-900 py-2">{idData.driversLicense.restrictions || 'None'}</p>
            )}
          </div>
        </div>
        
        {!isEditing && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Upload Driver's License Copy
            </button>
          </div>
        )}
      </div>

      {/* Other Government IDs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileCheck className="h-5 w-5 mr-2" />
          Other Government IDs
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {idData.otherIds.map((id, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{id.type} ID</h4>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(id.status)}
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(id.status)}`}>
                    {id.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={id.number}
                      onChange={(e) => {
                        const updatedIds = [...idData.otherIds];
                        updatedIds[index] = { ...updatedIds[index], number: e.target.value };
                        setIdData({ ...idData, otherIds: updatedIds });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={`Enter ${id.type} number`}
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{id.number || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Issued</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={id.dateIssued}
                      onChange={(e) => {
                        const updatedIds = [...idData.otherIds];
                        updatedIds[index] = { ...updatedIds[index], dateIssued: e.target.value };
                        setIdData({ ...idData, otherIds: updatedIds });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{id.dateIssued || 'Not provided'}</p>
                  )}
                </div>
              </div>
              
              {!isEditing && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {id.type} Copy
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <Lock className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Security & Privacy Notice</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• All uploaded documents are encrypted and stored securely</li>
              <li>• Only authorized barangay personnel can access your ID information</li>
              <li>• Your personal data is protected under the Data Privacy Act</li>
              <li>• ID verification is required for certain barangay services</li>
              <li>• You can request deletion of your data at any time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentRequests() {
  const [documents] = useState([
    { id: 1, type: 'Barangay Clearance', status: 'pending', date: '2024-03-15', fee: 50, purpose: 'Employment' },
    { id: 2, type: 'Certificate of Residency', status: 'ready', date: '2024-03-10', fee: 30, purpose: 'School Enrollment' },
    { id: 3, type: 'Business Permit', status: 'processing', date: '2024-03-08', fee: 200, purpose: 'Business Registration' },
    { id: 4, type: 'Barangay ID', status: 'released', date: '2024-03-05', fee: 100, purpose: 'Identification' }
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

      {/* Document Stats */}
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
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-600">{documents.length}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.purpose}</td>
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