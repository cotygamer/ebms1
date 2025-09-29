import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  AlertTriangle, 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Shield,
  RefreshCw,
  X,
  Save,
  UserCheck,
  MessageSquare
} from 'lucide-react';

export default function ComplaintManagement() {
  const { complaints, updateComplaint } = useData();
  const { user } = useAuth();
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [editingComplaint, setEditingComplaint] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh complaints every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      window.dispatchEvent(new CustomEvent('refreshAllData'));
      setTimeout(() => setIsRefreshing(false), 1000);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.incident_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.reporter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || complaint.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'investigating':
        return <Search className="h-5 w-5 text-blue-500" />;
      case 'dismissed':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'investigating':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateComplaint = async (id: string, updates: any) => {
    try {
      await updateComplaint(id, updates);
      setEditingComplaint(null);
    } catch (error) {
      console.error('Failed to update complaint:', error);
      alert('Failed to update complaint. Please try again.');
    }
  };

  const handleQuickStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateComplaint(id, { 
        status: newStatus,
        assigned_to: newStatus === 'investigating' ? user?.name : undefined
      });
    } catch (error) {
      console.error('Failed to update complaint status:', error);
      alert('Failed to update complaint status. Please try again.');
    }
  };

  const stats = [
    {
      title: 'Total Complaints',
      value: complaints.length,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Pending',
      value: complaints.filter(c => c.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Under Investigation',
      value: complaints.filter(c => c.status === 'investigating').length,
      icon: Search,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Resolved',
      value: complaints.filter(c => c.status === 'resolved').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Complaint Management</h2>
          <p className="text-gray-600 mt-1">Manage and resolve community complaints and incidents</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setIsRefreshing(true);
              window.dispatchEvent(new CustomEvent('refreshAllData'));
              setTimeout(() => setIsRefreshing(false), 1000);
            }}
            disabled={isRefreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search complaints by subject, type, or reporter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredComplaints.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Complaint & Reporter
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Submitted
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{complaint.subject}</div>
                        <div className="text-sm text-gray-600">{complaint.incident_type}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {complaint.reporter_name}
                          </div>
                          <div className="flex items-center mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            {complaint.reporter_email}
                          </div>
                          {complaint.location && (
                            <div className="flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {complaint.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(complaint.status)}`}>
                        {getStatusIcon(complaint.status)}
                        <span className="ml-2 capitalize">{complaint.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(complaint.date_submitted || complaint.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {complaint.assigned_to ? (
                        <div className="flex items-center">
                          <UserCheck className="h-4 w-4 mr-2 text-gray-400" />
                          {complaint.assigned_to}
                        </div>
                      ) : (
                        <span className="text-gray-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedComplaint(complaint)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingComplaint(complaint)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Edit Complaint"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        {/* Quick Status Update Buttons */}
                        {complaint.status === 'pending' && (
                          <button
                            onClick={() => handleQuickStatusUpdate(complaint.id, 'investigating')}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Start Investigation"
                          >
                            <Search className="h-4 w-4" />
                          </button>
                        )}
                        {complaint.status === 'investigating' && (
                          <button
                            onClick={() => handleQuickStatusUpdate(complaint.id, 'resolved')}
                            className="text-green-600 hover:text-green-900 p-1"
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
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {complaints.length === 0 ? 'No Complaints Found' : 'No Matching Complaints'}
            </h3>
            <p className="text-gray-600">
              {complaints.length === 0 
                ? 'No complaints have been submitted yet.'
                : 'No complaints match your search criteria.'
              }
            </p>
            {complaints.length === 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
                  <div className="text-left">
                    <h4 className="font-medium text-blue-800">Waiting for Reports</h4>
                    <p className="text-sm text-blue-700">
                      Incident reports from residents will appear here automatically.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Complaint Details</h3>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Complaint Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      <p className="text-sm text-gray-900">{selectedComplaint.incident_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Subject</label>
                      <p className="text-sm text-gray-900">{selectedComplaint.subject}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Priority</label>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedComplaint.priority)}`}>
                        {selectedComplaint.priority?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedComplaint.status)}`}>
                        {getStatusIcon(selectedComplaint.status)}
                        <span className="ml-2 capitalize">{selectedComplaint.status}</span>
                      </div>
                    </div>
                    {selectedComplaint.location && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <p className="text-sm text-gray-900">{selectedComplaint.location}</p>
                      </div>
                    )}
                  </div>
                </div>
                
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
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date Submitted</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedComplaint.date_submitted || selectedComplaint.created_at).toLocaleDateString()}
                      </p>
                    </div>
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
                <h4 className="font-semibold text-gray-900 mb-4">Description</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{selectedComplaint.description}</p>
                </div>
              </div>

              {selectedComplaint.witness_name && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Witness Information</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <p className="text-sm text-gray-900">{selectedComplaint.witness_name}</p>
                      </div>
                      {selectedComplaint.witness_contact && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Contact</label>
                          <p className="text-sm text-gray-900">{selectedComplaint.witness_contact}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedComplaint.resolution && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Resolution</h4>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-800 leading-relaxed">{selectedComplaint.resolution}</p>
                  </div>
                </div>
              )}

              {selectedComplaint.assigned_to && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Assignment</h4>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <UserCheck className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="text-purple-800">Assigned to: {selectedComplaint.assigned_to}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setEditingComplaint(selectedComplaint)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Complaint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Complaint Modal */}
      {editingComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Edit Complaint</h3>
                <button
                  onClick={() => setEditingComplaint(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editingComplaint.status}
                    onChange={(e) => setEditingComplaint({ ...editingComplaint, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={editingComplaint.priority}
                    onChange={(e) => setEditingComplaint({ ...editingComplaint, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                  <input
                    type="text"
                    value={editingComplaint.assigned_to || ''}
                    onChange={(e) => setEditingComplaint({ ...editingComplaint, assigned_to: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Assign to staff member or officer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
                <textarea
                  value={editingComplaint.resolution || ''}
                  onChange={(e) => setEditingComplaint({ ...editingComplaint, resolution: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the resolution or actions taken..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setEditingComplaint(null)}
                  className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateComplaint(editingComplaint.id, editingComplaint)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}