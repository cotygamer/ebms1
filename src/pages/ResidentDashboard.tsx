import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import VerificationStatus from '../components/VerificationStatus';
import QRCodeGenerator from '../components/QRCodeGenerator';
import FamilyTreeView from '../components/FamilyTreeView';
import { 
  User, 
  FileText, 
  Calendar, 
  Bell, 
  Settings, 
  LogOut, 
  Shield, 
  QrCode, 
  Users, 
  Home,
  MapPin,
  Phone,
  Mail,
  Camera,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  Building2,
  ArrowLeft,
  Star,
  Award,
  Activity,
  Heart,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

export default function ResidentDashboard() {
  const { user, logout, updateUser } = useAuth();
  const { systemSettings } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    birthDate: '',
    gender: '',
    civilStatus: '',
    occupation: '',
    emergencyContact: '',
    houseLocation: { lat: 0, lng: 0, address: '' }
  });

  const handleLogout = () => {
    try {
      // Clear all authentication-related data
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('sessionId');
      
      // Clear any session storage
      sessionStorage.clear();
      
      // Call auth context logout
      logout();
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force navigation even if logout fails
      navigate('/');
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4 mr-1" />
            Fully Verified
          </div>
        );
      case 'semi-verified':
        return (
          <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            <Clock className="h-4 w-4 mr-1" />
            Semi-Verified
          </div>
        );
      case 'details-updated':
        return (
          <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            <Edit className="h-4 w-4 mr-1" />
            Details Updated
          </div>
        );
      default:
        return (
          <div className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Unverified
          </div>
        );
    }
  };

  const getAccessLevel = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          level: 'Full Access',
          description: 'Complete access to all barangay services',
          color: 'text-green-600',
          features: ['Document Requests', 'QR Code Access', 'Online Payments', 'Priority Support', 'All Services']
        };
      case 'semi-verified':
        return {
          level: 'Limited Access',
          description: 'Access to basic services, pending final verification',
          color: 'text-yellow-600',
          features: ['Basic Document Requests', 'Profile Management', 'Announcements', 'Contact Support']
        };
      case 'details-updated':
        return {
          level: 'Basic Access',
          description: 'Profile completed, awaiting document verification',
          color: 'text-blue-600',
          features: ['View Announcements', 'Update Profile', 'Contact Information']
        };
      default:
        return {
          level: 'Restricted Access',
          description: 'Complete your profile to unlock services',
          color: 'text-red-600',
          features: ['View Public Information', 'Update Basic Profile']
        };
    }
  };

  const handleProfileUpdate = () => {
    // Update user profile and change status to details-updated if currently unverified
    const newStatus = user?.verificationStatus === 'non-verified' ? 'details-updated' : user?.verificationStatus;
    updateUser({ 
      ...profileData, 
      verificationStatus: newStatus 
    });
    setShowProfileEdit(false);
  };

  const renderDashboard = () => {
    const accessLevel = getAccessLevel(user?.verificationStatus || 'non-verified');
    
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Welcome Section - Responsive */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Welcome, {user?.name}!</h2>
              <p className="text-purple-100 text-sm sm:text-base">
                Your digital gateway to barangay services
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {getVerificationBadge(user?.verificationStatus || 'non-verified')}
              <div className="text-right">
                <p className={`font-semibold text-sm sm:text-base ${accessLevel.color}`}>
                  {accessLevel.level}
                </p>
                <p className="text-purple-200 text-xs sm:text-sm">
                  {accessLevel.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Progress - Mobile Optimized */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Progress</h3>
          <VerificationProgressBar status={user?.verificationStatus || 'non-verified'} />
        </div>

        {/* Quick Actions Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            icon={FileText}
            title="Documents"
            description="Request certificates"
            onClick={() => setActiveTab('documents')}
            disabled={!['semi-verified', 'verified'].includes(user?.verificationStatus || '')}
          />
          <QuickActionCard
            icon={QrCode}
            title="QR Code"
            description="Digital ID access"
            onClick={() => setActiveTab('qr-code')}
            disabled={user?.verificationStatus !== 'verified'}
          />
          <QuickActionCard
            icon={Users}
            title="Family Tree"
            description="Manage family"
            onClick={() => setActiveTab('family')}
            disabled={false}
          />
          <QuickActionCard
            icon={Bell}
            title="Announcements"
            description="Latest updates"
            onClick={() => setActiveTab('announcements')}
            disabled={false}
          />
        </div>

        {/* Access Level Info - Mobile Friendly */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {accessLevel.features.map((feature, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Compatibility Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Smartphone className="h-5 w-5 mr-2" />
            Multi-Device Access
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center p-3 bg-white rounded-lg">
              <Smartphone className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Mobile</p>
                <p className="text-sm text-gray-600">iOS & Android</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-white rounded-lg">
              <Tablet className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Tablet</p>
                <p className="text-sm text-gray-600">Touch Optimized</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-white rounded-lg">
              <Monitor className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Desktop</p>
                <p className="text-sm text-gray-600">Full Features</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Profile Management</h2>
        <button
          onClick={() => setShowProfileEdit(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center text-sm sm:text-base"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <ProfileCard user={user} profileData={profileData} />
      
      {showProfileEdit && (
        <ProfileEditModal
          profileData={profileData}
          setProfileData={setProfileData}
          onSave={handleProfileUpdate}
          onClose={() => setShowProfileEdit(false)}
          onLocationPick={() => setShowLocationPicker(true)}
        />
      )}

      {showLocationPicker && (
        <LocationPickerModal
          onLocationSelect={(location) => {
            setProfileData(prev => ({ ...prev, houseLocation: location }));
            setShowLocationPicker(false);
          }}
          onClose={() => setShowLocationPicker(false)}
        />
      )}
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'verification', label: 'Verification', icon: Shield },
    { id: 'qr-code', label: 'QR Code', icon: QrCode },
    { id: 'family', label: 'Family Tree', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'announcements', label: 'Announcements', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Resident Portal</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  {systemSettings.barangayName || 'Barangay Management System'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0)}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-2 py-2 sm:px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="ml-2 hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="bg-white border-b shadow-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-1 px-4 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'verification' && <VerificationStatus />}
        {activeTab === 'qr-code' && <QRCodeGenerator />}
        {activeTab === 'family' && <FamilyTreeView />}
        {activeTab === 'documents' && <DocumentsSection />}
        {activeTab === 'announcements' && <AnnouncementsSection />}
      </div>
    </div>
  );
}

// Verification Progress Bar Component
function VerificationProgressBar({ status }: { status: string }) {
  const steps = [
    { id: 'registered', label: 'Registered', status: 'completed' },
    { id: 'details', label: 'Details Updated', status: status === 'non-verified' ? 'pending' : 'completed' },
    { id: 'semi', label: 'Semi-Verified', status: ['details-updated', 'semi-verified', 'verified'].includes(status) ? 'completed' : 'pending' },
    { id: 'verified', label: 'Fully Verified', status: status === 'verified' ? 'completed' : 'pending' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step.status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {step.status === 'completed' ? <CheckCircle className="h-5 w-5" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 sm:w-24 h-1 mx-2 ${
                steps[index + 1].status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm text-center">
        {steps.map((step) => (
          <div key={step.id} className={step.status === 'completed' ? 'text-green-600 font-medium' : 'text-gray-500'}>
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  disabled = false 
}: {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-4 rounded-lg text-left transition-all ${
        disabled 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-white shadow-sm hover:shadow-md hover:scale-105 text-gray-900'
      }`}
    >
      <Icon className={`h-8 w-8 mb-3 ${disabled ? 'text-gray-400' : 'text-purple-600'}`} />
      <h3 className="font-semibold text-sm sm:text-base mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-600">{description}</p>
      {disabled && (
        <p className="text-xs text-red-500 mt-2">Verification required</p>
      )}
    </button>
  );
}

// Profile Card Component
function ProfileCard({ user, profileData }: { user: any; profileData: any }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <p className="text-gray-900 font-medium">{user?.name || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="text-gray-900">{user?.email || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <p className="text-gray-900">{profileData.phone || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <p className="text-gray-900">{profileData.address || 'Not provided'}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Birth Date</label>
            <p className="text-gray-900">{profileData.birthDate || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <p className="text-gray-900 capitalize">{profileData.gender || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Civil Status</label>
            <p className="text-gray-900 capitalize">{profileData.civilStatus || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Verification Status</label>
            <div className="mt-1">
              {user && getVerificationBadge(user.verificationStatus || 'non-verified')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Edit Modal Component
function ProfileEditModal({ 
  profileData, 
  setProfileData, 
  onSave, 
  onClose, 
  onLocationPick 
}: {
  profileData: any;
  setProfileData: (data: any) => void;
  onSave: () => void;
  onClose: () => void;
  onLocationPick: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="+63 912 345 6789"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
              <input
                type="date"
                value={profileData.birthDate}
                onChange={(e) => setProfileData(prev => ({ ...prev, birthDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={profileData.gender}
                onChange={(e) => setProfileData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Civil Status</label>
              <select
                value={profileData.civilStatus}
                onChange={(e) => setProfileData(prev => ({ ...prev, civilStatus: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widowed">Widowed</option>
                <option value="separated">Separated</option>
                <option value="divorced">Divorced</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address</label>
            <textarea
              value={profileData.address}
              onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your complete address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">House Location (Required for Semi-Verification)</label>
            <button
              onClick={onLocationPick}
              className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <MapPin className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-purple-600 font-medium">
                {profileData.houseLocation.address ? 'Update Location' : 'Pin Your House Location'}
              </span>
            </button>
            {profileData.houseLocation.address && (
              <p className="text-sm text-gray-600 mt-2">{profileData.houseLocation.address}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
            <input
              type="text"
              value={profileData.emergencyContact}
              onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContact: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Name and phone number"
            />
          </div>
        </div>
        
        <div className="p-4 sm:p-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Location Picker Modal Component
function LocationPickerModal({ 
  onLocationSelect, 
  onClose 
}: {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  onClose: () => void;
}) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  const handleMapClick = (lat: number, lng: number) => {
    // Simulate reverse geocoding
    const address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    setSelectedLocation({ lat, lng, address });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Pin Your House Location</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="bg-gray-100 h-64 sm:h-96 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Interactive Map</p>
              <p className="text-sm text-gray-500">Click on your house location to pin it</p>
              <button
                onClick={() => handleMapClick(14.5995, 120.9842)}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Simulate Location Selection
              </button>
            </div>
          </div>
          
          {selectedLocation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-green-800 mb-2">Selected Location</h4>
              <p className="text-green-700">Coordinates: {selectedLocation.lat}, {selectedLocation.lng}</p>
              <p className="text-green-700">Address: {selectedLocation.address}</p>
            </div>
          )}
        </div>
        
        <div className="p-4 sm:p-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => selectedLocation && onLocationSelect(selectedLocation)}
              disabled={!selectedLocation}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Documents Section Component
function DocumentsSection() {
  const documents = [
    { id: 1, type: 'Barangay Clearance', status: 'Ready for Pickup', date: '2024-03-15', fee: 50 },
    { id: 2, type: 'Certificate of Residency', status: 'Processing', date: '2024-03-14', fee: 30 },
    { id: 3, type: 'Business Permit', status: 'Pending', date: '2024-03-13', fee: 200 }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Document Requests</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm sm:text-base">
          New Request
        </button>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{doc.type}</h3>
                <p className="text-gray-600 text-sm">Requested on {doc.date}</p>
                <p className="text-gray-600 text-sm">Fee: ₱{doc.fee}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  doc.status === 'Ready for Pickup' ? 'bg-green-100 text-green-800' :
                  doc.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {doc.status}
                </span>
                <button className="text-purple-600 hover:text-purple-800 text-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Announcements Section Component
function AnnouncementsSection() {
  const announcements = [
    {
      id: 1,
      title: 'Community Health Drive',
      content: 'Free medical checkup and vaccination for all residents.',
      type: 'health',
      priority: 'high',
      date: '2024-03-20'
    },
    {
      id: 2,
      title: 'Road Maintenance Schedule',
      content: 'Main Street will undergo maintenance from March 25-27.',
      type: 'notice',
      priority: 'medium',
      date: '2024-03-18'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Announcements</h2>
      
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start justify-between space-y-2 sm:space-y-0 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  announcement.type === 'health' ? 'bg-red-100 text-red-800' :
                  announcement.type === 'notice' ? 'bg-blue-100 text-blue-800' :
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
              <span className="text-sm text-gray-500">{announcement.date}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{announcement.title}</h3>
            <p className="text-gray-600 text-sm sm:text-base">{announcement.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function getVerificationBadge(status: string) {
  switch (status) {
    case 'verified':
      return (
        <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          <CheckCircle className="h-4 w-4 mr-1" />
          Fully Verified
        </div>
      );
    case 'semi-verified':
      return (
        <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          <Clock className="h-4 w-4 mr-1" />
          Semi-Verified
        </div>
      );
    case 'details-updated':
      return (
        <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          <Edit className="h-4 w-4 mr-1" />
          Details Updated
        </div>
      );
    default:
      return (
        <div className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          <AlertTriangle className="h-4 w-4 mr-1" />
          Unverified
        </div>
      );
  }
}