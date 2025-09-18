import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import GoogleMapComponent from './GoogleMapComponent';
import { 
  MapPin, 
  Save, 
  Navigation, 
  Target, 
  Home, 
  CheckCircle, 
  AlertTriangle, 
  RotateCcw, 
  Crosshair,
  Smartphone,
  Edit,
  Eye,
  Clock,
  Shield
} from 'lucide-react';

interface HouseLocation {
  lat: number;
  lng: number;
  address: string;
  accuracy?: number;
  timestamp: string;
  verifiedBy?: string;
  verificationDate?: string;
}

export default function HouseholdMapPinning() {
  const { user, updateUser } = useAuth();
  const { updateResident, systemSettings } = useData();
  const [selectedLocation, setSelectedLocation] = useState<HouseLocation | null>(
    user?.houseLocation || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{lat: number, lng: number} | null>(null);
  const [manualAddress, setManualAddress] = useState('');

  useEffect(() => {
    // Get user's current location for better map centering
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  }, []);

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    const locationData: HouseLocation = {
      ...location,
      timestamp: new Date().toISOString()
    };
    setSelectedLocation(locationData);
    setError('');
    setSuccess('');
  };

  const handleSaveLocation = async () => {
    if (!selectedLocation) {
      setError('Please select a location on the map first');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const locationData = {
        ...selectedLocation,
        timestamp: new Date().toISOString(),
        verifiedBy: user?.name,
        verificationDate: new Date().toISOString()
      };

      // Update user context
      updateUser({ houseLocation: locationData });

      // Update resident in database
      if (user?.id) {
        await updateResident(user.id, {
          house_location: locationData,
          verification_status: user.verificationStatus === 'non-verified' ? 'details-updated' : user.verificationStatus
        });
      }

      setSuccess('House location saved successfully! Your verification status has been updated.');
      setShowConfirmation(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(`Failed to save location: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          };
          setSelectedLocation(location);
          setIsLoading(false);
        },
        (error) => {
          setError('Unable to get your current location. Please select manually on the map.');
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const getVerificationStatusColor = () => {
    if (selectedLocation) {
      return user?.verificationStatus === 'verified' ? 'border-green-500 bg-green-50' :
             user?.verificationStatus === 'semi-verified' ? 'border-yellow-500 bg-yellow-50' :
             'border-blue-500 bg-blue-50';
    }
    return 'border-red-500 bg-red-50';
  };

  if (!systemSettings.googleMapsApiKey) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Household Location Mapping</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="font-semibold text-yellow-800">Google Maps Not Configured</h3>
              <p className="text-yellow-700 mt-1">
                The Google Maps API key has not been configured. Please contact the system administrator 
                to enable location mapping features.
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
        <h2 className="text-2xl font-semibold text-gray-900">Household Location Mapping</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>KYC Verification Required</span>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}

      {/* Current Status */}
      <div className={`border-2 rounded-lg p-6 ${getVerificationStatusColor()}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Location Verification Status</h3>
          {selectedLocation && (
            <div className="flex items-center text-green-600">
              <MapPin className="h-5 w-5 mr-1" />
              <span className="font-medium">Location Pinned</span>
            </div>
          )}
        </div>
        
        {selectedLocation ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Pinned Address</label>
                <p className="text-sm text-gray-900">{selectedLocation.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Coordinates</label>
                <p className="text-sm text-gray-900 font-mono">
                  {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date Pinned</label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedLocation.timestamp).toLocaleDateString()}
                </p>
              </div>
              {selectedLocation.accuracy && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Accuracy</label>
                  <p className="text-sm text-gray-900">±{Math.round(selectedLocation.accuracy)}m</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Location Pinned</h4>
            <p className="text-gray-600">Pin your exact house location to complete your verification</p>
          </div>
        )}
      </div>

      {/* Map Interface */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Interactive Map</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleUseCurrentLocation}
                disabled={isLoading}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                <Navigation className="h-4 w-4 mr-1" />
                Use Current Location
              </button>
            </div>
          </div>
        </div>

        <GoogleMapComponent
          onLocationSelect={handleLocationSelect}
          initialLocation={selectedLocation ? { lat: selectedLocation.lat, lng: selectedLocation.lng } : currentPosition}
          height="400px"
          zoom={16}
        />

        {/* Map Instructions */}
        <div className="p-4 bg-blue-50 border-t border-blue-200">
          <div className="flex items-start space-x-3">
            <Target className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">How to Pin Your Location</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Click anywhere on the map to pin your house location</li>
                <li>• Use "Use Current Location" to automatically detect your position</li>
                <li>• Zoom in for more precise location selection</li>
                <li>• Verify the address is correct before saving</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Address Input */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Address Entry</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complete House Address
            </label>
            <textarea
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your complete house address (House #, Street, Purok, Barangay, City, Province)"
            />
          </div>
          
          <button
            onClick={() => {
              if (manualAddress.trim()) {
                const location: HouseLocation = {
                  lat: 14.5995 + (Math.random() - 0.5) * 0.01,
                  lng: 120.9842 + (Math.random() - 0.5) * 0.01,
                  address: manualAddress.trim(),
                  timestamp: new Date().toISOString()
                };
                setSelectedLocation(location);
                setManualAddress('');
              }
            }}
            disabled={!manualAddress.trim()}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            Use Manual Address
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {selectedLocation ? (
            <span className="text-green-600">✓ Location selected and ready to save</span>
          ) : (
            <span className="text-red-600">⚠ Please pin your house location</span>
          )}
        </div>
        
        <div className="flex space-x-3">
          {selectedLocation && (
            <button
              onClick={() => setSelectedLocation(null)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4 mr-2 inline" />
              Reset
            </button>
          )}
          
          <button
            onClick={() => setShowConfirmation(true)}
            disabled={!selectedLocation || isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Location'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm House Location</h3>
              <p className="text-gray-600">Please verify this is your correct house location</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Selected Location</h4>
                <p className="text-sm text-gray-700 mb-2">{selectedLocation.address}</p>
                <p className="text-xs text-gray-500 font-mono">
                  {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
                {selectedLocation.accuracy && (
                  <p className="text-xs text-gray-500">
                    Accuracy: ±{Math.round(selectedLocation.accuracy)}m
                  </p>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Important</h4>
                    <p className="text-sm text-yellow-700">
                      This location will be used for official barangay services and verification. 
                      Make sure it accurately represents your house location.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLocation}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Confirm & Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KYC Integration Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">KYC Verification Process</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
              user?.verificationStatus !== 'non-verified' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              <span className="font-bold">1</span>
            </div>
            <h4 className="font-medium text-blue-900">Profile Completion</h4>
            <p className="text-sm text-blue-700">Complete your personal information</p>
          </div>
          
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
              selectedLocation ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              <span className="font-bold">2</span>
            </div>
            <h4 className="font-medium text-blue-900">Location Mapping</h4>
            <p className="text-sm text-blue-700">Pin your exact house location</p>
          </div>
          
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
              user?.verificationStatus === 'verified' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              <span className="font-bold">3</span>
            </div>
            <h4 className="font-medium text-blue-900">Official Verification</h4>
            <p className="text-sm text-blue-700">Barangay staff verification</p>
          </div>
        </div>
      </div>

      {/* Mobile Responsiveness Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center">
          <Smartphone className="h-5 w-5 text-gray-600 mr-2" />
          <div>
            <h4 className="font-medium text-gray-900">Mobile Friendly</h4>
            <p className="text-sm text-gray-600">
              This map works on all devices. Use touch gestures on mobile to navigate and tap to pin your location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}