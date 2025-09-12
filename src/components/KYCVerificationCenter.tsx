import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { UserCheck, Users, Clock, CheckCircle, XCircle, Eye, MapPin, FileText, Phone, Mail, Home, Calendar, Shield, AlertTriangle, Download, Search, Filter, User, Car as IdCard, Camera, X, Check, History, ChevronDown, ChevronUp } from 'lucide-react';

interface Resident {
  id: string;
  name: string;
  email: string;
  verificationStatus: 'non-verified' | 'details-updated' | 'semi-verified' | 'verified';
  qrCode?: string;
  phone?: string;
  address?: string;
  dateRegistered: string;
  houseLocation?: { lat: number; lng: number; address: string };
  governmentIds?: {
    sss?: { number: string; verified: boolean; uploadDate?: string };
    philhealth?: { number: string; verified: boolean; uploadDate?: string };
    pagibig?: { number: string; verified: boolean; uploadDate?: string };
    umid?: { number: string; verified: boolean; uploadDate?: string };
    driversLicense?: { number: string; verified: boolean; uploadDate?: string };
    passport?: { number: string; verified: boolean; uploadDate?: string };
  };
  auditTrail?: {
    timestamp: string;
    action: string;
    previousStatus?: string;
    newStatus?: string;
    approvedBy?: string;
  }[];
}

export default function KYCVerificationCenter() {
  const { residents, verifyResident } = useData();
  const { user } = useAuth();
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAuditTrail, setShowAuditTrail] = useState<string | null>(null);

  const filteredResidents = residents.filter((resident: Resident) => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || resident.verificationStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'semi-verified':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'details-updated':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'non-verified':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4" />;
      case 'semi-verified':
        return <Clock className="h-4 w-4" />;
      case 'details-updated':
        return <User className="h-4 w-4" />;
      case 'non-verified':
        return <XCircle className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const handleVerifyResident = (residentId: string, newStatus: 'semi-verified' | 'verified') => {
    const resident = residents.find((r: Resident) => r.id === residentId);
    if (resident) {
      // Add audit trail entry
      const auditEntry = {
        timestamp: new Date().toISOString(),
        action: newStatus === 'verified' ? 'Physical Verification Completed' : 'Semi-verification Approved',
        previousStatus: resident.verificationStatus,
        newStatus: newStatus,
        approvedBy: `${user?.name} (${user?.role})`
      };

      verifyResident(residentId, newStatus);
      
      // In a real app, this would update the audit trail in the database
      console.log('Audit Trail Entry:', auditEntry);
    }
  };

  const stats = [
    {
      label: 'Total Residents',
      value: residents.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Pending Verification',
      value: residents.filter((r: Resident) => r.verificationStatus === 'semi-verified').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Fully Verified',
      value: residents.filter((r: Resident) => r.verificationStatus === 'verified').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Needs Review',
      value: residents.filter((r: Resident) => r.verificationStatus === 'details-updated').length,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">KYC Verification Center</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Shield className="h-4 w-4" />
          <span>Centralized Verification Management</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`h-12 w-12 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search residents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="non-verified">Non-verified</option>
            <option value="details-updated">Details Updated</option>
            <option value="semi-verified">Semi-verified</option>
            <option value="verified">Verified</option>
          </select>
          
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {filteredResidents.length} residents found
          </div>
        </div>
      </div>

      {/* Residents List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resident
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResidents.map((resident: Resident) => (
                <React.Fragment key={resident.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-700">
                              {resident.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{resident.name}</div>
                          <div className="text-sm text-gray-500">{resident.email}</div>
                          <div className="text-xs text-gray-400">Registered: {resident.dateRegistered}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(resident.verificationStatus)}`}>
                        {getStatusIcon(resident.verificationStatus)}
                        <span className="ml-1 capitalize">{resident.verificationStatus.replace('-', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {resident.houseLocation ? (
                        <div className="flex items-center text-sm text-green-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Pinned</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-red-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Not pinned</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {resident.governmentIds && Object.keys(resident.governmentIds).length > 0 ? (
                          <div className="flex items-center text-sm text-green-600">
                            <IdCard className="h-4 w-4 mr-1" />
                            <span>{Object.keys(resident.governmentIds).length} IDs</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-sm text-red-600">
                            <IdCard className="h-4 w-4 mr-1" />
                            <span>No IDs</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedResident(resident)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {resident.verificationStatus === 'semi-verified' && (
                        <button
                          onClick={() => handleVerifyResident(resident.id, 'verified')}
                          className="text-green-600 hover:text-green-900"
                          title="Approve Verification"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => setShowAuditTrail(showAuditTrail === resident.id ? null : resident.id)}
                        className="text-purple-600 hover:text-purple-900"
                        title="View Audit Trail"
                      >
                        <History className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  
                  {/* Audit Trail Row */}
                  {showAuditTrail === resident.id && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 flex items-center">
                            <History className="h-4 w-4 mr-2" />
                            Verification History
                          </h4>
                          {resident.auditTrail && resident.auditTrail.length > 0 ? (
                            <div className="space-y-2">
                              {resident.auditTrail.map((entry, index) => (
                                <div key={index} className="bg-white p-3 rounded border text-sm">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-900">{entry.action}</span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  {entry.previousStatus && entry.newStatus && (
                                    <p className="text-gray-600">
                                      Status changed from <span className="font-medium capitalize">{entry.previousStatus.replace('-', ' ')}</span> to{' '}
                                      <span className="font-medium capitalize">{entry.newStatus.replace('-', ' ')}</span>
                                    </p>
                                  )}
                                  <p className="text-xs text-gray-500">By: {entry.approvedBy}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No verification history available</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resident Details Modal */}
      {selectedResident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Resident Verification Details</h3>
                <button
                  onClick={() => setSelectedResident(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Personal Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{selectedResident.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedResident.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedResident.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Address</label>
                      <p className="text-sm text-gray-900">{selectedResident.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Verification Status</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Current Status</label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(selectedResident.verificationStatus)}`}>
                          {getStatusIcon(selectedResident.verificationStatus)}
                          <span className="ml-2 capitalize">{selectedResident.verificationStatus.replace('-', ' ')}</span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date Registered</label>
                      <p className="text-sm text-gray-900">{selectedResident.dateRegistered}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">QR Code</label>
                      <p className="text-sm text-gray-900">
                        {selectedResident.qrCode ? (
                          <span className="text-green-600">Generated</span>
                        ) : (
                          <span className="text-red-600">Not available</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* House Location */}
              {selectedResident.houseLocation && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    House Location
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900 mb-2">
                      <strong>Address:</strong> {selectedResident.houseLocation.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Coordinates:</strong> {selectedResident.houseLocation.lat.toFixed(6)}, {selectedResident.houseLocation.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              )}

              {/* Government IDs */}
              {selectedResident.governmentIds && Object.keys(selectedResident.governmentIds).length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <IdCard className="h-5 w-5 mr-2" />
                    Government IDs
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedResident.governmentIds).map(([idType, idData]) => (
                      <div key={idType} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900 capitalize">
                            {idType === 'driversLicense' ? "Driver's License" : idType.toUpperCase()}
                          </h5>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            idData.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {idData.verified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Number:</strong> {idData.number}
                        </p>
                        {idData.uploadDate && (
                          <p className="text-xs text-gray-500">
                            Uploaded: {idData.uploadDate}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedResident.verificationStatus === 'semi-verified' && (
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleVerifyResident(selectedResident.id, 'verified');
                      setSelectedResident(null);
                    }}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Full Verification
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}