import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import GoogleMapComponent from './GoogleMapComponent';
import { 
  MapPin, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  Shield,
  Home,
  Navigation,
  Filter,
  Search,
  X,
  Edit,
  Save
} from 'lucide-react';

interface LocationData {
  id: string;
  residentId: string;
  residentName: string;
  lat: number;
  lng: number;
  address: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  submittedDate: string;
  verifiedDate?: string;
  verifiedBy?: string;
  accuracy?: number;
  notes?: string;
}

interface LocationVerificationMapProps {
  locations: LocationData[];
  onVerifyLocation: (locationId: string, status: 'verified' | 'rejected', notes?: string) => void;
  onViewDetails: (location: LocationData) => void;
}

export default function LocationVerificationMap({ 
  locations, 
  onVerifyLocation, 
  onViewDetails 
}: LocationVerificationMapProps) {
  const { residents, verifyResident, systemSettings } = useData();
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');

  // Convert residents data to location data format
  const locationData: LocationData[] = residents
    .filter(resident => resident.house_location)
    .map(resident => ({
      id: `loc_${resident.id}`,
      residentId: resident.id,
      residentName: resident.name,
      lat: resident.house_location.lat,
      lng: resident.house_location.lng,
      address: resident.house_location.address,
      verificationStatus: resident.verification_status === 'verified' ? 'verified' as const : 'pending' as const,
      submittedDate: resident.date_registered,
      verifiedDate: resident.verification_status === 'verified' ? resident.date_registered : undefined,
      accuracy: resident.house_location.accuracy || 10
    }));

  const filteredLocations = locationData.filter(location => {
    const matchesSearch = location.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || location.verificationStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleVerifyLocation = async (locationId: string, status: 'verified' | 'rejected', notes?: string) => {
    const location = locationData.find(l => l.id === locationId);
    if (location) {
      const resident = residents.find(r => r.id === location.residentId);
      if (resident) {
        const newStatus = status === 'verified' ? 'verified' : 'semi-verified';
        await verifyResident(resident.id, newStatus);
        setSelectedLocation(null);
        setShowVerificationModal(false);
        setVerificationNotes('');
      }
    }
  };

  const handleMarkerClick = (location: LocationData) => {
    setSelectedLocation(location);
  };

  const stats = {
    total: locationData.length,
    pending: locationData.filter(l => l.verificationStatus === 'pending').length,
    verified: locationData.filter(l => l.verificationStatus === 'verified').length,
    rejected: locationData.filter(l => l.verificationStatus === 'rejected').length
  };

  // Prepare markers for Google Maps
  const mapMarkers = filteredLocations.map(location => ({
    id: location.id,
    lat: location.lat,
    lng: location.lng,
    title: location.residentName,
    status: location.verificationStatus,
    onClick: () => handleMarkerClick(location)
  }));

  if (!systemSettings.googleMapsApiKey) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Location Verification Map</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="font-semibold text-yellow-800">Google Maps Not Configured</h3>
              <p className="text-yellow-700 mt-1">
                Please configure the Google Maps API key in System Settings to enable location verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Location Verification Map</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{locationData.length} locations submitted</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Locations</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
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
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Locations</option>
            <option value="pending">Pending Verification</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {filteredLocations.length} locations shown
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">Resident House Locations</h4>
            <div className="flex items-center space-x-4">
              {/* Map Legend */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Verified</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>Rejected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <GoogleMapComponent
          onLocationSelect={() => {}} // Read-only for officials
          markers={mapMarkers}
          height="500px"
          zoom={14}
          readonly={true}
        />
      </div>

      {/* Location Details Panel */}
      {selectedLocation && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Location Verification Details</h4>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Resident Information</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{selectedLocation.residentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedLocation.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                    selectedLocation.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedLocation.verificationStatus.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submitted:</span>
                  <span className="font-medium">{new Date(selectedLocation.submittedDate).toLocaleDateString()}</span>
                </div>
                {selectedLocation.verifiedDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Verified:</span>
                    <span className="font-medium">{new Date(selectedLocation.verifiedDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-3">Location Information</h5>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Address:</span>
                  <p className="font-medium">{selectedLocation.address}</p>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coordinates:</span>
                  <span className="font-mono text-xs">{selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</span>
                </div>
                {selectedLocation.accuracy && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-medium">±{Math.round(selectedLocation.accuracy)}m</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {selectedLocation.verificationStatus === 'pending' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowVerificationModal(true);
                  }}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Location
                </button>
                
                <button
                  onClick={() => {
                    const reason = prompt('Enter rejection reason:');
                    if (reason) {
                      onVerifyLocation(selectedLocation.id, 'rejected', reason);
                      setSelectedLocation(null);
                    }
                  }}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Reject Location
                </button>
                
                <button
                  onClick={() => onViewDetails(selectedLocation)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Details
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Verification Modal */}
      {showVerificationModal && selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Location</h3>
              <p className="text-gray-600">Confirm this house location for {selectedLocation.residentName}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Location Details</h4>
                <p className="text-sm text-gray-700 mb-2">{selectedLocation.address}</p>
                <p className="text-xs text-gray-500 font-mono">
                  {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Notes (Optional)
                </label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any notes about the verification..."
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowVerificationModal(false);
                  setVerificationNotes('');
                }}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleVerifyLocation(selectedLocation.id, 'verified', verificationNotes);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Verify Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Verification Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click on any marker to view location details</li>
          <li>• Yellow markers indicate pending verification</li>
          <li>• Green markers are verified locations</li>
          <li>• Red markers are rejected locations</li>
          <li>• Use satellite view for better house identification</li>
          <li>• Verify accuracy by cross-referencing with street view or local knowledge</li>
        </ul>
      </div>
    </div>
  );
}