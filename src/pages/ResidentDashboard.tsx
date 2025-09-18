import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  MapPin, 
  FileText, 
  CreditCard, 
  Heart, 
  Users, 
  QrCode, 
  Shield, 
  Calendar, 
  Phone, 
  Mail, 
  Home, 
  Briefcase, 
  GraduationCap, 
  Baby, 
  Camera, 
  Edit3, 
  Save, 
  X,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  LogOut
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import VerificationStatus from '../components/VerificationStatus';
import QRCodeGenerator from '../components/QRCodeGenerator';
import FamilyTreeView from '../components/FamilyTreeView';

export default function ResidentDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'profile', label: 'Personal Information', icon: User },
    { id: 'verification', label: 'Verification Status', icon: Shield },
    { id: 'qr-code', label: 'QR Code', icon: QrCode },
    { id: 'family', label: 'Family Tree', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'health', label: 'Health Records', icon: Heart },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <PersonalInformation />;
      case 'verification':
        return <VerificationStatus />;
      case 'qr-code':
        return <QRCodeGenerator />;
      case 'family':
        return <FamilyTreeView />;
      case 'documents':
        return <DocumentsSection />;
      case 'payments':
        return <PaymentsSection />;
      case 'health':
        return <HealthRecords />;
      case 'appointments':
        return <AppointmentsSection />;
      default:
        return <PersonalInformation />;
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
              Resident Portal
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

