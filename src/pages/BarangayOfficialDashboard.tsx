import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { dataService } from '../services/dataService';
import KYCVerificationCenter from '../components/KYCVerificationCenter';
import ResidentManagement from '../components/ResidentManagement';
import DataSyncMonitor from '../components/DataSyncMonitor';
import { 
  Building2, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Heart, 
  Calculator, 
  AlertTriangle, 
  LogOut, 
  ArrowLeft,
  Bell,
  Calendar,
  MapPin,
  Shield,
  Activity,
  Camera,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  UserPlus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  UserCheck,
  Home,
  Phone,
  Mail,
  Database
} from 'lucide-react';

export default function BarangayOfficialDashboard() {
  const { user, logout } = useAuth();
  const { residents, documents, complaints, users, updateComplaint } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Debug logging to check data
  React.useEffect(() => {
    console.log('Barangay Official Dashboard - Residents data:', residents);
    console.log('Barangay Official Dashboard - Users data:', users);
    console.log('Barangay Official Dashboard - Documents data:', documents);
  }, [residents, users, documents]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.reporter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.reporter_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || complaint.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleUpdateComplaintStatus = async (complaintId: string, newStatus: string, assignedTo?: string) => {
    try {
      await updateComplaint(complaintId, { 
        status: newStatus,
        assignedTo: assignedTo || user?.name,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to update complaint:', error);
      alert('Failed to update complaint status');
    }
  };

  const handleAssignComplaint = async (complaintId: string, assignedTo: string) => {
    try {
      await updateComplaint(complaintId, { 
        assignedTo,
        status: 'investigating',
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to assign complaint:', error);
      alert('Failed to assign complaint');
    }
  };

  const stats = [
    { 
      label: 'Total Residents', 
      value: residents.length.toString(), 
      icon: Users, 
      color: 'bg-blue-500',
      trend: '+12 this month'
    },
    { 
      label: 'Verified Residents', 
      value: residents.filter(r => r.verificationStatus === 'verified').length.toString(), 
      icon: Shield, 
      color: 'bg-green-500',
      trend: '+8 this month'
    },
    { 
      label: 'Pending Verification', 
      value: residents.filter(r => r.verificationStatus === 'semi-verified').length.toString(), 
      icon: Clock, 
      color: 'bg-yellow-500',
      trend: '5 awaiting approval'
    },
    { 
      label: 'Documents Processed', 
      value: documents.length.toString(), 
      icon: FileText, 
      color: 'bg-purple-500',
      trend: '+156 this month'
    }
  ];

  const renderComplaints = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Complaints & Blotter</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <AlertTriangle className="h-4 w-4" />
          <span>{complaints.length} Total Reports</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Complaints</p>
              <p className="text-3xl font-bold text-blue-600">{complaints.length}</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {complaints.filter(c => c.status === 'pending').length}
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
                {complaints.filter(c => c.status === 'investigating').length}
              </p>
            </div>
            <Search className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
                {complaints.filter(c => c.status === 'resolved').length}
              </p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-600" />
            <option value="dismissed">Dismissed</option>
          </div>
          <select 
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {filteredComplaints.length} complaints found
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complainant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{complaint.reporter_name}</div>
                      <div className="text-sm text-gray-500">{complaint.reporter_email}</div>
                      {complaint.reporter_phone && (
                        <div className="text-xs text-gray-400">{complaint.reporter_phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      complaint.incident_type === 'Noise Complaint' ? 'bg-red-100 text-red-800' :
                      complaint.incident_type === 'Theft' ? 'bg-red-100 text-red-800' :
                      complaint.incident_type === 'Vandalism' ? 'bg-yellow-100 text-yellow-800' :
                      complaint.incident_type === 'Dispute' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {complaint.incident_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{complaint.subject}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{complaint.description}</div>
                    {complaint.location && (
                      <div className="text-xs text-gray-400 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {complaint.location}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      complaint.priority === 'high' ? 'bg-red-100 text-red-800' :
                      complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {complaint.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      complaint.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                      complaint.status === 'dismissed' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {complaint.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {complaint.date_submitted}
                    {complaint.date_occurred && (
                      <div className="text-xs text-gray-500">
                        Occurred: {complaint.date_occurred}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {complaint.assigned_to ? (
                      <span className="text-blue-600 font-medium">{complaint.assigned_to}</span>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => setSelectedComplaint(complaint)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {complaint.status === 'pending' && (
                      <button 
                        onClick={() => handleUpdateComplaintStatus(complaint.id, 'investigating')}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Start Investigation"
                      >
                        <Search className="h-4 w-4" />
                      </button>
                    )}
                    {complaint.status === 'investigating' && (
                      <button 
                        onClick={() => handleUpdateComplaintStatus(complaint.id, 'resolved')}
                        className="text-green-600 hover:text-green-900"
                        title="Mark as Resolved"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    {complaint.status !== 'dismissed' && (
                      <button 
                        onClick={() => handleUpdateComplaintStatus(complaint.id, 'dismissed')}
                        className="text-red-600 hover:text-red-900"
                        title="Dismiss Complaint"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredComplaints.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {complaints.length === 0 ? 'No complaints reported yet' : 'No complaints match your search criteria'}
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Complaint Details</h3>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Reporter Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{selectedComplaint.reporter_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedComplaint.reporter_email}</p>
                    </div>
                    {selectedComplaint.reporter_phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-sm text-gray-900">{selectedComplaint.reporter_phone}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Incident Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      <p className="text-sm text-gray-900">{selectedComplaint.incident_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Priority</label>
                      <p className="text-sm text-gray-900 capitalize">{selectedComplaint.priority}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <p className="text-sm text-gray-900 capitalize">{selectedComplaint.status}</p>
                    </div>
                    {selectedComplaint.location && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <p className="text-sm text-gray-900">{selectedComplaint.location}</p>
                      </div>
                    )}
                    {selectedComplaint.date_occurred && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Date Occurred</label>
                        <p className="text-sm text-gray-900">
                          {selectedComplaint.date_occurred}
                          {selectedComplaint.time_occurred && ` at ${selectedComplaint.time_occurred}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Complaint Description</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">{selectedComplaint.subject}</h5>
                  <p className="text-gray-700">{selectedComplaint.description}</p>
                </div>
              </div>
              
              {selectedComplaint.witness_name && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Witness Information</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">
                      <strong>Name:</strong> {selectedComplaint.witness_name}
                    </p>
                    {selectedComplaint.witness_contact && (
                      <p className="text-sm text-gray-900">
                        <strong>Contact:</strong> {selectedComplaint.witness_contact}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {selectedComplaint.resolution && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Resolution</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedComplaint.resolution}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <p>Submitted: {selectedComplaint.date_submitted}</p>
                  <p>Last Updated: {new Date(selectedComplaint.updated_at).toLocaleString()}</p>
                  {selectedComplaint.assigned_to && (
                    <p>Assigned to: {selectedComplaint.assigned_to}</p>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  {selectedComplaint.status === 'pending' && (
                    <button
                      onClick={() => {
                        handleUpdateComplaintStatus(selectedComplaint.id, 'investigating');
                        setSelectedComplaint(null);
                      }}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      Start Investigation
                    </button>
                  )}
                  {selectedComplaint.status === 'investigating' && (
                    <button
                      onClick={() => {
                        const resolution = prompt('Enter resolution details:');
                        if (resolution) {
                          updateComplaint(selectedComplaint.id, { 
                            status: 'resolved',
                            resolution,
                            updatedAt: new Date().toISOString()
                          });
                          setSelectedComplaint(null);
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Mark as Resolved
                    </button>
                  )}
                  {selectedComplaint.status !== 'dismissed' && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to dismiss this complaint?')) {
                          handleUpdateComplaintStatus(selectedComplaint.id, 'dismissed');
                          setSelectedComplaint(null);
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.trend}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('kyc-verification')}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <UserCheck className="h-8 w-8 text-blue-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Verify Residents</h4>
              <p className="text-sm text-gray-600">Review KYC applications</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('residents')}
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Manage Residents</h4>
              <p className="text-sm text-gray-600">View resident profiles</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <FileText className="h-8 w-8 text-purple-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Process Documents</h4>
              <p className="text-sm text-gray-600">Handle document requests</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <Bell className="h-8 w-8 text-red-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Send Announcements</h4>
              <p className="text-sm text-gray-600">Notify residents</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Verification Requests */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Verification Requests</h3>
          <button 
            onClick={() => setActiveTab('kyc-verification')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {residents.filter(r => r.verificationStatus === 'semi-verified').slice(0, 5).map((resident) => (
            <div key={resident.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{resident.name}</p>
                  <p className="text-sm text-gray-600">Semi-verified • Awaiting approval</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setActiveTab('kyc-verification')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'residents':
        return <ResidentManagement />;
      case 'kyc-verification':
        return <KYCVerificationCenter />;
      case 'data-sync':
        return <DataSyncMonitor />;
      case 'complaints':
        return renderComplaints();
      case 'documents':
        return <div className="text-center py-12"><FileText className="h-24 w-24 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Document management coming soon</p></div>;
      case 'announcements':
        return <div className="text-center py-12"><Bell className="h-24 w-24 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Announcement system coming soon</p></div>;
      case 'analytics':
        return <div className="text-center py-12"><BarChart3 className="h-24 w-24 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Analytics dashboard coming soon</p></div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                  <Building2 className="mr-3 h-8 w-8" />
                  Barangay Official Dashboard
                </h1>
                <p className="text-green-100 mt-2 text-sm sm:text-base">Comprehensive Community Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-green-100 text-sm">Welcome, {user?.name}</p>
                <p className="text-xs text-green-200 capitalize">{user?.role?.replace('-', ' ')}</p>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-green-200 hover:text-white hover:bg-green-700 rounded-lg transition-colors"
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
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'residents', label: 'Residents', icon: Users },
              { id: 'kyc-verification', label: 'KYC Verification', icon: UserCheck },
              { id: 'data-sync', label: 'Data Sync', icon: Database },
              { id: 'complaints', label: 'Complaints & Blotter', icon: AlertTriangle },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'announcements', label: 'Announcements', icon: Bell },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
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
        {renderContent()}
        
        {/* Portal Links Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Specialized Portals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/medical-portal"
              className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Heart className="h-8 w-8 text-red-600 mr-3" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Medical Portal</h4>
                <p className="text-sm text-gray-600">Health center management</p>
              </div>
            </Link>
            
            <Link
              to="/accounting-portal"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Calculator className="h-8 w-8 text-blue-600 mr-3" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Accounting Portal</h4>
                <p className="text-sm text-gray-600">Financial management</p>
              </div>
            </Link>
            
            <Link
              to="/disaster-portal-dashboard"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">NDRRMC Portal</h4>
                <p className="text-sm text-gray-600">Emergency management</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}