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
  Edit3
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
  const { user } = useAuth();
  const { residents } = useData();
  const [activeTab, setActiveTab] = useState('profile');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResident, setEditedResident] = useState<any>(null);

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
    { id: 'profile', label: 'Profile & Location', icon: User },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'family', label: 'Family Tree', icon: Users },
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

  const ResidentProfile = () => {
    if (!resident || !editedResident) return null;

    return (
      <div className="space-y-6">
        {/* Header with Edit Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
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
        <VerificationStatus 
          status={resident.verification_status} 
          qrCode={resident.qr_code}
        />

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              {isEditing && !isVerified ? (
                <input
                  type="text"
                  value={editedResident.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 py-2">{resident.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900 py-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                {resident.email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              {isEditing && !isVerified ? (
                <input
                  type="tel"
                  value={editedResident.phone_number || ''}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 py-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  {resident.phone_number}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
              {isEditing && !isVerified ? (
                <input
                  type="date"
                  value={editedResident.birth_date || ''}
                  onChange={(e) => handleInputChange('birth_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 py-2 flex items-center gap-2">
                  <Baby className="w-4 h-4 text-gray-500" />
                  {resident.birth_date ? new Date(resident.birth_date).toLocaleDateString() : 'Not provided'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              {isEditing && !isVerified ? (
                <select
                  value={editedResident.gender || ''}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              ) : (
                <p className="text-gray-900 py-2">{resident.gender || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
              {isEditing && !isVerified ? (
                <select
                  value={editedResident.civil_status || ''}
                  onChange={(e) => handleInputChange('civil_status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Civil Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widowed">Widowed</option>
                  <option value="separated">Separated</option>
                  <option value="divorced">Divorced</option>
                </select>
              ) : (
                <p className="text-gray-900 py-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-gray-500" />
                  {resident.civil_status || 'Not provided'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              {isEditing && !isVerified ? (
                <input
                  type="text"
                  value={editedResident.nationality || ''}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 py-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  {resident.nationality || 'Not provided'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
              {isEditing && !isVerified ? (
                <input
                  type="text"
                  value={editedResident.religion || ''}
                  onChange={(e) => handleInputChange('religion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 py-2 flex items-center gap-2">
                  <Church className="w-4 h-4 text-gray-500" />
                  {resident.religion || 'Not provided'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              {isEditing && !isVerified ? (
                <input
                  type="text"
                  value={editedResident.occupation || ''}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 py-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  {resident.occupation || 'Not provided'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income</label>
              {isEditing && !isVerified ? (
                <input
                  type="text"
                  value={editedResident.monthly_income || ''}
                  onChange={(e) => handleInputChange('monthly_income', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 py-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  {resident.monthly_income || 'Not provided'}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            {isEditing && !isVerified ? (
              <textarea
                value={editedResident.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2 flex items-start gap-2">
                <Home className="w-4 h-4 text-gray-500 mt-1" />
                {resident.address}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
            {isEditing && !isVerified ? (
              <input
                type="text"
                value={editedResident.emergency_contact || ''}
                onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-gray-500" />
                {resident.emergency_contact || 'Not provided'}
              </p>
            )}
          </div>
        </div>

        {/* House Location */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            House Location
          </h3>
          
          <HouseholdMapPinning 
            residentId={resident.id}
            readonly={isVerified}
          />
        </div>

        {/* QR Code */}
        {resident.qr_code && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
            <QRCodeDisplay qrCode={resident.qr_code} />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resident Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {resident.name}!</p>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`${
                    activeTab === item.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'profile' && <ResidentProfile />}

          {activeTab === 'documents' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Documents</h2>
              {documents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No documents found.</p>
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
          )}

          {activeTab === 'appointments' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Appointments</h2>
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No appointments found.</p>
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
          )}

          {activeTab === 'incidents' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Incidents</h2>
              {incidents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No incidents found.</p>
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
          )}

          {activeTab === 'family' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Family Tree</h2>
              <FamilyTreeView 
                residentId={resident.id} 
                familyMembers={familyMembers}
                readonly={isVerified}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;