import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { dataService } from '../services/dataService';
import QRCodeDisplay from '../components/QRCodeDisplay';
import VerificationStatus from '../components/VerificationStatus';
import FamilyTreeView from '../components/FamilyTreeView';
import HouseholdMapPinning from '../components/HouseholdMapPinning';
import {
  Building2,
  User,
  FileText,
  Calendar,
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  Home,
  Users,
  Heart,
  Briefcase,
  DollarSign,
  Globe,
  Church,
  Baby,
  UserCheck,
  Save,
  Edit3,
  LogOut,
  Bell,
  Settings,
  Shield,
  QrCode,
  Clock,
  CheckCircle,
  XCircle,
  Menu,
  X
} from 'lucide-react';

interface Document {
  id: string;
  document_type: string;
  status: string;
  requested_date: string;
  fee: number;
  payment_status: string;
  tracking_number?: string;
}

interface Appointment {
  id: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

interface Incident {
  id: string;
  incident_type: string;
  subject: string;
  status: string;
  date_submitted: string;
  priority: string;
}

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: string;
  birth_date?: string;
  occupation?: string;
  education_level?: string;
}

const ResidentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { residents } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResident, setEditedResident] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const resident = residents.find(r => r.email === user?.email);
  const isVerified = resident?.verification_status === 'verified';

  useEffect(() => {
    if (resident) {
      setEditedResident({ ...resident });
      fetchUserData();
    }
  }, [resident]);

  const fetchUserData = async () => {
    if (!resident) return;

    try {
      setLoading(true);
      
      // Fetch documents
      const docsData = await dataService.getDocumentsByResident(resident.id);
      setDocuments(docsData || []);

      // Fetch appointments
      const appointmentsData = await dataService.getAppointmentsByResident(resident.email);
      setAppointments(appointmentsData || []);

      // Fetch incidents
      const incidentsData = await dataService.getIncidentsByReporter(resident.email);
      setIncidents(incidentsData || []);

      // Fetch family members
      const familyData = await dataService.getFamilyMembersByResident(resident.id);
      setFamilyMembers(familyData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editedResident || !resident) return;

    try {
      await dataService.updateResident(resident.id, editedResident);
      setIsEditing(false);
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedResident(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'profile', label: 'Profile & Location', icon: User },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'family', label: 'Family Tree', icon: Users },
    { id: 'qr-code', label: 'QR Code', icon: QrCode },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'ready': return 'text-green-600 bg-green-100';
      case 'released': return 'text-gray-600 bg-gray-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'investigating': return 'text-blue-600 bg-blue-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'dismissed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'semi-verified':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'details-updated':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'non-verified':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'semi-verified':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'details-updated':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'non-verified':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const ResidentOverview = () => {
    const stats = [
      {
        title: 'Documents',
        value: documents.length,
        subtitle: `${documents.filter(d => d.status === 'pending').length} pending`,
        icon: FileText,
        color: 'bg-blue-500'
      },
      {
        title: 'Appointments',
        value: appointments.length,
        subtitle: `${appointments.filter(a => a.status === 'scheduled').length} scheduled`,
        icon: Calendar,
        color: 'bg-green-500'
      },
      {
        title: 'Incidents',
        value: incidents.length,
        subtitle: `${incidents.filter(i => i.status === 'pending').length} pending`,
        icon: AlertTriangle,
        color: 'bg-red-500'
      },
      {
        title: 'Family Members',
        value: familyMembers.length,
        subtitle: 'registered',
        icon: Users,
        color: 'bg-purple-500'
      }
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {resident?.name}!</h1>
          <p className="text-gray-600 mt-1">Here's an overview of your account and services</p>
        </div>

        {/* Verification Status Card */}
        <div className={`rounded-lg border p-6 ${getVerificationStatusColor(resident?.verification_status || 'non-verified')}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getVerificationStatusIcon(resident?.verification_status || 'non-verified')}
              <div>
                <h3 className="font-semibold text-lg capitalize">
                  {(resident?.verification_status || 'non-verified').replace('-', ' ')} Status
                </h3>
                <p className="text-sm opacity-80">
                  {resident?.verification_status === 'verified' 
                    ? 'Your account is fully verified. You have access to all services.'
                    : resident?.verification_status === 'semi-verified'
                    ? 'Your account is semi-verified. Awaiting final verification.'
                    : resident?.verification_status === 'details-updated'
                    ? 'Your profile is complete. Please submit documents for verification.'
                    : 'Please complete your profile to begin verification.'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('profile')}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm font-medium transition-colors"
            >
              View Profile
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.subtitle}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {documents.slice(0, 3).map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.document_type}</p>
                    <p className="text-sm text-gray-500">Requested on {new Date(doc.requested_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                  {doc.status}
                </span>
              </div>
            ))}
            {documents.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ResidentProfile = () => {
    if (!resident || !editedResident) return null;

    return (
      <div className="space-y-6">
        {/* Header with Edit Button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Information</h1>
            <p className="text-gray-600 mt-1">Manage your personal information and house location</p>
          </div>
          {!isVerified && (
            <button
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isEditing 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          )}
        </div>

        {/* Verification Status */}
        <div className={`rounded-lg border p-6 ${getVerificationStatusColor(resident?.verification_status || 'non-verified')}`}>
          <div className="flex items-center space-x-3 mb-4">
            {getVerificationStatusIcon(resident?.verification_status || 'non-verified')}
            <h3 className="text-lg font-semibold capitalize">
              {(resident?.verification_status || 'non-verified').replace('-', ' ')} Status
            </h3>
          </div>
          <p className="text-sm opacity-90">
            {resident?.verification_status === 'verified' 
              ? 'Your account is fully verified. You have complete access to all barangay services.'
              : resident?.verification_status === 'semi-verified'
              ? 'Your account is semi-verified. Awaiting final verification by barangay officials.'
              : resident?.verification_status === 'details-updated'
              ? 'Your profile is complete. Please submit required documents for verification.'
              : 'Please complete your profile information to begin the verification process.'
            }
          </p>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              {isEditing && !isVerified ? (
                <input
                  type="text"
                  value={editedResident.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">{resident.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{resident.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              {isEditing && !isVerified ? (
                <input
                  type="tel"
                  value={editedResident.phone_number || ''}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{resident.phone_number}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
              {isEditing && !isVerified ? (
                <input
                  type="date"
                  value={editedResident.birth_date || ''}
                  onChange={(e) => handleInputChange('birth_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg">
                  <Baby className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">
                    {resident.birth_date ? new Date(resident.birth_date).toLocaleDateString() : 'Not provided'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              {isEditing && !isVerified ? (
                <select
                  value={editedResident.gender || ''}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              ) : (
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">{resident.gender || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Civil Status</label>
              {isEditing && !isVerified ? (
                <select
                  value={editedResident.civil_status || ''}
                  onChange={(e) => handleInputChange('civil_status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Civil Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widowed">Widowed</option>
                  <option value="separated">Separated</option>
                  <option value="divorced">Divorced</option>
                </select>
              ) : (
                <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg">
                  <Heart className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{resident.civil_status || 'Not provided'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
              {isEditing && !isVerified ? (
                <input
                  type="text"
                  value={editedResident.nationality || ''}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{resident.nationality || 'Not provided'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
              {isEditing && !isVerified ? (
                <input
                  type="text"
                  value={editedResident.religion || ''}
                  onChange={(e) => handleInputChange('religion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg">
                  <Church className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{resident.religion || 'Not provided'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
              {isEditing && !isVerified ? (
                <input
                  type="text"
                  value={editedResident.occupation || ''}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{resident.occupation || 'Not provided'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income</label>
              {isEditing && !isVerified ? (
                <input
                  type="text"
                  value={editedResident.monthly_income || ''}
                  onChange={(e) => handleInputChange('monthly_income', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{resident.monthly_income || 'Not provided'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            {isEditing && !isVerified ? (
              <textarea
                value={editedResident.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="flex items-start gap-2 py-2 px-3 bg-gray-50 rounded-lg">
                <Home className="w-4 h-4 text-gray-500 mt-1" />
                <span className="text-gray-900">{resident.address}</span>
              </div>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
            {isEditing && !isVerified ? (
              <input
                type="text"
                value={editedResident.emergency_contact || ''}
                onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg">
                <UserCheck className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{resident.emergency_contact || 'Not provided'}</span>
              </div>
            )}
          </div>
        </div>

        {/* House Location */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            House Location
          </h3>
          
          <HouseholdMapPinning readonly={isVerified} />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!resident) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Resident Profile Not Found</h2>
          <p className="text-gray-600">Please complete your registration first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Resident Portal</h2>
                <p className="text-sm text-gray-600">Barangay San Miguel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold text-blue-700">
                  {resident.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{resident.name}</p>
                <p className="text-xs text-gray-500 truncate">{resident.email}</p>
                <div className="flex items-center mt-1">
                  {getVerificationStatusIcon(resident.verification_status || 'non-verified')}
                  <span className="text-xs text-gray-600 ml-1 capitalize">
                    {(resident.verification_status || 'non-verified').replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Resident Dashboard</h1>
            <div className="w-6 h-6"></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'overview' && <ResidentOverview />}
          {activeTab === 'profile' && <ResidentProfile />}
          
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
                <p className="text-gray-600 mt-1">Track your document requests and status</p>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200">
                {documents.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No documents found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Document Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Requested Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fee
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tracking Number
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {documents.map((doc) => (
                          <tr key={doc.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {doc.document_type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                                {doc.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(doc.requested_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₱{doc.fee.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.payment_status)}`}>
                                {doc.payment_status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {doc.tracking_number || 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
                <p className="text-gray-600 mt-1">View and manage your scheduled appointments</p>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200">
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No appointments found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {appointments.map((appointment) => (
                          <tr key={appointment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {appointment.service}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(appointment.appointment_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {appointment.appointment_time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'incidents' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Incidents</h1>
                <p className="text-gray-600 mt-1">Track your reported incidents and complaints</p>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200">
                {incidents.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No incidents found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subject
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Priority
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date Submitted
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {incidents.map((incident) => (
                          <tr key={incident.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {incident.incident_type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {incident.subject}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                                {incident.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(incident.priority)}`}>
                                {incident.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(incident.date_submitted).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'family' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Family Tree</h1>
                <p className="text-gray-600 mt-1">Manage your family member information</p>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <FamilyTreeView />
              </div>
            </div>
          )}

          {activeTab === 'qr-code' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My QR Code</h1>
                <p className="text-gray-600 mt-1">Your digital identification for barangay services</p>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <QRCodeDisplay />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ResidentDashboard;