function PersonalInformation() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    // Basic Information
    firstName: user?.name?.split(' ')[0] || '',
    middleName: '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    suffix: '',
    nickname: '',
    birthDate: '',
    birthPlace: '',
    age: '',
    gender: '',
    civilStatus: '',
    nationality: 'Filipino',
    religion: '',
    
    // Contact Information
    email: user?.email || '',
    mobileNumber: '',
    landlineNumber: '',
    
    // Address Information
    houseNumber: '',
    street: '',
    subdivision: '',
    barangay: 'San Miguel',
    city: 'Metro Manila',
    province: 'Metro Manila',
    zipCode: '',
    coordinates: { lat: null, lng: null },
    locationVerified: false,
    
    // Government IDs
    sssNumber: '',
    tinNumber: '',
    philhealthNumber: '',
    pagibigNumber: '',
    votersId: '',
    driversLicense: '',
    passport: '',
    
    // Employment Information
    employmentStatus: '',
    occupation: '',
    employer: '',
    workAddress: '',
    monthlyIncome: '',
    
    // Educational Background
    educationalAttainment: '',
    school: '',
    course: '',
    yearGraduated: '',
    
    // Household Information
    householdHead: '',
    relationToHead: '',
    householdSize: '',
    householdIncome: '',
    houseOwnership: '',
    houseType: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactNumber: '',
    emergencyContactAddress: '',
    
    // Health Information
    bloodType: '',
    allergies: '',
    medications: '',
    medicalConditions: '',
    disabilities: '',
    
    // Additional Information
    skills: '',
    hobbies: '',
    organizations: '',
    previousAddress: '',
    lengthOfResidency: ''
  });

  const handleSave = () => {
    const fullName = `${personalInfo.firstName} ${personalInfo.middleName} ${personalInfo.lastName} ${personalInfo.suffix}`.trim();
    updateUser({ 
      name: fullName,
      email: personalInfo.email,
      personalInfo: personalInfo
    });
    setIsEditing(false);
  };

  const handleLocationPin = () => {
    // Simulate location pinning
    const mockCoordinates = {
      lat: 14.5995 + (Math.random() - 0.5) * 0.01,
      lng: 120.9842 + (Math.random() - 0.5) * 0.01
    };
    
    setPersonalInfo(prev => ({
      ...prev,
      coordinates: mockCoordinates,
      locationVerified: false // Will be verified by barangay official
    }));
    setShowLocationModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Photo Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-purple-600" />
          </div>
          <div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </button>
            <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={personalInfo.firstName}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
            <input
              type="text"
              value={personalInfo.middleName}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, middleName: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={personalInfo.lastName}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Suffix</label>
            <select
              value={personalInfo.suffix}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, suffix: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            >
              <option value="">None</option>
              <option value="Jr.">Jr.</option>
              <option value="Sr.">Sr.</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nickname</label>
            <input
              type="text"
              value={personalInfo.nickname}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, nickname: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
            <input
              type="date"
              value={personalInfo.birthDate}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, birthDate: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birth Place</label>
            <input
              type="text"
              value={personalInfo.birthPlace}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, birthPlace: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="number"
              value={personalInfo.age}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, age: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={personalInfo.gender}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, gender: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Civil Status</label>
            <select
              value={personalInfo.civilStatus}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, civilStatus: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            >
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
              <option value="Divorced">Divorced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
            <input
              type="text"
              value={personalInfo.nationality}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, nationality: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
            <input
              type="text"
              value={personalInfo.religion}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, religion: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Phone className="h-5 w-5 mr-2" />
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
            <input
              type="tel"
              value={personalInfo.mobileNumber}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, mobileNumber: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
              placeholder="+63 912 345 6789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Landline Number</label>
            <input
              type="tel"
              value={personalInfo.landlineNumber}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, landlineNumber: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
              placeholder="(02) 123-4567"
            />
          </div>
        </div>
      </div>

      {/* Address & Location */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Address & Location
          </h3>
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Pin Location
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">House Number</label>
            <input
              type="text"
              value={personalInfo.houseNumber}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, houseNumber: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
            <input
              type="text"
              value={personalInfo.street}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, street: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subdivision/Village</label>
            <input
              type="text"
              value={personalInfo.subdivision}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, subdivision: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barangay</label>
            <input
              type="text"
              value={personalInfo.barangay}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={personalInfo.city}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, city: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
            <input
              type="text"
              value={personalInfo.zipCode}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, zipCode: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
        </div>

        {/* Location Status */}
        {personalInfo.coordinates.lat && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-800">House Location</h4>
                <p className="text-sm text-blue-600">
                  Coordinates: {personalInfo.coordinates.lat?.toFixed(6)}, {personalInfo.coordinates.lng?.toFixed(6)}
                </p>
              </div>
              <div className="flex items-center">
                {personalInfo.locationVerified ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center text-yellow-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Pending Verification</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Government IDs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Government IDs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SSS Number</label>
            <input
              type="text"
              value={personalInfo.sssNumber}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, sssNumber: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">TIN Number</label>
            <input
              type="text"
              value={personalInfo.tinNumber}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, tinNumber: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PhilHealth Number</label>
            <input
              type="text"
              value={personalInfo.philhealthNumber}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, philhealthNumber: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pag-IBIG Number</label>
            <input
              type="text"
              value={personalInfo.pagibigNumber}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, pagibigNumber: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voter's ID</label>
            <input
              type="text"
              value={personalInfo.votersId}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, votersId: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Driver's License</label>
            <input
              type="text"
              value={personalInfo.driversLicense}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, driversLicense: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Employment Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Briefcase className="h-5 w-5 mr-2" />
          Employment Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
            <select
              value={personalInfo.employmentStatus}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, employmentStatus: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            >
              <option value="">Select Status</option>
              <option value="Employed">Employed</option>
              <option value="Self-employed">Self-employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Student">Student</option>
              <option value="Retired">Retired</option>
              <option value="OFW">OFW</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
            <input
              type="text"
              value={personalInfo.occupation}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, occupation: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employer/Company</label>
            <input
              type="text"
              value={personalInfo.employer}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, employer: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Work Address</label>
            <input
              type="text"
              value={personalInfo.workAddress}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, workAddress: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income</label>
            <select
              value={personalInfo.monthlyIncome}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, monthlyIncome: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            >
              <option value="">Select Range</option>
              <option value="Below 10,000">Below ₱10,000</option>
              <option value="10,000 - 20,000">₱10,000 - ₱20,000</option>
              <option value="20,001 - 30,000">₱20,001 - ₱30,000</option>
              <option value="30,001 - 50,000">₱30,001 - ₱50,000</option>
              <option value="Above 50,000">Above ₱50,000</option>
            </select>
          </div>
        </div>
      </div>

      {/* Educational Background */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <GraduationCap className="h-5 w-5 mr-2" />
          Educational Background
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Educational Attainment</label>
            <select
              value={personalInfo.educationalAttainment}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, educationalAttainment: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            >
              <option value="">Select Level</option>
              <option value="Elementary">Elementary</option>
              <option value="High School">High School</option>
              <option value="Vocational">Vocational</option>
              <option value="College">College</option>
              <option value="Post Graduate">Post Graduate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
            <input
              type="text"
              value={personalInfo.school}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, school: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course/Program</label>
            <input
              type="text"
              value={personalInfo.course}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, course: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year Graduated</label>
            <input
              type="number"
              value={personalInfo.yearGraduated}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, yearGraduated: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Household Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Home className="h-5 w-5 mr-2" />
          Household Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Household Head</label>
            <input
              type="text"
              value={personalInfo.householdHead}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, householdHead: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relation to Head</label>
            <select
              value={personalInfo.relationToHead}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, relationToHead: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            >
              <option value="">Select Relation</option>
              <option value="Head">Head</option>
              <option value="Spouse">Spouse</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Other Relative">Other Relative</option>
              <option value="Non-Relative">Non-Relative</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Household Size</label>
            <input
              type="number"
              value={personalInfo.householdSize}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, householdSize: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Household Income</label>
            <select
              value={personalInfo.householdIncome}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, householdIncome: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            >
              <option value="">Select Range</option>
              <option value="Below 20,000">Below ₱20,000</option>
              <option value="20,000 - 40,000">₱20,000 - ₱40,000</option>
              <option value="40,001 - 60,000">₱40,001 - ₱60,000</option>
              <option value="60,001 - 100,000">₱60,001 - ₱100,000</option>
              <option value="Above 100,000">Above ₱100,000</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">House Ownership</label>
            <select
              value={personalInfo.houseOwnership}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, houseOwnership: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            >
              <option value="">Select Type</option>
              <option value="Owned">Owned</option>
              <option value="Rented">Rented</option>
              <option value="Shared">Shared</option>
              <option value="Caretaker">Caretaker</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">House Type</label>
            <select
              value={personalInfo.houseType}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, houseType: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            >
              <option value="">Select Type</option>
              <option value="Concrete">Concrete</option>
              <option value="Semi-Concrete">Semi-Concrete</option>
              <option value="Wood">Wood</option>
              <option value="Mixed Materials">Mixed Materials</option>
              <option value="Makeshift">Makeshift</option>
            </select>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
            <input
              type="text"
              value={personalInfo.emergencyContactName}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, emergencyContactName: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
            <input
              type="text"
              value={personalInfo.emergencyContactRelation}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, emergencyContactRelation: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
            <input
              type="tel"
              value={personalInfo.emergencyContactNumber}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, emergencyContactNumber: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={personalInfo.emergencyContactAddress}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, emergencyContactAddress: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Health Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Heart className="h-5 w-5 mr-2" />
          Health Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
            <select
              value={personalInfo.bloodType}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, bloodType: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
            <input
              type="text"
              value={personalInfo.allergies}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, allergies: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
              placeholder="List any allergies"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
            <input
              type="text"
              value={personalInfo.medications}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, medications: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
              placeholder="List current medications"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
            <textarea
              value={personalInfo.medicalConditions}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, medicalConditions: e.target.value }))}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
              placeholder="List any medical conditions"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Disabilities</label>
            <input
              type="text"
              value={personalInfo.disabilities}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, disabilities: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
              placeholder="List any disabilities"
            />
          </div>
        </div>
      </div>

      {/* Location Pin Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Pin Your House Location</h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 mb-6">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive map will appear here</p>
                <p className="text-sm text-gray-500 mt-2">Click on the map to pin your exact house location</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">Location Verification Process</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Pin your exact house location on the map</li>
                <li>2. Your location will be submitted for verification</li>
                <li>3. A barangay official will verify your location</li>
                <li>4. Once verified, this will be part of your KYC process</li>
              </ol>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLocationModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLocationPin}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentsSection() {
  const documents = [
    { id: 1, name: 'Barangay Clearance', status: 'Approved', date: '2024-03-10', fee: '₱50' },
    { id: 2, name: 'Certificate of Residency', status: 'Processing', date: '2024-03-12', fee: '₱30' },
    { id: 3, name: 'Certificate of Indigency', status: 'Pending', date: '2024-03-14', fee: '₱25' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Document Requests</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          Request Document
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    doc.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    doc.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.fee}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-purple-600 hover:text-purple-900">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaymentsSection() {
  const payments = [
    { id: 1, description: 'Barangay Clearance', amount: '₱50', status: 'Paid', date: '2024-03-10', method: 'GCash' },
    { id: 2, description: 'Certificate of Residency', amount: '₱30', status: 'Pending', date: '2024-03-12', method: 'Cash' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Payment History</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Paid</h3>
          <p className="text-3xl font-bold text-green-600">₱50</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">₱30</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-blue-600">{payments.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HealthRecords() {
  const healthRecords = [
    { id: 1, type: 'Vaccination', description: 'COVID-19 Booster', date: '2024-02-15', provider: 'Barangay Health Center' },
    { id: 2, type: 'Check-up', description: 'Annual Physical Exam', date: '2024-01-20', provider: 'Dr. Maria Santos' },
    { id: 3, type: 'Vaccination', description: 'Flu Shot', date: '2023-12-10', provider: 'Barangay Health Center' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Health Records</h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          Add Record
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Records</h3>
          <p className="text-3xl font-bold text-blue-600">{healthRecords.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Vaccinations</h3>
          <p className="text-3xl font-bold text-green-600">2</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Check-ups</h3>
          <p className="text-3xl font-bold text-purple-600">1</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {healthRecords.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    record.type === 'Vaccination' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {record.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.provider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AppointmentsSection() {
  const appointments = [
    { id: 1, service: 'Document Processing', type: 'Barangay Clearance', date: '2024-03-20', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, service: 'Health Consultation', type: 'General Check-up', date: '2024-03-25', time: '2:00 PM', status: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Appointments</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Schedule Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming</h3>
          <p className="text-3xl font-bold text-blue-600">2</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmed</h3>
          <p className="text-3xl font-bold text-green-600">1</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">1</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.service}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date} at {appointment.time}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}