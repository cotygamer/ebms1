import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import GoogleMapComponent from './GoogleMapComponent';
import { 
  MapPin, 
  Building2, 
  Heart, 
  GraduationCap, 
  ShoppingCart,
  Car,
  TreePine,
  Home,
  Shield,
  Phone,
  Clock,
  Navigation,
  Search,
  Filter,
  Eye,
  X,
  Star,
  Info
} from 'lucide-react';

interface MapLocation {
  id: string;
  name: string;
  type: 'government' | 'health' | 'education' | 'commercial' | 'religious' | 'emergency';
  lat: number;
  lng: number;
  address: string;
  description?: string;
  contact?: string;
  hours?: string;
  services?: string[];
  rating?: number;
}

export default function BarangayMap() {
  const { systemSettings } = useData();
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample locations for the barangay
  const locations: MapLocation[] = [
    {
      id: '1',
      name: 'Barangay Hall',
      type: 'government',
      lat: 14.5995,
      lng: 120.9842,
      address: 'Main Street, Barangay San Miguel',
      description: 'Main government office for all barangay services',
      contact: '+63 2 8123 4567',
      hours: '8:00 AM - 5:00 PM (Mon-Fri)',
      services: ['Document Processing', 'Permits', 'Certificates', 'Registration'],
      rating: 4.8
    },
    {
      id: '2',
      name: 'Barangay Health Center',
      type: 'health',
      lat: 14.5998,
      lng: 120.9845,
      address: 'Health Street, Barangay San Miguel',
      description: 'Primary healthcare facility serving the community',
      contact: '+63 2 8123 4568',
      hours: '24/7 Emergency, 8:00 AM - 5:00 PM (Regular)',
      services: ['Medical Consultation', 'Vaccination', 'Emergency Care', 'Maternal Care'],
      rating: 4.9
    },
    {
      id: '3',
      name: 'San Miguel Elementary School',
      type: 'education',
      lat: 14.5992,
      lng: 120.9848,
      address: 'Education Avenue, Barangay San Miguel',
      description: 'Public elementary school serving grades 1-6',
      contact: '+63 2 8123 4569',
      hours: '7:00 AM - 5:00 PM (School Days)',
      services: ['Elementary Education', 'After School Programs', 'Community Events'],
      rating: 4.7
    },
    {
      id: '4',
      name: 'Community Center',
      type: 'government',
      lat: 14.6001,
      lng: 120.9840,
      address: 'Community Street, Barangay San Miguel',
      description: 'Multi-purpose facility for community events and meetings',
      contact: '+63 2 8123 4570',
      hours: '6:00 AM - 10:00 PM',
      services: ['Events', 'Meetings', 'Sports Activities', 'Cultural Programs'],
      rating: 4.6
    },
    {
      id: '5',
      name: 'San Miguel Church',
      type: 'religious',
      lat: 14.5989,
      lng: 120.9844,
      address: 'Church Street, Barangay San Miguel',
      description: 'Historic parish church serving the Catholic community',
      contact: '+63 2 8123 4571',
      hours: 'Daily Mass: 6:00 AM, 6:00 PM',
      services: ['Religious Services', 'Weddings', 'Baptisms', 'Community Outreach'],
      rating: 4.9
    },
    {
      id: '6',
      name: 'Public Market',
      type: 'commercial',
      lat: 14.5996,
      lng: 120.9850,
      address: 'Market Street, Barangay San Miguel',
      description: 'Local market for fresh produce and daily necessities',
      hours: '5:00 AM - 6:00 PM',
      services: ['Fresh Produce', 'Meat & Seafood', 'Dry Goods', 'Prepared Food'],
      rating: 4.4
    }
  ];

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || location.type === filterType;
    return matchesSearch && matchesType;
  });

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'government':
        return <Building2 className="h-5 w-5" />;
      case 'health':
        return <Heart className="h-5 w-5" />;
      case 'education':
        return <GraduationCap className="h-5 w-5" />;
      case 'commercial':
        return <ShoppingCart className="h-5 w-5" />;
      case 'religious':
        return <Home className="h-5 w-5" />;
      case 'emergency':
        return <Shield className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case 'government':
        return 'text-blue-600 bg-blue-50';
      case 'health':
        return 'text-red-600 bg-red-50';
      case 'education':
        return 'text-green-600 bg-green-50';
      case 'commercial':
        return 'text-purple-600 bg-purple-50';
      case 'religious':
        return 'text-yellow-600 bg-yellow-50';
      case 'emergency':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Prepare markers for Google Maps
  const mapMarkers = filteredLocations.map(location => ({
    id: location.id,
    lat: location.lat,
    lng: location.lng,
    title: location.name,
    status: 'verified' as const,
    onClick: () => setSelectedLocation(location)
  }));

  if (!systemSettings.googleMapsApiKey) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Barangay Map</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="font-semibold text-yellow-800">Google Maps Not Available</h3>
              <p className="text-yellow-700 mt-1">
                The interactive map feature is currently unavailable. Please contact the barangay office for location assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Barangay Map</h1>
          <p className="text-gray-600">Explore important locations and facilities in our community</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Locations</option>
            <option value="government">Government</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="commercial">Commercial</option>
            <option value="religious">Religious</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Interactive Community Map</h3>
            <div className="flex items-center space-x-4">
              {/* Map Legend */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>Government</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>Health</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Education</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span>Commercial</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <GoogleMapComponent
          onLocationSelect={() => {}} // Read-only for residents
          markers={mapMarkers}
          height="500px"
          zoom={16}
          readonly={true}
        />
      </div>

      {/* Locations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((location) => (
          <div key={location.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${getLocationColor(location.type)}`}>
                  {getLocationIcon(location.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{location.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLocationColor(location.type)}`}>
                    {location.type.toUpperCase()}
                  </span>
                </div>
              </div>
              {location.rating && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700 ml-1">{location.rating}</span>
                </div>
              )}
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{location.description}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-700">{location.address}</span>
              </div>
              {location.contact && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-700">{location.contact}</span>
                </div>
              )}
              {location.hours && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-700">{location.hours}</span>
                </div>
              )}
            </div>
            
            {location.services && location.services.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Services:</h4>
                <div className="flex flex-wrap gap-1">
                  {location.services.slice(0, 3).map((service, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {service}
                    </span>
                  ))}
                  {location.services.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                      +{location.services.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
            
            <button
              onClick={() => setSelectedLocation(location)}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Location Details Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Location Details</h3>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-lg ${getLocationColor(selectedLocation.type)}`}>
                  {getLocationIcon(selectedLocation.type)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedLocation.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLocationColor(selectedLocation.type)}`}>
                      {selectedLocation.type.toUpperCase()}
                    </span>
                    {selectedLocation.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700 ml-1">{selectedLocation.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800">{selectedLocation.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">{selectedLocation.address}</span>
                    </div>
                    {selectedLocation.contact && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-gray-700">{selectedLocation.contact}</span>
                      </div>
                    )}
                    {selectedLocation.hours && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-gray-700">{selectedLocation.hours}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedLocation.services && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Available Services</h4>
                    <div className="space-y-1">
                      {selectedLocation.services.map((service, index) => (
                        <div key={index} className="text-sm text-gray-700 flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`;
                    window.open(url, '_blank');
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Navigation className="h-4 w-4 mr-2 inline" />
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}