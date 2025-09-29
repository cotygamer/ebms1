import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  Search,
  Filter,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  Download,
  CreditCard,
  Truck,
  AlertTriangle,
  RefreshCw,
  X,
  Save,
  Plus
} from 'lucide-react';

export default function DocumentProcessing() {
  const { documents, updateDocument } = useData();
  const { user } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh documents every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      // Trigger a refresh of the documents data
      window.dispatchEvent(new CustomEvent('refreshAllData'));
      setTimeout(() => setIsRefreshing(false), 1000);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.document_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.residents?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesType = filterType === 'all' || doc.document_type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'released':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'ready':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'released':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ready':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateDocument = async (id: string, updates: any) => {
    try {
      await updateDocument(id, {
        ...updates,
        processed_date: updates.status === 'processing' ? new Date().toISOString().split('T')[0] : updates.processed_date,
        released_date: updates.status === 'released' ? new Date().toISOString().split('T')[0] : updates.released_date
      });
      setEditingDocument(null);
    } catch (error) {
      console.error('Failed to update document:', error);
      alert('Failed to update document. Please try again.');
    }
  };

  const handleQuickStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateDocument(id, { 
        status: newStatus,
        processed_date: newStatus === 'processing' ? new Date().toISOString().split('T')[0] : undefined,
        released_date: newStatus === 'released' ? new Date().toISOString().split('T')[0] : undefined
      });
    } catch (error) {
      console.error('Failed to update document status:', error);
      alert('Failed to update document status. Please try again.');
    }
  };

  const documentTypes = [
    'Barangay Clearance',
    'Certificate of Indigency',
    'Certificate of Residency',
    'Business Permit',
    'Building Permit'
  ];

  const stats = [
    {
      title: 'Total Documents',
      value: documents.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending',
      value: documents.filter(doc => doc.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Processing',
      value: documents.filter(doc => doc.status === 'processing').length,
      icon: RefreshCw,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Ready for Pickup',
      value: documents.filter(doc => doc.status === 'ready').length,
      icon: Truck,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Document Processing</h2>
          <p className="text-gray-600 mt-1">Manage and process resident document requests</p>
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
              placeholder="Search documents by type, purpose, or resident name..."
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
            <option value="processing">Processing</option>
            <option value="ready">Ready for Pickup</option>
            <option value="released">Released</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {documentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredDocuments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document & Resident
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{document.document_type}</div>
                        <div className="text-sm text-gray-600">{document.purpose || 'No purpose specified'}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {document.residents?.name || 'Unknown Resident'}
                          </div>
                          {document.residents?.email && (
                            <div className="flex items-center mt-1">
                              <Mail className="h-3 w-3 mr-1" />
                              {document.residents.email}
                            </div>
                          )}
                        </div>
                        {document.tracking_number && (
                          <div className="text-xs text-gray-400 font-mono mt-1">
                            Tracking: {document.tracking_number}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(document.status)}`}>
                        {getStatusIcon(document.status)}
                        <span className="ml-2 capitalize">{document.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          ₱{document.fee?.toFixed(2) || '0.00'}
                        </div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(document.payment_status)}`}>
                          <CreditCard className="h-3 w-3 mr-1" />
                          {document.payment_status}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                          <span>Requested: {new Date(document.requested_date || document.created_at).toLocaleDateString()}</span>
                        </div>
                        {document.processed_date && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                            <span>Processed: {new Date(document.processed_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {document.released_date && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                            <span>Released: {new Date(document.released_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedDocument(document)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingDocument(document)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Edit Document"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        {/* Quick Status Update Buttons */}
                        {document.status === 'pending' && (
                          <button
                            onClick={() => handleQuickStatusUpdate(document.id, 'processing')}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Start Processing"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                        {document.status === 'processing' && (
                          <button
                            onClick={() => handleQuickStatusUpdate(document.id, 'ready')}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Mark as Ready"
                          >
                            <Truck className="h-4 w-4" />
                          </button>
                        )}
                        {document.status === 'ready' && (
                          <button
                            onClick={() => handleQuickStatusUpdate(document.id, 'released')}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Mark as Released"
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
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {documents.length === 0 ? 'No Documents Found' : 'No Matching Documents'}
            </h3>
            <p className="text-gray-600">
              {documents.length === 0 
                ? 'No document requests have been submitted yet.'
                : 'No documents match your search criteria.'
              }
            </p>
            {documents.length === 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
                  <div className="text-left">
                    <h4 className="font-medium text-blue-800">Waiting for Requests</h4>
                    <p className="text-sm text-blue-700">
                      Document requests from residents will appear here automatically.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Document Details Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Document Details</h3>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Document Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      <p className="text-sm text-gray-900">{selectedDocument.document_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Purpose</label>
                      <p className="text-sm text-gray-900">{selectedDocument.purpose || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedDocument.status)}`}>
                        {getStatusIcon(selectedDocument.status)}
                        <span className="ml-2 capitalize">{selectedDocument.status}</span>
                      </div>
                    </div>
                    {selectedDocument.tracking_number && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Tracking Number</label>
                        <p className="text-sm text-gray-900 font-mono">{selectedDocument.tracking_number}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Resident Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{selectedDocument.residents?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedDocument.residents?.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedDocument.residents?.phone_number || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Payment Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Fee</label>
                      <p className="text-sm text-gray-900 font-semibold">₱{selectedDocument.fee?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Payment Status</label>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedDocument.payment_status)}`}>
                        <CreditCard className="h-3 w-3 mr-1" />
                        {selectedDocument.payment_status}
                      </div>
                    </div>
                    {selectedDocument.payment_method && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Payment Method</label>
                        <p className="text-sm text-gray-900">{selectedDocument.payment_method}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Timeline</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Requested Date</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedDocument.requested_date || selectedDocument.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedDocument.processed_date && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Processed Date</label>
                        <p className="text-sm text-gray-900">
                          {new Date(selectedDocument.processed_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {selectedDocument.released_date && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Released Date</label>
                        <p className="text-sm text-gray-900">
                          {new Date(selectedDocument.released_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedDocument.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedDocument.notes}</p>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setEditingDocument(selectedDocument)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Document Modal */}
      {editingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Edit Document</h3>
                <button
                  onClick={() => setEditingDocument(null)}
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
                    value={editingDocument.status}
                    onChange={(e) => setEditingDocument({ ...editingDocument, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="ready">Ready for Pickup</option>
                    <option value="released">Released</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fee (₱)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingDocument.fee || 0}
                    onChange={(e) => setEditingDocument({ ...editingDocument, fee: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <select
                    value={editingDocument.payment_status}
                    onChange={(e) => setEditingDocument({ ...editingDocument, payment_status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={editingDocument.payment_method || ''}
                    onChange={(e) => setEditingDocument({ ...editingDocument, payment_method: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select payment method</option>
                    <option value="cash">Cash</option>
                    <option value="gcash">GCash</option>
                    <option value="maya">Maya</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="online">Online Payment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={editingDocument.notes || ''}
                  onChange={(e) => setEditingDocument({ ...editingDocument, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any notes or comments about this document..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setEditingDocument(null)}
                  className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateDocument(editingDocument.id, editingDocument)}
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