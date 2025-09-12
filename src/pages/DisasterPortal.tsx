import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  AlertTriangle, 
  Shield, 
  Users, 
  MapPin, 
  Radio, 
  Bell,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  LogOut,
  Activity,
  Calendar,
  Clock,
  CheckCircle,
  X,
  Save,
  Cloud,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  CloudRain,
  Zap,
  Navigation,
  Satellite,
  Globe,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Home,
  Building2,
  Phone,
  Siren,
  Truck,
  Heart,
  Wrench
} from 'lucide-react';

const DisasterPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [showEvacuationForm, setShowEvacuationForm] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 14.5995, lng: 120.9842 });
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  const [alerts, setAlerts] = useState([
    {
      id: '1',
      type: 'flood',
      title: 'Flood Warning - Purok 3',
      description: 'Heavy rainfall causing water accumulation in low-lying areas of Purok 3. Residents advised to prepare for possible evacuation.',
      severity: 'high',
      status: 'active',
      affectedAreas: ['Purok 3', 'Main Street'],
      issuedBy: 'NDRRMC Officer',
      issuedAt: '2024-03-20 14:30',
      expiresAt: '2024-03-21 06:00',
      evacuationSites: ['Barangay Hall', 'Community Center'],
      contactNumbers: ['+63 912 345 6789', '+63 917 654 3210']
    },
    {
      id: '2',
      type: 'typhoon',
      title: 'Typhoon Signal #2 - Preparation Phase',
      description: 'Typhoon approaching the area. All residents should secure properties and prepare emergency kits.',
      severity: 'critical',
      status: 'active',
      affectedAreas: ['All Puroks'],
      issuedBy: 'PAGASA',
      issuedAt: '2024-03-20 08:00',
      expiresAt: '2024-03-22 18:00',
      evacuationSites: ['Elementary School', 'High School', 'Covered Court'],
      contactNumbers: ['+63 912 345 6789']
    }
  ]);

  const [evacuationSites, setEvacuationSites] = useState([
    {
      id: '1',
      name: 'Barangay Hall',
      capacity: 150,
      currentOccupancy: 45,
      status: 'operational',
      facilities: ['Restrooms', 'Kitchen', 'Medical Station'],
      coordinates: { lat: 14.5995, lng: 120.9842 },
      contactPerson: 'Maria Santos',
      contactNumber: '+63 912 345 6789'
    },
    {
      id: '2',
      name: 'Community Center',
      capacity: 200,
      currentOccupancy: 0,
      status: 'standby',
      facilities: ['Restrooms', 'Kitchen', 'Generator'],
      coordinates: { lat: 14.6005, lng: 120.9852 },
      contactPerson: 'Juan Dela Cruz',
      contactNumber: '+63 917 654 3210'
    },
    {
      id: '3',
      name: 'Elementary School',
      capacity: 300,
      currentOccupancy: 0,
      status: 'standby',
      facilities: ['Classrooms', 'Restrooms', 'Cafeteria', 'Medical Room'],
      coordinates: { lat: 14.5985, lng: 120.9832 },
      contactPerson: 'Ana Garcia',
      contactNumber: '+63 918 765 4321'
    }
  ]);

  const [resources, setResources] = useState([
    { id: '1', type: 'Food', item: 'Rice', quantity: 500, unit: 'kg', location: 'Warehouse A', status: 'available' },
    { id: '2', type: 'Water', item: 'Bottled Water', quantity: 1000, unit: 'bottles', location: 'Warehouse A', status: 'available' },
    { id: '3', type: 'Medical', item: 'First Aid Kits', quantity: 50, unit: 'kits', location: 'Health Center', status: 'available' },
    { id: '4', type: 'Equipment', item: 'Flashlights', quantity: 100, unit: 'pieces', location: 'Warehouse B', status: 'available' },
    { id: '5', type: 'Shelter', item: 'Tents', quantity: 25, unit: 'pieces', location: 'Warehouse B', status: 'available' }
  ]);

  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: '1', name: 'Barangay Emergency Hotline', number: '+63 912 345 6789', type: 'primary' },
    { id: '2', name: 'Police Station', number: '117', type: 'police' },
    { id: '3', name: 'Fire Department', number: '116', type: 'fire' },
    { id: '4', name: 'Medical Emergency', number: '911', type: 'medical' },
    { id: '5', name: 'NDRRMC Regional Office', number: '+63 917 654 3210', type: 'disaster' }
  ]);

  // Fixed logout function
  const handleLogout = () => {
    try {
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/');
    }
  };

  // Weather data fetching
  const fetchWeatherData = async () => {
    setIsLoadingWeather(true);
    try {
      // Simulated weather data - in production, integrate with actual weather API
      const mockWeatherData = {
        current: {
          temperature: 28,
          humidity: 75,
          windSpeed: 15,
          windDirection: 'NE',
          pressure: 1013,
          visibility: 10,
          uvIndex: 6,
          condition: 'Partly Cloudy',
          icon: 'partly-cloudy'
        },
        forecast: [
          { day: 'Today', high: 32, low: 24, condition: 'Partly Cloudy', precipitation: 20 },
          { day: 'Tomorrow', high: 30, low: 23, condition: 'Rainy', precipitation: 80 },
          { day: 'Friday', high: 29, low: 22, condition: 'Thunderstorms', precipitation: 90 },
          { day: 'Saturday', high: 31, low: 25, condition: 'Sunny', precipitation: 10 },
          { day: 'Sunday', high: 33, low: 26, condition: 'Partly Cloudy', precipitation: 30 }
        ],
        alerts: [
          { type: 'rainfall', message: 'Heavy rainfall expected in the next 6 hours', severity: 'moderate' },
          { type: 'wind', message: 'Strong winds up to 45 km/h possible', severity: 'low' }
        ]
      };
      
      setWeatherData(mockWeatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    // Refresh weather data every 10 minutes
    const interval = setInterval(fetchWeatherData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Active Alerts', value: alerts.filter(a => a.status === 'active').length.toString(), icon: AlertTriangle, color: 'bg-red-500', trend: '+2' },
    { label: 'Evacuation Sites', value: evacuationSites.length.toString(), icon: Shield, color: 'bg-blue-500', trend: '0' },
    { label: 'People Evacuated', value: evacuationSites.reduce((sum, site) => sum + site.currentOccupancy, 0).toString(), icon: Users, color: 'bg-green-500', trend: '+45' },
    { label: 'Available Resources', value: resources.filter(r => r.status === 'available').length.toString(), icon: Truck, color: 'bg-purple-500', trend: '+5' }
  ];

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'standby': return 'bg-yellow-100 text-yellow-800';
      case 'full': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">
                  {stat.trend.startsWith('+') ? `+${stat.trend.slice(1)} today` : 'No change'}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weather Monitoring Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Cloud className="h-5 w-5 mr-2" />
            Real-Time Weather Monitoring
          </h3>
          <button
            onClick={fetchWeatherData}
            disabled={isLoadingWeather}
            className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingWeather ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {weatherData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Weather */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-4">Current Conditions</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Temperature</span>
                  <span className="font-bold text-blue-900">{weatherData.current.temperature}°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Humidity</span>
                  <span className="font-bold text-blue-900">{weatherData.current.humidity}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Wind Speed</span>
                  <span className="font-bold text-blue-900">{weatherData.current.windSpeed} km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Pressure</span>
                  <span className="font-bold text-blue-900">{weatherData.current.pressure} hPa</span>
                </div>
              </div>
            </div>

            {/* Weather Alerts */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-6 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-4">Weather Alerts</h4>
              <div className="space-y-3">
                {weatherData.alerts.map((alert: any, index: number) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                    alert.severity === 'moderate' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center mb-2">
                      <AlertTriangle className={`h-4 w-4 mr-2 ${
                        alert.severity === 'high' ? 'text-red-600' :
                        alert.severity === 'moderate' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                      <span className="font-medium capitalize">{alert.type} Alert</span>
                    </div>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-4">5-Day Forecast</h4>
              <div className="space-y-3">
                {weatherData.forecast.map((day: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-green-700 text-sm">{day.day}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-green-600">{day.high}°/{day.low}°</span>
                      <span className="text-xs text-green-600">{day.precipitation}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Cloud className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Loading weather data...</p>
          </div>
        )}
      </div>

      {/* Google Maps Integration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Barangay Emergency Map
          </h3>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-800 text-sm">
              <Satellite className="h-4 w-4 mr-1" />
              Satellite View
            </button>
            <a
              href="https://zoom.earth/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <Globe className="h-4 w-4 mr-1" />
              Zoom.earth Live Weather
            </a>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <div className="h-96 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center relative">
            {/* Simulated Map Interface */}
            <div className="absolute inset-0 p-4">
              <div className="grid grid-cols-3 gap-2 h-full">
                {/* Evacuation Sites Markers */}
                {evacuationSites.map((site, index) => (
                  <div
                    key={site.id}
                    className={`relative bg-white rounded-lg shadow-md p-3 ${
                      site.status === 'operational' ? 'border-2 border-red-500' : 'border border-gray-300'
                    }`}
                    style={{
                      gridColumn: index === 0 ? '1' : index === 1 ? '2' : '3',
                      gridRow: index === 0 ? '1' : index === 1 ? '2' : '1'
                    }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className={`h-4 w-4 ${
                        site.status === 'operational' ? 'text-red-600' : 'text-gray-400'
                      }`} />
                      <span className="text-xs font-medium">{site.name}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>Capacity: {site.capacity}</p>
                      <p>Current: {site.currentOccupancy}</p>
                      <p className={`font-medium ${
                        site.status === 'operational' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {site.status.toUpperCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
                <h5 className="font-semibold text-gray-900 mb-2 text-sm">Legend</h5>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>Active Evacuation Site</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span>Standby Site</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span>Flood-Prone Area</span>
                  </div>
                </div>
              </div>

              {/* Weather Overlay */}
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Cloud className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Live Weather</span>
                </div>
                <div className="text-xs text-gray-600">
                  <p>Temp: {weatherData?.current.temperature || '--'}°C</p>
                  <p>Wind: {weatherData?.current.windSpeed || '--'} km/h</p>
                  <p>Humidity: {weatherData?.current.humidity || '--'}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setShowAlertForm(true)}
            className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Siren className="h-8 w-8 text-red-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Issue Alert</h4>
              <p className="text-sm text-gray-600">Emergency broadcast</p>
            </div>
          </button>
          
          <button
            onClick={() => setShowEvacuationForm(true)}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Manage Evacuation</h4>
              <p className="text-sm text-gray-600">Site coordination</p>
            </div>
          </button>
          
          <button
            onClick={() => setShowResourceForm(true)}
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Truck className="h-8 w-8 text-green-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Resource Update</h4>
              <p className="text-sm text-gray-600">Inventory management</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Radio className="h-8 w-8 text-purple-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Communication</h4>
              <p className="text-sm text-gray-600">Radio check</p>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Emergency Alerts</h3>
            <button 
              onClick={() => setActiveTab('alerts')}
              className="text-orange-600 hover:text-orange-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {alerts.filter(alert => alert.status === 'active').slice(0, 3).map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.severity)}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{alert.title}</h4>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-600 text-white' :
                    alert.severity === 'high' ? 'bg-orange-600 text-white' :
                    'bg-yellow-600 text-white'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm mb-2">{alert.description}</p>
                <div className="text-xs">
                  <p>Issued: {alert.issuedAt}</p>
                  <p>Expires: {alert.expiresAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evacuation Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Evacuation Centers</h3>
            <button 
              onClick={() => setActiveTab('evacuation')}
              className="text-orange-600 hover:text-orange-800 text-sm font-medium"
            >
              Manage Sites
            </button>
          </div>
          <div className="space-y-3">
            {evacuationSites.map((site) => (
              <div key={site.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    site.status === 'operational' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <Shield className={`h-5 w-5 ${
                      site.status === 'operational' ? 'text-red-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{site.name}</p>
                    <p className="text-sm text-gray-600">
                      {site.currentOccupancy}/{site.capacity} occupancy
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(site.status)}`}>
                  {site.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyContacts.map((contact) => (
            <div key={contact.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                contact.type === 'primary' ? 'bg-orange-100' :
                contact.type === 'police' ? 'bg-blue-100' :
                contact.type === 'fire' ? 'bg-red-100' :
                contact.type === 'medical' ? 'bg-green-100' :
                'bg-purple-100'
              }`}>
                {contact.type === 'primary' ? <Phone className="h-5 w-5 text-orange-600" /> :
                 contact.type === 'police' ? <Shield className="h-5 w-5 text-blue-600" /> :
                 contact.type === 'fire' ? <Siren className="h-5 w-5 text-red-600" /> :
                 contact.type === 'medical' ? <Heart className="h-5 w-5 text-green-600" /> :
                 <AlertTriangle className="h-5 w-5 text-purple-600" />}
              </div>
              <div>
                <p className="font-medium text-gray-900">{contact.name}</p>
                <p className="text-sm text-gray-600">{contact.number}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Alerts & Warnings</h2>
        <button 
          onClick={() => setShowAlertForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Issue Alert
        </button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-6 rounded-lg border ${getAlertColor(alert.severity)}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-600 text-white' :
                    alert.severity === 'high' ? 'bg-orange-600 text-white' :
                    alert.severity === 'moderate' ? 'bg-yellow-600 text-white' :
                    'bg-blue-600 text-white'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className="text-xs font-medium text-gray-600 uppercase">{alert.type}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{alert.title}</h3>
                <p className="text-gray-700 mb-4">{alert.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Affected Areas:</strong> {alert.affectedAreas.join(', ')}</p>
                    <p><strong>Issued by:</strong> {alert.issuedBy}</p>
                    <p><strong>Issued at:</strong> {alert.issuedAt}</p>
                  </div>
                  <div>
                    <p><strong>Expires:</strong> {alert.expiresAt}</p>
                    <p><strong>Evacuation Sites:</strong> {alert.evacuationSites.join(', ')}</p>
                    <p><strong>Emergency Contacts:</strong> {alert.contactNumbers.join(', ')}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEvacuation = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Evacuation Center Management</h2>
        <button 
          onClick={() => setShowEvacuationForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Site
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-green-600">
                {evacuationSites.reduce((sum, site) => sum + site.capacity, 0)}
              </p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Occupancy</p>
              <p className="text-2xl font-bold text-blue-600">
                {evacuationSites.reduce((sum, site) => sum + site.currentOccupancy, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Space</p>
              <p className="text-2xl font-bold text-orange-600">
                {evacuationSites.reduce((sum, site) => sum + (site.capacity - site.currentOccupancy), 0)}
              </p>
            </div>
            <Home className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {evacuationSites.map((site) => (
                <tr key={site.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-orange-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{site.name}</div>
                        <div className="text-sm text-gray-500">{site.facilities.join(', ')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{site.capacity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-2">{site.currentOccupancy}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            (site.currentOccupancy / site.capacity) > 0.8 ? 'bg-red-500' :
                            (site.currentOccupancy / site.capacity) > 0.6 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${(site.currentOccupancy / site.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(site.status)}`}>
                      {site.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <p>{site.contactPerson}</p>
                      <p className="text-gray-500">{site.contactNumber}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Resources</h2>
        <button 
          onClick={() => setShowResourceForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {['Food', 'Water', 'Medical', 'Equipment', 'Shelter'].map((type) => (
          <div key={type} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {resources.filter(r => r.type === type && r.status === 'available').length}
              </div>
              <div className="text-sm text-orange-800">{type} Items</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      resource.type === 'Food' ? 'bg-green-100 text-green-800' :
                      resource.type === 'Water' ? 'bg-blue-100 text-blue-800' :
                      resource.type === 'Medical' ? 'bg-red-100 text-red-800' :
                      resource.type === 'Equipment' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {resource.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resource.item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.quantity} {resource.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      resource.status === 'available' ? 'bg-green-100 text-green-800' :
                      resource.status === 'deployed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {resource.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Truck className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPlanning = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Emergency Planning & Preparedness</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Emergency Drills</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-900">Fire Drill</p>
              <p className="text-sm text-blue-700">Next: March 25, 2024</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-green-900">Earthquake Drill</p>
              <p className="text-sm text-green-700">Next: April 15, 2024</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="font-medium text-yellow-900">Flood Evacuation</p>
              <p className="text-sm text-yellow-700">Next: May 10, 2024</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Wrench className="h-8 w-8 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Equipment Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Emergency Radios</span>
              <span className="text-sm font-medium text-green-600">12/12 Working</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Generators</span>
              <span className="text-sm font-medium text-green-600">3/3 Working</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Emergency Vehicles</span>
              <span className="text-sm font-medium text-yellow-600">2/3 Working</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Medical Kits</span>
              <span className="text-sm font-medium text-green-600">50/50 Ready</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Flood Risk</span>
              <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">High</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Fire Risk</span>
              <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Medium</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Earthquake Risk</span>
              <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Medium</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Typhoon Risk</span>
              <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Response Plans */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Response Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Flood Response Plan</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Monitor water levels every 30 minutes</li>
              <li>• Issue evacuation orders when water reaches 1.5m</li>
              <li>• Activate all evacuation centers</li>
              <li>• Deploy rescue boats and equipment</li>
              <li>• Coordinate with LGU and NDRRMC</li>
            </ul>
            <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Full Plan
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Typhoon Response Plan</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Pre-position resources 48 hours before landfall</li>
              <li>• Mandatory evacuation for high-risk areas</li>
              <li>• Secure all outdoor equipment and signage</li>
              <li>• Establish communication protocols</li>
              <li>• Coordinate with regional disaster office</li>
            </ul>
            <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Full Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWeatherMonitoring = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Weather Monitoring System</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchWeatherData}
            disabled={isLoadingWeather}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingWeather ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
          <a
            href="https://zoom.earth/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Globe className="h-4 w-4 mr-2" />
            Zoom.earth Live
          </a>
        </div>
      </div>

      {weatherData && (
        <>
          {/* Current Weather Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Temperature</p>
                  <p className="text-3xl font-bold text-blue-600">{weatherData.current.temperature}°C</p>
                </div>
                <Thermometer className="h-12 w-12 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Humidity</p>
                  <p className="text-3xl font-bold text-green-600">{weatherData.current.humidity}%</p>
                </div>
                <Droplets className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Wind Speed</p>
                  <p className="text-3xl font-bold text-purple-600">{weatherData.current.windSpeed}</p>
                  <p className="text-xs text-purple-500">km/h {weatherData.current.windDirection}</p>
                </div>
                <Wind className="h-12 w-12 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">UV Index</p>
                  <p className="text-3xl font-bold text-yellow-600">{weatherData.current.uvIndex}</p>
                  <p className="text-xs text-yellow-500">Moderate</p>
                </div>
                <Sun className="h-12 w-12 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Weather Forecast */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">5-Day Weather Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {weatherData.forecast.map((day: any, index: number) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">{day.day}</p>
                  <div className="mb-2">
                    {day.condition === 'Sunny' ? <Sun className="h-8 w-8 text-yellow-500 mx-auto" /> :
                     day.condition === 'Rainy' ? <CloudRain className="h-8 w-8 text-blue-500 mx-auto" /> :
                     day.condition === 'Thunderstorms' ? <Zap className="h-8 w-8 text-purple-500 mx-auto" /> :
                     <Cloud className="h-8 w-8 text-gray-500 mx-auto" />}
                  </div>
                  <p className="text-sm font-medium text-gray-900">{day.high}° / {day.low}°</p>
                  <p className="text-xs text-blue-600">{day.precipitation}% rain</p>
                  <p className="text-xs text-gray-600 mt-1">{day.condition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Alerts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Alerts & Warnings</h3>
            <div className="space-y-3">
              {weatherData.alerts.map((alert: any, index: number) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                  alert.severity === 'moderate' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center mb-2">
                    <AlertTriangle className={`h-5 w-5 mr-2 ${
                      alert.severity === 'high' ? 'text-red-600' :
                      alert.severity === 'moderate' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                    <span className="font-medium capitalize">{alert.type} Alert</span>
                    <span className={`ml-auto px-2 py-1 text-xs font-semibold rounded-full ${
                      alert.severity === 'high' ? 'bg-red-600 text-white' :
                      alert.severity === 'moderate' ? 'bg-yellow-600 text-white' :
                      'bg-blue-600 text-white'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Zoom.earth Integration */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Live Weather Radar</h3>
              <a
                href="https://zoom.earth/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Satellite className="h-4 w-4 mr-2" />
                Open Zoom.earth
              </a>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 text-center">
              <Globe className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Weather Monitoring</h4>
              <p className="text-gray-600 mb-4">
                Access real-time satellite imagery, weather radar, and global weather patterns through Zoom.earth integration.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-1">Available Features:</h5>
                  <ul className="text-gray-600 text-left space-y-1">
                    <li>• Live satellite imagery</li>
                    <li>• Weather radar overlays</li>
                    <li>• Storm tracking</li>
                    <li>• Cloud movement patterns</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-1">Data Sources:</h5>
                  <ul className="text-gray-600 text-left space-y-1">
                    <li>• GOES-16/17 satellites</li>
                    <li>• Himawari-8 satellite</li>
                    <li>• Global weather models</li>
                    <li>• Real-time radar data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'alerts', label: 'Emergency Alerts', icon: AlertTriangle },
    { id: 'evacuation', label: 'Evacuation Centers', icon: Shield },
    { id: 'resources', label: 'Resources', icon: Truck },
    { id: 'planning', label: 'Emergency Planning', icon: Calendar },
    { id: 'weather', label: 'Weather Monitoring', icon: Cloud }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              {(user?.role === 'barangay-official' || user?.role === 'super-admin') && (
                <Link
                  to={user.role === 'barangay-official' ? '/barangay-official-dashboard' : '/super-admin-dashboard'}
                  className="text-orange-200 hover:text-white flex items-center"
                >
                  <ArrowLeft className="h-6 w-6" />
                  <span className="ml-2 hidden sm:inline">Back</span>
                </Link>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                  <AlertTriangle className="mr-3 h-8 w-8" />
                  NDRRMC Portal
                </h1>
                <p className="text-orange-100 mt-2 text-sm sm:text-base">
                  Disaster Response & Emergency Planning System
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-orange-100 text-sm">Welcome, {user?.name}</p>
                <p className="text-xs text-orange-200 capitalize">{user?.role?.replace('-', ' ')}</p>
              </div>
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-orange-200 hover:text-white hover:bg-orange-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'alerts' && renderAlerts()}
        {activeTab === 'evacuation' && renderEvacuation()}
        {activeTab === 'resources' && renderResources()}
        {activeTab === 'planning' && renderPlanning()}
        {activeTab === 'weather' && renderWeatherMonitoring()}
      </div>

      {/* Alert Form Modal */}
      {showAlertForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Issue Emergency Alert</h3>
              <button
                onClick={() => setShowAlertForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option value="">Select alert type</option>
                    <option value="flood">Flood Warning</option>
                    <option value="typhoon">Typhoon Alert</option>
                    <option value="earthquake">Earthquake Alert</option>
                    <option value="fire">Fire Emergency</option>
                    <option value="landslide">Landslide Warning</option>
                    <option value="health">Health Emergency</option>
                    <option value="security">Security Alert</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity Level</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter alert title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Provide detailed alert description"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Affected Areas</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Purok 1, Purok 2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAlertForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                Issue Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisasterPortal;