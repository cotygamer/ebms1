import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { dataService } from '../services/dataService';
import { useOfflineSync } from '../hooks/useOfflineSync';
import OfflineIndicator from '../components/OfflineIndicator';
import OfflineDocumentForm from '../components/OfflineDocumentForm';
import OfflineIncidentForm from '../components/OfflineIncidentForm';
import VerificationStatus from '../components/VerificationStatus';
import QRCodeDisplay from '../components/QRCodeDisplay';
import FamilyTreeView from '../components/FamilyTreeView';
import HouseholdMapPinning from '../components/HouseholdMapPinning';
import HouseholdMapPinning from '../components/HouseholdMapPinning';
import { 
  Building2, 
  User, 
  Shield, 
  QrCode, 
  Users, 
  FileText, 
  LogOut, 
  Edit, 
  Save, 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Home, 
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Search,
  Filter,
  Send,
  MessageSquare,
  Flag,
  Camera,
  Upload,
  Star,
  Trash2
} from 'lucide-react';

export default function ResidentDashboard() {
  const { user, updateUser, logout } = useAuth();
  const { documents: contextDocuments, addDocument, complaints, addComplaint } = useData();
  const { status: offlineStatus } = useOfflineSync();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showDocumentRequest, setShowDocumentRequest] = useState(false);
  const [showIncidentReport, setShowIncidentReport] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    lastName: user?.lastName || '',
    suffix: user?.suffix || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate || '',
    gender: user?.gender || '',
    civilStatus: user?.civilStatus || '',
    nationality: user?.nationality || 'Filipino',
    occupation: user?.occupation || '',
    monthlyIncome: user?.monthlyIncome || '',
    houseNumber: user?.houseNumber || '',
    purok: user?.purok || '',
    barangay: user?.barangay || 'San Miguel',
    city: user?.city || 'Metro Manila',
    province: user?.province || 'Metro Manila',
    zipCode: user?.zipCode || '',
    emergencyContactName: user?.emergencyContactName || '',
    emergencyContactPhone: user?.emergencyContactPhone || '',
    emergencyContactRelation: user?.emergencyContactRelation || '',
    emergencyContactAddress: user?.emergencyContactAddress || ''
  });

  const [documentRequest, setDocumentRequest] = useState({
    documentType: '',
    purpose: '',
    quantity: 1,
    urgency: 'regular',
    notes: ''
  });

  const [incidentReport, setIncidentReport] = useState({
    type: '',
    subject: '',
    description: '',
    location: '',
    priority: 'medium',
    evidence: [] as string[],
    witnessName: '',
    witnessContact: '',
    dateOccurred: '',
    timeOccurred: ''
  });

  // Use real-time documents from context
  const documents = contextDocuments.filter(doc => 
    doc.residentId === user?.id || doc.resident_id === user?.id
  );

  // Get user's incident reports
  const [incidentReports, setIncidentReports] = useState([]);
  
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const incidents = await dataService.getIncidents();
        const userIncidents = incidents.filter(incident => 
          incident.reporter_email === user?.email
        );
        setIncidentReports(userIncidents);
      } catch (error) {
        console.error('Failed to fetch incidents:', error);
      }
    };
    
    if (user?.email) {
      fetchIncidents();
    }
  }, [user?.email]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = () => {
    updateUser(editData);
    setIsEditing(false);
  };

  const handleDocumentRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (documentRequest.documentType && documentRequest.purpose) {
      try {
        await addDocument({
          resident_id: user?.id,
          document_type: documentRequest.documentType,
          status: 'pending',
          fee: getDocumentFee(documentRequest.documentType),
          payment_status: 'unpaid',
          purpose: documentRequest.purpose,
          notes: `Urgency: ${documentRequest.urgency}`
        });
        
        setDocumentRequest({ documentType: '', purpose: '', quantity: 1, urgency: 'regular', notes: '' });
        setShowDocumentRequest(false);
        alert('Document request submitted successfully!');
      } catch (error) {
        console.error('Failed to submit document request:', error);
        alert('Failed to submit document request. Please try again.');
      }
    }
  };

  const handleIncidentReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (incidentReport.type && incidentReport.subject && incidentReport.description) {
      try {
        await addComplaint({
          residentName: user?.name || '',
          residentEmail: user?.email || '',
          type: incidentReport.type,
          subject: incidentReport.subject,
          description: incidentReport.description,
          status: 'pending',
          priority: incidentReport.priority,
          dateSubmitted: new Date().toISOString().split('T')[0],
          location: incidentReport.location,
          dateOccurred: incidentReport.dateOccurred,
          timeOccurred: incidentReport.timeOccurred,
          witnessName: incidentReport.witnessName,
          witnessContact: incidentReport.witnessContact,
          assignedTo: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        setIncidentReport({
          type: '',
          subject: '',
          description: '',
          location: '',
          priority: 'medium',
          evidence: [],
          witnessName: '',
          witnessContact: '',
          dateOccurred: '',
          timeOccurred: ''
        });
        setShowIncidentReport(false);
        alert('Incident report submitted successfully!');
        
        // Refresh incidents
        const incidents = await dataService.getIncidents();
        const userIncidents = incidents.filter(incident => 
          incident.reporter_email === user?.email
        );
        setIncidentReports(userIncidents);
      } catch (error) {
        console.error('Failed to submit incident report:', error);
        alert('Failed to submit incident report. Please try again.');
      }
    }
  };

  const getDocumentFee = (documentType: string) => {
    const fees: { [key: string]: number } = {
      'Barangay Clearance': 50,
      'Certificate of Residency': 30,
      'Certificate of Indigency': 25,
      'Business Permit': 200,
      'Building Permit': 500,
      'Cedula': 35,
      'Community Tax Certificate': 35,
      'Barangay ID': 100
    };
    return fees[documentType] || 50;
  };

  const userDocuments = documents.filter(doc => doc.residentId === user?.id);
  const userComplaints = complaints.filter(complaint => complaint.residentEmail === user?.email);

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">My Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Edit className="h-4 w-4 mr-2" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.firstName || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.lastName || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editData.birthDate}
                      onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.birthDate || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  {isEditing ? (
                    <select
                      value={editData.gender}
                      onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 capitalize">{user?.gender || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">House Number/Street</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.houseNumber}
                    onChange={(e) => setEditData({ ...editData, houseNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{user?.houseNumber || 'Not provided'}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purok/Sitio</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.purok}
                      onChange={(e) => setEditData({ ...editData, purok: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.purok || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barangay</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.barangay}
                      onChange={(e) => setEditData({ ...editData, barangay: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.barangay || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.city}
                      onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.city || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.province}
                      onChange={(e) => setEditData({ ...editData, province: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.province || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleSaveProfile}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">My Documents</h2>
        <button
          onClick={() => setShowDocumentRequest(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Request Document
        </button>
      </div>

      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold text-blue-600">{userDocuments.length}</p>
            </div>
            <FileText className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {userDocuments.filter(d => d.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-12 w-12 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ready</p>
              <p className="text-3xl font-bold text-green-600">
                {userDocuments.filter(d => d.status === 'ready').length}
              </p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Released</p>
              <p className="text-3xl font-bold text-purple-600">
                {userDocuments.filter(d => d.status === 'released').length}
              </p>
            </div>
            <Download className="h-12 w-12 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Document Requests</h3>
        </div>
        
        {userDocuments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Requested</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{document.document_type || document.documentType}</div>
                        <div className="text-sm text-gray-500">{document.purpose}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        document.status === 'ready' || document.status === 'released' ? 'bg-green-100 text-green-800' :
                        document.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        document.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {document.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₱{document.fee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {document.requested_date || document.requestedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedDocument(document)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Document Requests</h3>
            <p className="text-gray-600 mb-4">You haven't requested any documents yet.</p>
            <button
              onClick={() => setShowDocumentRequest(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Request Your First Document
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderComplaints = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Incident Reports & Complaints</h2>
        <button
          onClick={() => setShowIncidentReport(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          File Report
        </button>
      </div>

      {/* Complaint Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-3xl font-bold text-blue-600">{userComplaints.length}</p>
            </div>
            <MessageSquare className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {userComplaints.filter(c => c.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-12 w-12 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Under Investigation</p>
              <p className="text-3xl font-bold text-blue-600">
                {userComplaints.filter(c => c.status === 'investigating').length}
              </p>
            </div>
            <Search className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-3xl font-bold text-green-600">
                {userComplaints.filter(c => c.status === 'resolved').length}
              </p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">My Reports & Complaints</h3>
        </div>
        
        {userComplaints.length > 0 ? (
          <div className="space-y-4 p-6">
            {userComplaints.map((complaint) => (
              <div key={complaint.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        complaint.type === 'noise' ? 'bg-red-100 text-red-800' :
                        complaint.type === 'garbage' ? 'bg-yellow-100 text-yellow-800' :
                        complaint.type === 'road' ? 'bg-blue-100 text-blue-800' :
                        complaint.type === 'water' ? 'bg-cyan-100 text-cyan-800' :
                        complaint.type === 'electricity' ? 'bg-orange-100 text-orange-800' :
                        complaint.type === 'security' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {complaint.type.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        complaint.priority === 'high' ? 'bg-red-100 text-red-800' :
                        complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {complaint.priority.toUpperCase()} PRIORITY
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {complaint.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{complaint.subject}</h4>
                    <p className="text-gray-600 mb-2">{complaint.description}</p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p><strong>Location:</strong> {complaint.location}</p>
                      <p><strong>Date Submitted:</strong> {complaint.dateSubmitted}</p>
                      {complaint.assignedTo && <p><strong>Assigned to:</strong> {complaint.assignedTo}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedComplaint(complaint)}
                    className="text-blue-600 hover:text-blue-800 ml-4"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Filed</h3>
            <p className="text-gray-600 mb-4">You haven't filed any incident reports or complaints yet.</p>
            <button
              onClick={() => setShowIncidentReport(true)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              File Your First Report
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <OfflineIndicator />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                <Building2 className="mr-3 h-8 w-8" />
                Resident Portal
              </h1>
              <p className="text-purple-100 mt-2 text-sm sm:text-base">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-purple-100 text-sm">Verification Status</p>
                <p className="text-xs text-purple-200 capitalize">{user?.verificationStatus?.replace('-', ' ')}</p>
              </div>
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-purple-200 hover:text-white hover:bg-purple-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'profile', label: 'My Profile', icon: User },
              { id: 'verification', label: 'Verification', icon: Shield },
              { id: 'location', label: 'House Location', icon: MapPin },
              { id: 'qr-code', label: 'QR Code', icon: QrCode },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'complaints', label: 'Reports & Complaints', icon: MessageSquare },
              { id: 'family', label: 'Family Tree', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'verification' && <VerificationStatus />}
        {activeTab === 'location' && <HouseholdMapPinning />}
        {activeTab === 'qr-code' && <QRCodeDisplay />}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Document Requests</h2>
            <OfflineDocumentForm />
          </div>
        )}
        
        {activeTab === 'incidents' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Report Incident</h2>
            <OfflineIncidentForm />
          </div>
        )}
        {activeTab === 'complaints' && renderComplaints()}
        {activeTab === 'family' && <FamilyTreeView />}
      </div>

      {/* Document Request Modal */}
      {showDocumentRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Request Document</h3>
              <button
                onClick={() => setShowDocumentRequest(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleDocumentRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select
                  value={documentRequest.documentType}
                  onChange={(e) => setDocumentRequest({...documentRequest, documentType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select document type</option>
                  <option value="Barangay Clearance">Barangay Clearance (₱50)</option>
                  <option value="Certificate of Residency">Certificate of Residency (₱30)</option>
                  <option value="Certificate of Indigency">Certificate of Indigency (₱25)</option>
                  <option value="Business Permit">Business Permit (₱200)</option>
                  <option value="Building Permit">Building Permit (₱500)</option>
                  <option value="Cedula">Cedula (₱35)</option>
                  <option value="Community Tax Certificate">Community Tax Certificate (₱35)</option>
                  <option value="Barangay ID">Barangay ID (₱100)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <input
                  type="text"
                  value={documentRequest.purpose}
                  onChange={(e) => setDocumentRequest({...documentRequest, purpose: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Employment requirement, School enrollment"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={documentRequest.quantity}
                    onChange={(e) => setDocumentRequest({...documentRequest, quantity: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                  <select
                    value={documentRequest.urgency}
                    onChange={(e) => setDocumentRequest({...documentRequest, urgency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="regular">Regular (3-5 days)</option>
                    <option value="rush">Rush (1-2 days) +₱20</option>
                    <option value="express">Express (Same day) +₱50</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  value={documentRequest.notes}
                  onChange={(e) => setDocumentRequest({...documentRequest, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special instructions or requirements"
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Fee Summary</h4>
                <div className="text-sm text-blue-700">
                  <p>Document Fee: ₱{documentRequest.documentType ? getDocumentFee(documentRequest.documentType) : 0}</p>
                  <p>Quantity: {documentRequest.quantity}</p>
                  <p>Urgency Fee: ₱{documentRequest.urgency === 'rush' ? 20 : documentRequest.urgency === 'express' ? 50 : 0}</p>
                  <hr className="my-2 border-blue-200" />
                  <p className="font-semibold">Total: ₱{
                    (documentRequest.documentType ? getDocumentFee(documentRequest.documentType) : 0) * documentRequest.quantity +
                    (documentRequest.urgency === 'rush' ? 20 : documentRequest.urgency === 'express' ? 50 : 0)
                  }</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDocumentRequest(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Incident Report Modal */}
      {showIncidentReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">File Incident Report</h3>
              <button
                onClick={() => setShowIncidentReport(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleIncidentReport} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Incident Type</label>
                  <select
                    value={incidentReport.type}
                    onChange={(e) => setIncidentReport({...incidentReport, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  >
                    <option value="">Select incident type</option>
                    <option value="noise">Noise Complaint</option>
                    <option value="garbage">Garbage/Sanitation</option>
                    <option value="road">Road/Infrastructure</option>
                    <option value="water">Water Issues</option>
                    <option value="electricity">Electrical Problems</option>
                    <option value="security">Security Concerns</option>
                    <option value="dispute">Neighbor Dispute</option>
                    <option value="vandalism">Vandalism</option>
                    <option value="theft">Theft/Robbery</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                  <select
                    value={incidentReport.priority}
                    onChange={(e) => setIncidentReport({...incidentReport, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="low">Low - Non-urgent</option>
                    <option value="medium">Medium - Moderate concern</option>
                    <option value="high">High - Urgent attention needed</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject/Title</label>
                <input
                  type="text"
                  value={incidentReport.subject}
                  onChange={(e) => setIncidentReport({...incidentReport, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Brief description of the incident"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                <textarea
                  value={incidentReport.description}
                  onChange={(e) => setIncidentReport({...incidentReport, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Provide detailed information about the incident"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={incidentReport.location}
                  onChange={(e) => setIncidentReport({...incidentReport, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Exact location where incident occurred"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Occurred</label>
                  <input
                    type="date"
                    value={incidentReport.dateOccurred}
                    onChange={(e) => setIncidentReport({...incidentReport, dateOccurred: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Occurred</label>
                  <input
                    type="time"
                    value={incidentReport.timeOccurred}
                    onChange={(e) => setIncidentReport({...incidentReport, timeOccurred: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Witness Name (Optional)</label>
                  <input
                    type="text"
                    value={incidentReport.witnessName}
                    onChange={(e) => setIncidentReport({...incidentReport, witnessName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Name of witness"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Witness Contact (Optional)</label>
                  <input
                    type="tel"
                    value={incidentReport.witnessContact}
                    onChange={(e) => setIncidentReport({...incidentReport, witnessContact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Contact number of witness"
                  />
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Important Notice</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• All incident reports are reviewed by barangay officials</li>
                  <li>• False reporting may result in legal consequences</li>
                  <li>• You will be contacted for follow-up if needed</li>
                  <li>• Emergency situations should be reported to authorities immediately</li>
                </ul>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowIncidentReport(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Details Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Document Details</h3>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Document Type</label>
                <p className="text-gray-900">{selectedDocument.documentType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Purpose</label>
                <p className="text-gray-900">{selectedDocument.purpose}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedDocument.status === 'released' ? 'bg-purple-100 text-purple-800' :
                  selectedDocument.status === 'ready' ? 'bg-green-100 text-green-800' :
                  selectedDocument.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  selectedDocument.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedDocument.status.toUpperCase()}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Fee</label>
                <p className="text-gray-900">₱{selectedDocument.fee}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date Requested</label>
                <p className="text-gray-900">{selectedDocument.requestedDate}</p>
              </div>
              {selectedDocument.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-gray-900">{selectedDocument.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Incident Report Details</h3>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <p className="text-gray-900 capitalize">{selectedComplaint.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedComplaint.priority === 'high' ? 'bg-red-100 text-red-800' :
                    selectedComplaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedComplaint.priority.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <p className="text-gray-900">{selectedComplaint.subject}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="text-gray-900">{selectedComplaint.description}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <p className="text-gray-900">{selectedComplaint.location}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Date Submitted</label>
                  <p className="text-gray-900">{selectedComplaint.dateSubmitted}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedComplaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    selectedComplaint.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedComplaint.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              {selectedComplaint.assignedTo && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Assigned To</label>
                  <p className="text-gray-900">{selectedComplaint.assignedTo}</p>
                </div>
              )}
              
              {selectedComplaint.resolution && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <label className="text-sm font-medium text-green-800">Resolution</label>
                  <p className="text-green-700 mt-1">{selectedComplaint.resolution}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}