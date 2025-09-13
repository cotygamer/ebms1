import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Eye, UserCheck, UserX, QrCode, Users, Search, MapPin, Car as IdCard, Phone, Mail, Calendar, Shield, History, Edit, Key, X, Save } from 'lucide-react';

export default function ResidentManagement() {
  const { residents, verifyResident } = useData();
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [editingResident, setEditingResident] = useState<any>(null);
  const [showPasswordReset, setShowPasswordReset] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Debug logging to check residents data
  React.useEffect(() => {
    console.log('ResidentManagement - Residents data:', residents);
    console.log('ResidentManagement - Residents count:', residents.length);
  }, [residents]);

  const filteredResidents = residents.filter(resident =>
    resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'semi-verified':
        return 'bg-yellow-100 text-yellow-800';
      case 'details-updated':
        return 'bg-blue-100 text-blue-800';
      case 'non-verified':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVerifyResident = (id: string, status: 'semi-verified' | 'verified') => {
    verifyResident(id, status);
  };

  const handleEditResident = (resident: any) => {
    setEditingResident({ ...resident });
  };

  const handleUpdateResident = async () => {
    if (editingResident) {
      try {
        // In a real app, this would call the update API
        console.log('Updating resident:', editingResident);
        setEditingResident(null);
      } catch (error) {
        console.error('Failed to update resident:', error);
      }
    }
  };

  const handlePasswordReset = async (residentId: string) => {
    try {
      // In a real app, this would call the password reset API
      console.log('Resetting password for resident:', residentId);
      alert('Password reset email sent to resident');
      setShowPasswordReset(null);
    } catch (error) {
      console.error('Failed to reset password:', error);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Resident Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search residents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Residents</p>
              <p className="text-3xl font-bold text-blue-600">{residents.length}</p>
              <p className="text-xs text-gray-500">Data loaded: {residents.length > 0 ? 'Yes' : 'No'}</p>
            </div>
            <Users className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fully Verified</p>
              <p className="text-3xl font-bold text-green-600">
                {residents.filter(r => r.verificationStatus === 'verified').length}
              </p>
            </div>
            <Shield className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Semi-verified</p>
              <p className="text-3xl font-bold text-yellow-600">
                {residents.filter(r => r.verificationStatus === 'semi-verified').length}
              </p>
            </div>
            <UserCheck className="h-12 w-12 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">With QR Codes</p>
              <p className="text-3xl font-bold text-purple-600">
                {residents.filter(r => r.qrCode).length}
              </p>
            </div>
            <QrCode className="h-12 w-12 text-purple-600" />
          </div>
        </div>
      </div>
      
      {/* Debug Information */}
      {residents.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <h4 className="font-medium text-yellow-800">No Residents Found</h4>
              <p className="text-sm text-yellow-700">
                No residents are currently loaded. This could be due to:
              </p>
              <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside">
                <li>Database connection issues</li>
                <li>No residents have registered yet</li>
                <li>Permission issues with the residents table</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resident
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verification Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Registered
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QR Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredResidents.map((resident) => (
              <tr key={resident.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-700">
                          {resident.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{resident.name}</div>
                      <div className="text-sm text-gray-500">{resident.email}</div>
                      {resident.phone && (
                        <div className="text-xs text-gray-400">{resident.phone}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(resident.verificationStatus)}`}>
                    {(resident.verificationStatus || 'unknown').replace('-', ' ')}
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {resident.dateRegistered}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {resident.qrCode ? (
                    <QrCode className="h-5 w-5 text-green-600" />
                  ) : (
                    <span className="text-gray-400">No QR</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setSelectedResident(resident)}
                    className="text-blue-600 hover:text-blue-900"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditResident(resident)}
                    className="text-green-600 hover:text-green-900"
                    title="Edit Resident"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowPasswordReset(resident)}
                    className="text-purple-600 hover:text-purple-900"
                    title="Reset Password"
                  >
                    <Key className="h-4 w-4" />
                  </button>
                  {resident.verificationStatus !== 'verified' && (
                    <>
                      <button
                        onClick={() => handleVerifyResident(resident.id, 'semi-verified')}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <UserCheck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleVerifyResident(resident.id, 'verified')}
                        className="text-green-600 hover:text-green-900"
                      >
                        <UserCheck className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredResidents.length === 0 && residents.length > 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No residents match your search criteria</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:text-blue-800 text-sm mt-2"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {selectedResident && (
        <ResidentDetailModal
          resident={selectedResident}
          onClose={() => setSelectedResident(null)}
        />
      )}

      {/* Edit Resident Modal */}
      {editingResident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit Resident Information</h3>
                <button
                  onClick={() => setEditingResident(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editingResident.name}
                    onChange={(e) => setEditingResident({ ...editingResident, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editingResident.email}
                    onChange={(e) => setEditingResident({ ...editingResident, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={editingResident.phone_number || ''}
                    onChange={(e) => setEditingResident({ ...editingResident, phone_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
                  <input
                    type="date"
                    value={editingResident.birth_date || ''}
                    onChange={(e) => setEditingResident({ ...editingResident, birth_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={editingResident.gender || ''}
                    onChange={(e) => setEditingResident({ ...editingResident, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Civil Status</label>
                  <select
                    value={editingResident.civil_status || ''}
                    onChange={(e) => setEditingResident({ ...editingResident, civil_status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="widowed">Widowed</option>
                    <option value="separated">Separated</option>
                    <option value="divorced">Divorced</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={editingResident.address}
                  onChange={(e) => setEditingResident({ ...editingResident, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                <textarea
                  value={editingResident.emergency_contact || ''}
                  onChange={(e) => setEditingResident({ ...editingResident, emergency_contact: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Name - Phone - Relationship - Address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
                <select
                  value={editingResident.verification_status}
                  onChange={(e) => setEditingResident({ ...editingResident, verification_status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="non-verified">Non-verified</option>
                  <option value="semi-verified">Semi-verified</option>
                  <option value="verified">Verified</option>
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setEditingResident(null)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateResident}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Update Resident
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
                <button
                  onClick={() => setShowPasswordReset(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-center">
                <Key className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Reset Password for</h4>
                <p className="text-gray-600">{showPasswordReset.name}</p>
                <p className="text-sm text-gray-500">{showPasswordReset.email}</p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <h5 className="font-medium text-yellow-800">Security Notice</h5>
                    <p className="text-sm text-yellow-700">
                      A password reset email will be sent to the resident's email address.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPasswordReset(null)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePasswordReset(showPasswordReset.id)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Send Reset Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResidentDetailModal({ resident, onClose }: { resident: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Complete Resident Information</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Personal Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{resident.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{resident.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{resident.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Birth Date</label>
                  <p className="text-sm text-gray-900">{resident.birth_date || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  <p className="text-sm text-gray-900 capitalize">{resident.gender || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Civil Status</label>
                  <p className="text-sm text-gray-900 capitalize">{resident.civil_status || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <p className="text-sm text-gray-900">{resident.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Emergency Contact</label>
                  <p className="text-sm text-gray-900">{resident.emergency_contact || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Verification Details</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-900 capitalize">{resident.verification_status?.replace('-', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date Registered</label>
                  <p className="text-sm text-gray-900">{resident.date_registered}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">QR Code</label>
                  <p className="text-sm text-gray-900">
                    {resident.qr_code ? (
                      <span className="text-green-600">Generated</span>
                    ) : (
                      <span className="text-red-600">Not available</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Created At</label>
                  <p className="text-sm text-gray-900">{new Date(resident.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="text-sm text-gray-900">{new Date(resident.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}