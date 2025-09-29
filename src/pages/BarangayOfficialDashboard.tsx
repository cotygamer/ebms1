import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { dataService } from '../services/dataService';
import KYCVerificationCenter from '../components/KYCVerificationCenter';
import ResidentManagement from '../components/ResidentManagement';
import DataSyncMonitor from '../components/DataSyncMonitor';
import MessagingCenter from '../components/MessagingCenter';
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
  Database,
  X,
  MessageSquare,
  Star,
  Zap,
  Target,
  Sparkles,
  ChevronRight,
  Menu,
  Sun,
  Moon
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      if (assignedTo) {
        updateData.assigned_to = assignedTo;
      } else if (newStatus === 'investigating' && !assignedTo) {
        updateData.assigned_to = user?.name;
      }
      
      await updateComplaint(complaintId, updateData);
    } catch (error) {
      console.error('Failed to update complaint:', error);
      alert('Failed to update complaint status');
    }
  };

  const stats = [
    { 
      label: 'Total Residents', 
      value: residents.length.toString(), 
      icon: Users, 
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12 this month',
      trendColor: 'text-green-600'
    },
    { 
      label: 'Verified Residents', 
      value: residents.filter(r => r.verificationStatus === 'verified').length.toString(), 
      icon: Shield, 
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+8 this month',
      trendColor: 'text-green-600'
    },
    { 
      label: 'Pending Verification', 
      value: residents.filter(r => r.verificationStatus === 'semi-verified').length.toString(), 
      icon: Clock, 
      color: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      trend: '5 awaiting approval',
      trendColor: 'text-yellow-600'
    },
    { 
      label: 'Documents Processed', 
      value: documents.length.toString(), 
      icon: FileText, 
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+156 this month',
      trendColor: 'text-green-600'
    }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Overview and insights' },
    { id: 'residents', label: 'Residents', icon: Users, description: 'Manage resident profiles' },
    { id: 'kyc-verification', label: 'KYC Verification', icon: UserCheck, description: 'Verify resident identities' },
    { id: 'location-verification', label: 'Location Verification', icon: MapPin, description: 'Verify house locations' },
    { id: 'complaints', label: 'Complaints & Blotter', icon: AlertTriangle, description: 'Handle incident reports' },
    { id: 'documents', label: 'Documents', icon: FileText, description: 'Process document requests' },
    { id: 'messaging', label: 'Messages', icon: MessageSquare, description: 'Community messages' },
    { id: 'data-sync', label: 'Data Sync', icon: Database, description: 'Monitor system sync' },
    { id: 'announcements', label: 'Announcements', icon: Bell, description: 'Community updates' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Performance metrics' }
  ];

  const renderComplaints = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Complaints & Blotter</h2>
          <p className="text-gray-600 mt-2">Manage community incident reports and complaints</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm font-medium text-gray-600">{complaints.length} Total Reports</span>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Complaints</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{complaints.length}</p>
              <p className="text-sm text-blue-600 mt-1">All time</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <AlertTriangle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {complaints.filter(c => c.status === 'pending').length}
              </p>
              <p className="text-sm text-yellow-600 mt-1">Needs attention</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Under Investigation</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {complaints.filter(c => c.status === 'investigating').length}
              </p>
              <p className="text-sm text-blue-600 mt-1">In progress</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {complaints.filter(c => c.status === 'resolved').length}
              </p>
              <p className="text-sm text-green-600 mt-1">Completed</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Modern Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search complaints by name, subject, or email..."
              className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-gray-50 focus:bg-white transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-gray-50 focus:bg-white transition-all"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-3">
          <Filter className="h-4 w-4 mr-2" />
          {filteredComplaints.length} complaints found
        </div>
      </div>

      {/* Modern Complaints Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Complainant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Incident</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {complaint.reporter_name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{complaint.reporter_name}</div>
                        <div className="text-sm text-gray-500">{complaint.reporter_email}</div>
                        {complaint.reporter_phone && (
                          <div className="text-xs text-gray-400">{complaint.reporter_phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 mb-1">{complaint.subject}</div>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        complaint.incident_type === 'Noise Complaint' ? 'bg-red-100 text-red-700' :
                        complaint.incident_type === 'Theft' ? 'bg-red-100 text-red-700' :
                        complaint.incident_type === 'Vandalism' ? 'bg-yellow-100 text-yellow-700' :
                        complaint.incident_type === 'Dispute' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {complaint.incident_type}
                      </span>
                      {complaint.location && (
                        <div className="text-xs text-gray-500 flex items-center mt-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {complaint.location}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                      complaint.priority === 'high' ? 'bg-red-100 text-red-800' :
                      complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {complaint.priority?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                      complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      complaint.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                      complaint.status === 'dismissed' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {complaint.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{complaint.date_submitted}</div>
                    {complaint.date_occurred && (
                      <div className="text-xs text-gray-500">
                        Occurred: {complaint.date_occurred}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {complaint.assigned_to ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{complaint.assigned_to}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedComplaint(complaint)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {complaint.status === 'pending' && (
                        <button 
                          onClick={() => handleUpdateComplaintStatus(complaint.id, 'investigating')}
                          className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-all"
                          title="Start Investigation"
                        >
                          <Search className="h-4 w-4" />
                        </button>
                      )}
                      {complaint.status === 'investigating' && (
                        <button 
                          onClick={() => handleUpdateComplaintStatus(complaint.id, 'resolved')}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all"
                          title="Mark as Resolved"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredComplaints.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Complaints Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {complaints.length === 0 ? 'No complaints have been reported yet.' : 'No complaints match your search criteria.'}
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-800 text-sm mt-3 font-medium"
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
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Complaint Details</h3>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Reporter Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-blue-700">Name</label>
                      <p className="text-sm text-blue-900 font-medium">{selectedComplaint.reporter_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-blue-700">Email</label>
                      <p className="text-sm text-blue-900">{selectedComplaint.reporter_email}</p>
                    </div>
                    {selectedComplaint.reporter_phone && (
                      <div>
                        <label className="text-sm font-medium text-blue-700">Phone</label>
                        <p className="text-sm text-blue-900">{selectedComplaint.reporter_phone}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Incident Details
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      <p className="text-sm text-gray-900 font-medium">{selectedComplaint.incident_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Priority</label>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        selectedComplaint.priority === 'high' ? 'bg-red-100 text-red-800' :
                        selectedComplaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedComplaint.priority?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        selectedComplaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        selectedComplaint.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                        selectedComplaint.status === 'dismissed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedComplaint.status?.toUpperCase()}
                      </span>
                    </div>
                    {selectedComplaint.location && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <p className="text-sm text-gray-900">{selectedComplaint.location}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Complaint Description
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">{selectedComplaint.subject}</h5>
                  <p className="text-gray-700 leading-relaxed">{selectedComplaint.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Submitted:</span> {selectedComplaint.date_submitted}</p>
                  <p><span className="font-medium">Last Updated:</span> {new Date(selectedComplaint.updated_at).toLocaleString()}</p>
                  {selectedComplaint.assigned_to && (
                    <p><span className="font-medium">Assigned to:</span> {selectedComplaint.assigned_to}</p>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  {selectedComplaint.status === 'pending' && (
                    <button
                      onClick={() => {
                        handleUpdateComplaintStatus(selectedComplaint.id, 'investigating');
                        setSelectedComplaint(null);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
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
                            updated_at: new Date().toISOString()
                          });
                          setSelectedComplaint(null);
                        }
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Mark as Resolved
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
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3 flex items-center">
                <Sparkles className="mr-4 h-10 w-10" />
                Welcome, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-xl text-white text-opacity-90 mb-4">
                Manage your community with modern, efficient tools
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-white text-opacity-80">
                  <Shield className="h-5 w-5 mr-2" />
                  <span>Barangay Official</span>
                </div>
                <div className="flex items-center text-white text-opacity-80">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <Building2 className="h-16 w-16 text-white opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-8 w-8 ${stat.textColor}`} />
              </div>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className={`text-xs font-medium ${stat.trendColor}`}>
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Zap className="h-6 w-6 mr-3 text-yellow-500" />
              Quick Actions
            </h2>
            <p className="text-gray-600 mt-1">Most frequently used tools and features</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => setActiveTab('kyc-verification')}
            className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 text-left border border-blue-200 hover:border-blue-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500 rounded-xl group-hover:scale-110 transition-transform">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">Verify Residents</h3>
            <p className="text-blue-700 text-sm">Review and approve KYC applications</p>
            <div className="mt-3 text-xs text-blue-600 font-medium">
              {residents.filter(r => r.verificationStatus === 'semi-verified').length} pending
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('residents')}
            className="group p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300 text-left border border-green-200 hover:border-green-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-green-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-green-900 mb-2">Manage Residents</h3>
            <p className="text-green-700 text-sm">View and edit resident profiles</p>
            <div className="mt-3 text-xs text-green-600 font-medium">
              {residents.length} total residents
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('location-verification')}
            className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 text-left border border-purple-200 hover:border-purple-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500 rounded-xl group-hover:scale-110 transition-transform">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-purple-900 mb-2">Verify Locations</h3>
            <p className="text-purple-700 text-sm">Review house location mappings</p>
            <div className="mt-3 text-xs text-purple-600 font-medium">
              {residents.filter(r => r.house_location).length} locations pinned
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('complaints')}
            className="group p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl hover:from-red-100 hover:to-red-200 transition-all duration-300 text-left border border-red-200 hover:border-red-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500 rounded-xl group-hover:scale-110 transition-transform">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-red-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-red-900 mb-2">Handle Complaints</h3>
            <p className="text-red-700 text-sm">Process incident reports and blotter</p>
            <div className="mt-3 text-xs text-red-600 font-medium">
              {complaints.filter(c => c.status === 'pending').length} pending review
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('messaging')}
            className="group p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl hover:from-indigo-100 hover:to-indigo-200 transition-all duration-300 text-left border border-indigo-200 hover:border-indigo-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-500 rounded-xl group-hover:scale-110 transition-transform">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-indigo-900 mb-2">Messages</h3>
            <p className="text-indigo-700 text-sm">Community messages and inquiries</p>
            <div className="mt-3 text-xs text-indigo-600 font-medium">
              New feature
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('data-sync')}
            className="group p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl hover:from-teal-100 hover:to-teal-200 transition-all duration-300 text-left border border-teal-200 hover:border-teal-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-teal-500 rounded-xl group-hover:scale-110 transition-transform">
                <Database className="h-8 w-8 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-teal-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-teal-900 mb-2">System Monitor</h3>
            <p className="text-teal-700 text-sm">Monitor data synchronization</p>
            <div className="mt-3 text-xs text-teal-600 font-medium">
              All systems operational
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Activity className="h-6 w-6 mr-3 text-blue-500" />
              Recent Verification Requests
            </h3>
            <button 
              onClick={() => setActiveTab('kyc-verification')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {residents.filter(r => r.verificationStatus === 'semi-verified').slice(0, 4).map((resident) => (
              <div key={resident.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200 hover:bg-yellow-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{resident.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{resident.name}</p>
                    <p className="text-sm text-yellow-700">Semi-verified • Awaiting approval</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('kyc-verification')}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                >
                  Review
                </button>
              </div>
            ))}
            {residents.filter(r => r.verificationStatus === 'semi-verified').length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">No pending verification requests</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Bell className="h-6 w-6 mr-3 text-green-500" />
              Recent Complaints
            </h3>
            <button 
              onClick={() => setActiveTab('complaints')}
              className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {complaints.slice(0, 4).map((complaint) => (
              <div key={complaint.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    complaint.priority === 'high' ? 'bg-red-100' :
                    complaint.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    <AlertTriangle className={`h-5 w-5 ${
                      complaint.priority === 'high' ? 'text-red-600' :
                      complaint.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{complaint.subject}</p>
                    <p className="text-sm text-gray-600">{complaint.reporter_name}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  complaint.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {complaint.status}
                </span>
              </div>
            ))}
            {complaints.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">No recent complaints</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Portal Links */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <Target className="h-6 w-6 mr-3 text-purple-500" />
              Specialized Portals
            </h3>
            <p className="text-gray-600 mt-1">Access specialized management systems</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/medical-portal"
            className="group p-6 bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl hover:from-red-100 hover:to-pink-200 transition-all duration-300 border border-red-200 hover:border-red-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500 rounded-xl group-hover:scale-110 transition-transform">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-red-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="text-lg font-bold text-red-900 mb-2">Medical Portal</h4>
            <p className="text-red-700 text-sm">Health center management and patient records</p>
          </Link>
          
          <Link
            to="/accounting-portal"
            className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl hover:from-blue-100 hover:to-indigo-200 transition-all duration-300 border border-blue-200 hover:border-blue-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500 rounded-xl group-hover:scale-110 transition-transform">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="text-lg font-bold text-blue-900 mb-2">Accounting Portal</h4>
            <p className="text-blue-700 text-sm">Financial management and revenue tracking</p>
          </Link>
          
          <Link
            to="/disaster-portal-dashboard"
            className="group p-6 bg-gradient-to-br from-orange-50 to-yellow-100 rounded-2xl hover:from-orange-100 hover:to-yellow-200 transition-all duration-300 border border-orange-200 hover:border-orange-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500 rounded-xl group-hover:scale-110 transition-transform">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="text-lg font-bold text-orange-900 mb-2">NDRRMC Portal</h4>
            <p className="text-orange-700 text-sm">Emergency and disaster management</p>
          </Link>
          
          <Link
            to="/peace-order-portal"
            className="group p-6 bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl hover:from-gray-100 hover:to-slate-200 transition-all duration-300 border border-gray-200 hover:border-gray-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-600 rounded-xl group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Peace & Order</h4>
            <p className="text-gray-700 text-sm">Incident and crime management</p>
          </Link>
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
      case 'location-verification':
        return (
          <LocationVerificationMap
            locations={[]}
            onVerifyLocation={(locationId, status, notes) => {
              console.log('Verify location:', locationId, status, notes);
            }}
            onViewDetails={(location) => {
              console.log('View location details:', location);
            }}
          />
        );
      case 'data-sync':
        return <DataSyncMonitor />;
      case 'complaints':
        return renderComplaints();
      case 'messaging':
        return <MessagingCenter />;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      {/* Modern Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between p-4 lg:p-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Barangay Official Portal</h1>
                  <p className="text-sm text-gray-600">Community Management System</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-600 capitalize">{user?.role?.replace('-', ' ')}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Navigation */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <nav className="flex space-x-1 p-2 overflow-x-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Location Verification Map Component (placeholder)
function LocationVerificationMap({ locations, onVerifyLocation, onViewDetails }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Location Verification</h3>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">Location Verification Map</h4>
        <p className="text-gray-600">Interactive map for verifying resident house locations</p>
      </div>
    </div>
  );
}