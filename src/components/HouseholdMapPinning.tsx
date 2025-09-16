import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { MapPin, Save, Navigation, Target, Home, CheckCircle, AlertTriangle, Crosshair, RotateCcw, ZoomIn, ZoomOut, Layers, Satellite, Map as MapIcon, X, Camera, Upload, Eye } from 'lucide-react';

interface HouseLocation {
  lat: number;
  lng: number;
  address: string;
  accuracy?: number;
  timestamp: string;
  verifiedBy?: string;
  verificationDate?: string;
}

interface MapProps {
  onLocationSelect: (location: HouseLocation) => void;
  initialLocation?: HouseLocation;
  readonly?: boolean;
}

export default function HouseholdMapPinning() {
  const { user, updateUser } = useAuth();
  const { updateResident } = useData();
  const [selectedLocation, setSelectedLocation] = useState<HouseLocation | null>(
    user?.houseLocation || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');
  const [zoom, setZoom] = useState(16);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{lat: number, lng: number} | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [manualAddress, setManualAddress] = useState('');

  // Default coordinates for Barangay San Miguel, Metro Manila
  const defaultCenter = { lat: 14.5995, lng: 120.9842 };

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
          setCurrentPosition(defaultCenter);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      setCurrentPosition(defaultCenter);
    }
  }, []);

  const handleLocationSelect = useCallback((location: HouseLocation) => {
    setSelectedLocation(location);
    setError('');
    setSuccess('');
  }, []);

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
          const location: HouseLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: await reverseGeocode(position.coords.latitude, position.coords.longitude),
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

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // In a real app, you would use Google Maps Geocoding API
      // For demo purposes, we'll generate a realistic address
      return `${Math.floor(Math.random() * 999) + 1} Main Street, Purok ${Math.floor(Math.random() * 8) + 1}, Barangay San Miguel, Metro Manila`;
    } catch (error) {
      return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
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
              
              <select
                value={mapType}
                onChange={(e) => setMapType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="roadmap">Road Map</option>
                <option value="satellite">Satellite</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          <InteractiveMap
            onLocationSelect={handleLocationSelect}
            initialLocation={selectedLocation}
            currentPosition={currentPosition}
            mapType={mapType}
            zoom={zoom}
          />
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2">
            <button
              onClick={() => setZoom(Math.min(zoom + 1, 20))}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoom(Math.max(zoom - 1, 10))}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
              title="Toggle Map Type"
            >
              <Layers className="h-4 w-4" />
            </button>
          </div>

          {/* Crosshair for precise location selection */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <Crosshair className="h-8 w-8 text-red-500 drop-shadow-lg" />
          </div>
        </div>

        {/* Map Instructions */}
        <div className="p-4 bg-blue-50 border-t border-blue-200">
          <div className="flex items-start space-x-3">
            <Target className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">How to Pin Your Location</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Click and drag the map to navigate to your house</li>
                <li>• Use the crosshair in the center to precisely target your house</li>
                <li>• Click "Pin This Location" when the crosshair is over your house</li>
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
                  lat: defaultCenter.lat + (Math.random() - 0.5) * 0.01,
                  lng: defaultCenter.lng + (Math.random() - 0.5) * 0.01,
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
    </div>
  );
}

// Interactive Map Component
function InteractiveMap({ 
  onLocationSelect, 
  initialLocation, 
  currentPosition, 
  mapType, 
  zoom 
}: MapProps & { 
  currentPosition: {lat: number, lng: number} | null;
  mapType: string;
  zoom: number;
}) {
  const [mapCenter, setMapCenter] = useState(initialLocation || currentPosition || { lat: 14.5995, lng: 120.9842 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<{lat: number, lng: number} | null>(
    initialLocation ? { lat: initialLocation.lat, lng: initialLocation.lng } : null
  );

  const handleMapClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert pixel coordinates to lat/lng (simplified calculation)
    const lat = mapCenter.lat + (rect.height / 2 - y) * (0.01 / (rect.height / 2)) * (21 - zoom) / 10;
    const lng = mapCenter.lng + (x - rect.width / 2) * (0.01 / (rect.width / 2)) * (21 - zoom) / 10;
    
    setSelectedPoint({ lat, lng });
    
    // Generate address for the selected location
    const address = await reverseGeocode(lat, lng);
    
    const location: HouseLocation = {
      lat,
      lng,
      address,
      timestamp: new Date().toISOString()
    };
    
    onLocationSelect(location);
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // Simulate address generation based on coordinates
    const houseNumber = Math.floor(Math.random() * 999) + 1;
    const streets = ['Main Street', 'Rizal Avenue', 'Bonifacio Street', 'Luna Street', 'Mabini Street'];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const purok = Math.floor(Math.random() * 8) + 1;
    
    return `${houseNumber} ${street}, Purok ${purok}, Barangay San Miguel, Metro Manila`;
  };

  // Generate static map URL (in real app, use Google Maps API)
  const getMapImageUrl = () => {
    const baseUrl = 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg';
    return baseUrl; // Placeholder - in real app, generate dynamic map
  };

  return (
    <div className="relative">
      <div
        className="w-full h-96 bg-gray-200 cursor-crosshair relative overflow-hidden"
        onClick={handleMapClick}
        style={{
          backgroundImage: `url('${getMapImageUrl()}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Map Overlay */}
        <div className="absolute inset-0 bg-blue-900 bg-opacity-20"></div>
        
        {/* Grid Lines for Better Precision */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-10 grid-rows-10 h-full w-full">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="border border-white border-opacity-30"></div>
            ))}
          </div>
        </div>

        {/* Current Position Marker */}
        {currentPosition && (
          <div 
            className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: '45%',
              top: '45%'
            }}
            title="Your Current Location"
          >
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          </div>
        )}

        {/* Selected Location Marker */}
        {selectedPoint && (
          <div 
            className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: '50%',
              top: '50%'
            }}
          >
            <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <Home className="h-3 w-3 text-white" />
            </div>
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              Your House
            </div>
          </div>
        )}

        {/* Center Crosshair */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 flex items-center justify-center">
            <div className="w-6 h-0.5 bg-red-500 absolute"></div>
            <div className="w-0.5 h-6 bg-red-500 absolute"></div>
            <div className="w-2 h-2 border-2 border-red-500 rounded-full bg-white"></div>
          </div>
        </div>

        {/* Map Info Overlay */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 text-sm">
          <div className="space-y-1">
            <p><strong>Map Type:</strong> {mapType}</p>
            <p><strong>Zoom:</strong> {zoom}</p>
            <p><strong>Center:</strong> {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}</p>
          </div>
        </div>

        {/* Pin Location Button */}
        <div className="absolute bottom-4 right-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMapClick(e);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-lg flex items-center"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Pin This Location
          </button>
        </div>
      </div>

      {/* Map Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Current Location</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Selected House</span>
            </div>
            <div className="flex items-center">
              <Crosshair className="h-4 w-4 text-red-500 mr-2" />
              <span>Targeting Crosshair</span>
            </div>
          </div>
          <div className="text-gray-600">
            Click anywhere on the map to pin your house location
          </div>
        </div>
      </div>
    </div>
  );
}