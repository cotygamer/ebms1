import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Eye, UserCheck, UserX, QrCode, Users, Search, MapPin, IdCard, Phone, Mail, Calendar, Shield, History } from 'lucide-react';

export default function ResidentManagement() {
  const { residents, verifyResident } = useData();
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
                    {resident.verificationStatus.replace('-', ' ')}
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
                  >
                    <Eye className="h-4 w-4" />
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
      </div>

      {selectedResident && (
        <ResidentDetailModal
          resident={selectedResident}
          onClose={() => setSelectedResident(null)}
        />
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
            <h3 className="text-lg font-semibold text-gray-900">Resident Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
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
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <p className="text-sm text-gray-900">{resident.address}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Verification Details</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-900">{resident.verificationStatus}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date Registered</label>
                  <p className="text-sm text-gray-900">{resident.dateRegistered}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">QR Code</label>
                  <p className="text-sm text-gray-900">
                    {resident.qrCode ? (
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
          {resident.houseLocation && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                House Location
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-900 mb-2">
                  <strong>Address:</strong> {resident.houseLocation.address}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Coordinates:</strong> {resident.houseLocation.lat.toFixed(6)}, {resident.houseLocation.lng.toFixed(6)}
                </p>
              </div>
            </div>
          )}

          {/* Government IDs */}
          {resident.governmentIds && Object.keys(resident.governmentIds).length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <IdCard className="h-5 w-5 mr-2" />
                Government IDs
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(resident.governmentIds).map(([idType, idData]: [string, any]) => (
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

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Family Tree
            </h4>
            {resident.familyTree && resident.familyTree.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resident.familyTree.map((member: any) => (
                  <div key={member.id} className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900">{member.name}</h5>
                    <p className="text-sm text-gray-600 capitalize">{member.relation}</p>
                    <p className="text-xs text-gray-500">Age: {member.age}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No family members added</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}