import React, { useState, useEffect } from 'react';
import { MapPin, Eye, CheckCircle, AlertTriangle, Navigation, Satellite, Map as MapIcon, Home, Target, Users, Clock, Shield } from 'lucide-react';

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
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  const filteredLocations = locations.filter(location => 
    filterStatus === 'all' || location.verificationStatus === filterStatus
  );

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const stats = {
    total: locations.length,
    pending: locations.filter(l => l.verificationStatus === 'pending').length,
    verified: locations.filter(l => l.verificationStatus === 'verified').length,
    rejected: locations.filter(l => l.verificationStatus === 'rejected').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Location Verification Map</h3>
        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Locations</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <button
            onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
          >
            {mapType === 'roadmap' ? <Satellite className="h-4 w-4 mr-1" /> : <MapIcon className="h-4 w-4 mr-1" />}
            {mapType === 'roadmap' ? 'Satellite' : 'Road Map'}
          </button>
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

      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <div 
            className="w-full h-96 bg-gray-200 relative"
            style={{
              backgroundImage: mapType === 'satellite' 
                ? "url('https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg')"
                : "url('https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Map Overlay */}
            <div className="absolute inset-0 bg-blue-900 bg-opacity-10"></div>
            
            {/* Location Markers */}
            {filteredLocations.map((location, index) => (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${30 + (index % 5) * 15}%`,
                  top: `${25 + Math.floor(index / 5) * 20}%`
                }}
                onClick={() => setSelectedLocation(location)}
              >
                <div className={`w-8 h-8 ${getMarkerColor(location.verificationStatus)} rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform`}>
                  <Home className="h-4 w-4 text-white" />
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                  {location.residentName}
                </div>
              </div>
            ))}

            {/* Map Legend */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg p-3 shadow-lg">
              <h4 className="font-medium text-gray-900 mb-2 text-sm">Location Status</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span>Pending Verification</span>
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

            {/* Map Info */}
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 rounded-lg p-3 shadow-lg">
              <div className="text-xs text-gray-600">
                <p><strong>Barangay San Miguel</strong></p>
                <p>Metro Manila, Philippines</p>
                <p className="mt-1">{filteredLocations.length} locations shown</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Details Panel */}
      {selectedLocation && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Location Details</h4>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
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
                    const notes = prompt('Enter verification notes (optional):');
                    onVerifyLocation(selectedLocation.id, 'verified', notes || undefined);
                    setSelectedLocation(null);
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