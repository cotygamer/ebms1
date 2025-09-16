import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
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
  Plus,
  Search,
  Filter,
  Banknote,
  Receipt,
  CheckCircle,
  XCircle
  const { user, logout, updateUser } = useAuth();
  const { documents, addDocument } = useData();
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
    // Business Rule: Any profile changes revert status to semi-verified (except if non-verified)
    let newStatus = user?.verificationStatus;
    
    if (user?.verificationStatus === 'non-verified') {
      newStatus = 'details-updated';
    } else if (user?.verificationStatus === 'verified') {
      // Revert to semi-verified when fully verified user makes changes
      newStatus = 'semi-verified';
    }
    
    // Create audit trail entry
    const auditEntry = {
      timestamp: new Date().toISOString(),
      action: 'Profile Updated',
      previousStatus: user?.verificationStatus,
      newStatus: newStatus,
      approvedBy: 'Self (Resident)'
    };
    
    const updatedAuditTrail = [...(user?.auditTrail || []), auditEntry];
    
    updateUser({ 
      ...profileData,
      verificationStatus: newStatus,
      auditTrail: updatedAuditTrail
    });
    setShowProfileEdit(false);
    
    // Show notification about status change
    if (user?.verificationStatus === 'verified' && newStatus === 'semi-verified') {
      alert('Your verification status has been changed to semi-verified due to profile updates. Barangay officials will need to re-verify your information.');
    }
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

      {/* Document Request Modal */}
      {showDocumentRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Request Document</h3>
              <button
                onClick={() => setShowDocumentRequest(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                <select
                  value={newDocumentRequest.documentType}
                  onChange={(e) => setNewDocumentRequest({ ...newDocumentRequest, documentType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select document type</option>
                  <option value="Barangay Clearance">Barangay Clearance (₱50)</option>
                  <option value="Certificate of Residency">Certificate of Residency (₱30)</option>
                  <option value="Certificate of Indigency">Certificate of Indigency (₱25)</option>
                  <option value="Business Permit">Business Permit (₱200)</option>
                  <option value="Building Permit">Building Permit (₱500)</option>
                  <option value="Barangay ID">Barangay ID (₱20)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                <input
                  type="text"
                  value={newDocumentRequest.purpose}
                  onChange={(e) => setNewDocumentRequest({ ...newDocumentRequest, purpose: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Employment, School enrollment, etc."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
                <textarea
                  value={newDocumentRequest.notes}
                  onChange={(e) => setNewDocumentRequest({ ...newDocumentRequest, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional information or special requests"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Processing Information</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Processing time: 1-3 business days</li>
                  <li>• Payment required before document release</li>
                  <li>• Valid ID required for pickup</li>
                  <li>• Documents expire after 6 months</li>
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowDocumentRequest(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDocumentRequest}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
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
    { id: 'documents', label: 'Document Requests', icon: FileText },
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
  const [governmentIds, setGovernmentIds] = useState({
    sss: { number: '', file: null as File | null },
    philhealth: { number: '', file: null as File | null },
    pagibig: { number: '', file: null as File | null },
    umid: { number: '', file: null as File | null },
    driversLicense: { number: '', file: null as File | null },
    passport: { number: '', file: null as File | null }
  });

  const handleFileUpload = (idType: string, file: File) => {
    setGovernmentIds(prev => ({
      ...prev,
      [idType]: { ...prev[idType as keyof typeof prev], file }
    }));
  };

  const handleIdNumberChange = (idType: string, number: string) => {
    setGovernmentIds(prev => ({
      ...prev,
      [idType]: { ...prev[idType as keyof typeof prev], number }
    }));
  };
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
        
        <div className="p-4 sm:p-6 space-y-6">
          {/* Personal Information Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-900 mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={profileData.firstName || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter first name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                <input
                  type="text"
                  value={profileData.middleName || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, middleName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter middle name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={profileData.lastName || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter last name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Suffix</label>
                <select
                  value={profileData.suffix || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, suffix: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select suffix</option>
                  <option value="Jr.">Jr.</option>
                  <option value="Sr.">Sr.</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="+63 912 345 6789"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date *</label>
                <input
                  type="date"
                  value={profileData.birthDate}
                  onChange={(e) => setProfileData(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Civil Status *</label>
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                <input
                  type="text"
                  value={profileData.nationality || 'Filipino'}
                  onChange={(e) => setProfileData(prev => ({ ...prev, nationality: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Filipino"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                <input
                  type="text"
                  value={profileData.occupation || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, occupation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter occupation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income</label>
                <select
                  value={profileData.monthlyIncome || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select income range</option>
                  <option value="below-10000">Below ₱10,000</option>
                  <option value="10000-25000">₱10,000 - ₱25,000</option>
                  <option value="25000-50000">₱25,000 - ₱50,000</option>
                  <option value="50000-100000">₱50,000 - ₱100,000</option>
                  <option value="above-100000">Above ₱100,000</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Address Information Section */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-green-900 mb-4">Address Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">House Number/Street *</label>
                <input
                  type="text"
                  value={profileData.houseNumber || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, houseNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="123 Main Street"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purok/Sitio</label>
                <input
                  type="text"
                  value={profileData.purok || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, purok: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Purok 1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Barangay</label>
                <input
                  type="text"
                  value={profileData.barangay || 'San Miguel'}
                  onChange={(e) => setProfileData(prev => ({ ...prev, barangay: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City/Municipality *</label>
                <input
                  type="text"
                  value={profileData.city || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Metro Manila"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Province *</label>
                <input
                  type="text"
                  value={profileData.province || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, province: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Metro Manila"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                <input
                  type="text"
                  value={profileData.zipCode || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, zipCode: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="1000"
                />
              </div>
            </div>
          </div>
          
          {/* Government ID Verification Section */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-yellow-900 mb-4">Government ID Verification</h4>
            <p className="text-sm text-yellow-700 mb-4">Upload at least one government-issued ID for verification</p>
            
            <div className="space-y-4">
              {/* SSS */}
              <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-medium text-gray-900 mb-3">Social Security System (SSS)</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SSS Number</label>
                    <input
                      type="text"
                      value={governmentIds.sss.number}
                      onChange={(e) => handleIdNumberChange('sss', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="XX-XXXXXXX-X"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload SSS ID</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => e.target.files && handleFileUpload('sss', e.target.files[0])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* PhilHealth */}
              <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-medium text-gray-900 mb-3">Philippine Health Insurance Corporation (PhilHealth)</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PhilHealth Number</label>
                    <input
                      type="text"
                      value={governmentIds.philhealth.number}
                      onChange={(e) => handleIdNumberChange('philhealth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="XX-XXXXXXXXX-X"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload PhilHealth ID</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => e.target.files && handleFileUpload('philhealth', e.target.files[0])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Pag-IBIG */}
              <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-medium text-gray-900 mb-3">Home Development Mutual Fund (Pag-IBIG)</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pag-IBIG Number</label>
                    <input
                      type="text"
                      value={governmentIds.pagibig.number}
                      onChange={(e) => handleIdNumberChange('pagibig', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="XXXX-XXXX-XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Pag-IBIG ID</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => e.target.files && handleFileUpload('pagibig', e.target.files[0])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* UMID */}
              <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-medium text-gray-900 mb-3">Unified Multi-Purpose ID (UMID)</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">UMID Number</label>
                    <input
                      type="text"
                      value={governmentIds.umid.number}
                      onChange={(e) => handleIdNumberChange('umid', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="XXXX-XXXXXXX-X"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload UMID</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => e.target.files && handleFileUpload('umid', e.target.files[0])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Driver's License */}
              <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-medium text-gray-900 mb-3">Driver's License</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                    <input
                      type="text"
                      value={governmentIds.driversLicense.number}
                      onChange={(e) => handleIdNumberChange('driversLicense', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="XXX-XX-XXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Driver's License</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => e.target.files && handleFileUpload('driversLicense', e.target.files[0])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Passport */}
              <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-medium text-gray-900 mb-3">Philippine Passport</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                    <input
                      type="text"
                      value={governmentIds.passport.number}
                      onChange={(e) => handleIdNumberChange('passport', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="XXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Passport</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => e.target.files && handleFileUpload('passport', e.target.files[0])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* House Location Section */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-purple-900 mb-4">House Location Mapping</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">House Location (Required for Semi-Verification) *</label>
              <button
                onClick={onLocationPick}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-100 transition-colors"
              >
                <MapPin className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-purple-600 font-medium">
                  {profileData.houseLocation?.address ? 'Update Location' : 'Pin Your House Location'}
                </span>
              </button>
              {profileData.houseLocation?.address && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">📍 Current Location:</p>
                  <p className="text-sm text-green-700">{profileData.houseLocation.address}</p>
                  <p className="text-xs text-green-600">
                    Coordinates: {profileData.houseLocation.lat.toFixed(6)}, {profileData.houseLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Emergency Contact Section */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-red-900 mb-4">Emergency Contact Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
                <input
                  type="text"
                  value={profileData.emergencyContactName || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Full name of emergency contact"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                <input
                  type="tel"
                  value={profileData.emergencyContactPhone || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="+63 912 345 6789"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
                <select
                  value={profileData.emergencyContactRelation || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContactRelation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select relationship</option>
                  <option value="spouse">Spouse</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="child">Child</option>
                  <option value="relative">Relative</option>
                  <option value="friend">Friend</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Address</label>
                <input
                  type="text"
                  value={profileData.emergencyContactAddress || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContactAddress: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Emergency contact address"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 border-t border-gray-200">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Important Notice</p>
                <p className="text-xs text-yellow-700">
                  Any changes to your profile will revert your verification status to semi-verified and require re-approval by barangay officials.
                </p>
              </div>
            </div>
          </div>
          
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
              Save Profile Changes
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
  const [mapClicks, setMapClicks] = useState<{ lat: number; lng: number }[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert click coordinates to lat/lng (simplified calculation)
    const lat = 14.5995 + (y - rect.height / 2) * 0.001;
    const lng = 120.9842 + (x - rect.width / 2) * 0.001;
    
    // Simulate reverse geocoding with more realistic address
    const streetNames = ['Main St', 'Oak Ave', 'Pine Rd', 'Maple Dr', 'Cedar Ln'];
    const randomStreet = streetNames[Math.floor(Math.random() * streetNames.length)];
    const houseNumber = Math.floor(Math.random() * 999) + 1;
    const address = `${houseNumber} ${randomStreet}, Barangay San Miguel, Metro Manila`;
    
    setSelectedLocation({ lat, lng, address });
    setMapClicks([...mapClicks, { lat, lng }]);
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
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">📍 How to Pin Your Location</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Click anywhere on the map below to pin your house location</li>
                <li>2. The pin will appear where you clicked</li>
                <li>3. Review the generated address</li>
                <li>4. Click "Confirm Location" to save</li>
              </ol>
            </div>
            
            <div 
              className="bg-gradient-to-br from-green-100 to-blue-100 h-64 sm:h-96 rounded-lg border-2 border-dashed border-gray-300 cursor-crosshair relative overflow-hidden"
              onClick={handleMapClick}
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                  linear-gradient(45deg, rgba(168, 85, 247, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)
                `
              }}
            >
              {/* Map Grid Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-12 h-full">
                  {Array.from({ length: 144 }, (_, i) => (
                    <div key={i} className="border border-gray-300"></div>
                  ))}
                </div>
              </div>
              
              {/* Street Labels */}
              <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-700">
                Main Street
              </div>
              <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-700">
                Oak Avenue
              </div>
              
              {/* Click Instructions */}
              {!selectedLocation && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center bg-white bg-opacity-95 p-6 rounded-lg shadow-lg">
                    <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                    <p className="text-gray-800 font-medium mb-2">Click anywhere on this map</p>
                    <p className="text-sm text-gray-600">to pin your house location</p>
                  </div>
                </div>
              )}
              
              {/* Location Pins */}
              {mapClicks.map((click, index) => (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-full"
                  style={{
                    left: `${((click.lng - 120.9842) / 0.001 + 50) * (100 / 100)}%`,
                    top: `${((click.lat - 14.5995) / -0.001 + 50) * (100 / 100)}%`
                  }}
                >
                  <div className="bg-red-500 w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  {index === mapClicks.length - 1 && (
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      Your House
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {selectedLocation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-green-800 mb-2">Selected Location</h4>
              <p className="text-green-700">Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</p>
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