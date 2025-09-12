import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { AlertTriangle, Users, MapPin, Bell, Activity, Plus, Search, Filter, Download, Eye, Edit, Trash2, ArrowLeft, LogOut, Shield, Radio, Siren, Megaphone, Calendar, Clock, CheckCircle, X, Save, Cloud, Thermometer, Wind, Droplets, Sun, Eye as EyeIcon, RefreshCw, Gauge, Navigation, Sunrise, Sunset, Umbrella, CloudRain, CloudSnow, Zap, Globe, Satellite, Radar, TrendingUp, BarChart3, Phone, Building2, Truck, Home, Guitar as Hospital, School, Factory } from 'lucide-react';

const DisasterPortal: React.FC = () => {
  const { user } = useAuth();
  const { systemSettings } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [showEvacuationForm, setShowEvacuationForm] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [weatherData, setWeatherData] = useState({
    temperature: 28,
    humidity: 75,
    windSpeed: 12,
    windDirection: 'NE',
    pressure: 1013,
    uvIndex: 6,
    visibility: 10,
    condition: 'Partly Cloudy',
    precipitation: 0,
    cloudCover: 45,
    dewPoint: 22,
    feelsLike: 31,
    lastUpdated: new Date().toLocaleTimeString()
  });

  const [forecast, setForecast] = useState([
    { day: 'Today', high: 32, low: 24, condition: 'Sunny', precipitation: 10, humidity: 75, windSpeed: 12 },
    { day: 'Tomorrow', high: 30, low: 23, condition: 'Partly Cloudy', precipitation: 20, humidity: 78, windSpeed: 15 },
    { day: 'Friday', high: 29, low: 22, condition: 'Cloudy', precipitation: 40, humidity: 82, windSpeed: 18 },
    { day: 'Saturday', high: 27, low: 21, condition: 'Light Rain', precipitation: 70, humidity: 85, windSpeed: 20 },
    { day: 'Sunday', high: 28, low: 22, condition: 'Partly Cloudy', precipitation: 30, humidity: 80, windSpeed: 14 }
  ]);

  const [evacuationSites, setEvacuationSites] = useState([
    {
      id: '1',
      name: 'Barangay Elementary School',
      address: 'Main Street, Purok 1',
      capacity: 500,
      currentOccupancy: 0,
      status: 'operational',
      facilities: ['Classrooms', 'Restrooms', 'Kitchen', 'Medical Station'],
      coordinates: { lat: 14.5995, lng: 120.9842 },
      contactPerson: 'Principal Maria Santos',
      contactNumber: '+63 912 345 6789'
    },
    {
      id: '2',
      name: 'Community Center',
      address: 'Center Street, Purok 2',
      capacity: 300,
      currentOccupancy: 0,
      status: 'operational',
      facilities: ['Main Hall', 'Kitchen', 'Storage', 'Generator'],
      coordinates: { lat: 14.6005, lng: 120.9852 },
      contactPerson: 'Coordinator Juan Dela Cruz',
      contactNumber: '+63 917 654 3210'
    },
    {
      id: '3',
      name: 'Covered Court',
      address: 'Sports Complex, Purok 3',
      capacity: 200,
      currentOccupancy: 0,
      status: 'standby',
      facilities: ['Covered Area', 'Restrooms', 'Storage'],
      coordinates: { lat: 14.6015, lng: 120.9862 },
      contactPerson: 'Sports Coordinator Pedro Martinez',
      contactNumber: '+63 918 765 4321'
    }
  ]);

  const [emergencyAlerts, setEmergencyAlerts] = useState([
    {
      id: '1',
      type: 'weather',
      severity: 'high',
      title: 'Heavy Rainfall Warning',
      message: 'Heavy rainfall expected in the next 6 hours. Residents in flood-prone areas should prepare for possible evacuation.',
      issuedAt: '2024-03-20 14:30',
      expiresAt: '2024-03-20 20:30',
      status: 'active',
      affectedAreas: ['Purok 1', 'Purok 4', 'Riverside Area']
    },
    {
      id: '2',
      type: 'evacuation',
      severity: 'critical',
      title: 'Evacuation Notice - Purok 1',
      message: 'Immediate evacuation required for Purok 1 residents due to rising water levels. Proceed to Barangay Elementary School.',
      issuedAt: '2024-03-20 15:00',
      expiresAt: '2024-03-21 06:00',
      status: 'active',
      affectedAreas: ['Purok 1']
    }
  ]);

  const [emergencyResources, setEmergencyResources] = useState([
    { id: '1', name: 'Emergency Food Packs', quantity: 500, unit: 'packs', location: 'Barangay Warehouse', status: 'available' },
    { id: '2', name: 'Drinking Water', quantity: 1000, unit: 'liters', location: 'Water Station', status: 'available' },
    { id: '3', name: 'Medical Supplies', quantity: 50, unit: 'kits', location: 'Health Center', status: 'available' },
    { id: '4', name: 'Blankets', quantity: 200, unit: 'pieces', location: 'Community Center', status: 'available' },
    { id: '5', name: 'Flashlights', quantity: 100, unit: 'pieces', location: 'Emergency Storage', status: 'low' }
  ]);

  const [newAlert, setNewAlert] = useState({
    type: 'weather',
    severity: 'medium',
    title: '',
    message: '',
    affectedAreas: [] as string[],
    expiresAt: ''
  });

  // Simulate weather data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherData(prev => ({
        ...prev,
        temperature: 25 + Math.random() * 10,
        humidity: 60 + Math.random() * 30,
        windSpeed: 5 + Math.random() * 20,
        pressure: 1000 + Math.random() * 30,
        lastUpdated: new Date().toLocaleTimeString()
      }));
    }, 600000); // Update every 10 minutes

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    try {
      const { logout } = useAuth();
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/');
    }
  };

  const handleAddAlert = () => {
    if (newAlert.title && newAlert.message) {
      const alert = {
        id: Date.now().toString(),
        ...newAlert,
        issuedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: 'active'
      };
      setEmergencyAlerts(prev => [alert, ...prev]);
      setNewAlert({
        type: 'weather',
        severity: 'medium',
        title: '',
        message: '',
        affectedAreas: [],
        expiresAt: ''
      });
      setShowAlertForm(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
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

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return Sun;
      case 'partly cloudy': return Cloud;
      case 'cloudy': return Cloud;
      case 'light rain': return CloudRain;
      case 'heavy rain': return CloudRain;
      case 'thunderstorm': return Zap;
      default: return Cloud;
    }
  };

  const stats = [
    { label: 'Active Alerts', value: emergencyAlerts.filter(a => a.status === 'active').length.toString(), icon: Bell, color: 'bg-red-500', trend: '+2 today' },
    { label: 'Evacuation Sites', value: evacuationSites.length.toString(), icon: MapPin, color: 'bg-blue-500', trend: '3 operational' },
    { label: 'Emergency Resources', value: emergencyResources.length.toString(), icon: Shield, color: 'bg-green-500', trend: '95% available' },
    { label: 'Response Teams', value: '12', icon: Users, color: 'bg-purple-500', trend: 'All ready' }
  ];

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
                <p className="text-sm text-orange-600">{stat.trend}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setShowAlertForm(true)}
            className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Bell className="h-8 w-8 text-red-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Issue Alert</h4>
              <p className="text-sm text-gray-600">Emergency notification</p>
            </div>
          </button>
          
          <button
            onClick={() => setShowEvacuationForm(true)}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <MapPin className="h-8 w-8 text-blue-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Evacuation</h4>
              <p className="text-sm text-gray-600">Manage evacuation</p>
            </div>
          </button>
          
          <button
            onClick={() => setShowResourceForm(true)}
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Shield className="h-8 w-8 text-green-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Resources</h4>
              <p className="text-sm text-gray-600">Manage supplies</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Radio className="h-8 w-8 text-purple-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Communication</h4>
              <p className="text-sm text-gray-600">Radio network</p>
            </div>
          </button>
        </div>
      </div>

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
          {emergencyAlerts.filter(alert => alert.status === 'active').slice(0, 3).map((alert) => (
            <div key={alert.id} className={`p-4 border rounded-lg ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Bell className="h-5 w-5" />
                    <span className="font-semibold">{alert.title}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{alert.message}</p>
                  <div className="text-xs">
                    <p>Issued: {alert.issuedAt}</p>
                    <p>Expires: {alert.expiresAt}</p>
                    <p>Areas: {alert.affectedAreas.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Monitoring Dashboard */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Cloud className="h-5 w-5 mr-2" />
            Real-Time Weather Monitoring
          </h3>
          <div className="flex items-center space-x-4">
            <button className="text-orange-600 hover:text-orange-800 flex items-center text-sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Last updated: {weatherData.lastUpdated}
            </button>
            <a
              href="https://zoom.earth/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm"
            >
              <Globe className="h-4 w-4 mr-2" />
              Zoom.earth Live
            </a>
          </div>
        </div>
        
        {/* Current Weather */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Thermometer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-600">{weatherData.temperature.toFixed(1)}°C</div>
            <div className="text-xs text-blue-800">Temperature</div>
            <div className="text-xs text-gray-600">Feels like {weatherData.feelsLike}°C</div>
          </div>
          
          <div className="text-center p-3 bg-cyan-50 rounded-lg">
            <Droplets className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-cyan-600">{weatherData.humidity.toFixed(0)}%</div>
            <div className="text-xs text-cyan-800">Humidity</div>
            <div className="text-xs text-gray-600">Dew point {weatherData.dewPoint}°C</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Wind className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-green-600">{weatherData.windSpeed.toFixed(0)} km/h</div>
            <div className="text-xs text-green-800">Wind Speed</div>
            <div className="text-xs text-gray-600">{weatherData.windDirection}</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Gauge className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-600">{weatherData.pressure}</div>
            <div className="text-xs text-purple-800">Pressure (hPa)</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Sun className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-orange-600">{weatherData.uvIndex}</div>
            <div className="text-xs text-orange-800">UV Index</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <EyeIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-600">{weatherData.visibility}</div>
            <div className="text-xs text-gray-800">Visibility (km)</div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">5-Day Weather Forecast</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {forecast.map((day, index) => {
              const WeatherIcon = getWeatherIcon(day.condition);
              return (
                <div key={index} className="text-center p-3 bg-white rounded-lg">
                  <div className="font-medium text-gray-900 mb-2">{day.day}</div>
                  <WeatherIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600 mb-1">{day.condition}</div>
                  <div className="text-sm font-bold text-gray-900">{day.high}° / {day.low}°</div>
                  <div className="text-xs text-blue-600">{day.precipitation}% rain</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weather Alerts */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Weather Advisory
          </h4>
          <p className="text-sm text-yellow-700">
            Current weather conditions are favorable. Monitor for potential changes in the next 24 hours. 
            High humidity levels may affect outdoor emergency operations.
          </p>
        </div>
      </div>

      {/* Google Maps Integration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Emergency Response Map
          </h3>
          <div className="flex items-center space-x-2">
            <button className="text-orange-600 hover:text-orange-800 flex items-center text-sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh Map
            </button>
          </div>
        </div>
        
        {/* Simulated Google Maps Interface */}
        <div className="bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
          <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">Barangay Emergency Map</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span>Zoom: 15</span>
              <span>|</span>
              <span>Satellite</span>
            </div>
          </div>
          
          <div className="relative h-96 bg-green-100">
            {/* Simulated map with evacuation sites */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-green-300">
              {/* Barangay boundary simulation */}
              <div className="absolute inset-4 border-4 border-dashed border-blue-600 rounded-lg bg-green-50 bg-opacity-50">
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                  {systemSettings.barangayName}
                </div>
                
                {/* Evacuation site markers */}
                {evacuationSites.map((site, index) => (
                  <div
                    key={site.id}
                    className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform ${
                      site.status === 'operational' ? 'bg-green-500' :
                      site.status === 'standby' ? 'bg-yellow-500' :
                      site.status === 'full' ? 'bg-red-500' : 'bg-gray-500'
                    }`}
                    style={{
                      top: `${20 + index * 25}%`,
                      left: `${15 + index * 20}%`
                    }}
                    title={site.name}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                      {site.name}
                    </div>
                  </div>
                ))}
                
                {/* Legend */}
                <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg">
                  <h5 className="font-semibold text-gray-900 mb-2 text-sm">Evacuation Sites</h5>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Operational</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Standby</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Full/Unavailable</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map Controls */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">
            Show Flood Areas
          </button>
          <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200">
            Emergency Routes
          </button>
          <button className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm hover:bg-purple-200">
            Resource Locations
          </button>
          <button className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200">
            Risk Areas
          </button>
        </div>
      </div>

      {/* Evacuation Sites Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evacuation Sites Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {evacuationSites.map((site) => (
            <div key={site.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{site.name}</h4>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(site.status)}`}>
                  {site.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{site.address}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{site.currentOccupancy}/{site.capacity} capacity</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{site.contactNumber}</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      site.currentOccupancy / site.capacity > 0.8 ? 'bg-red-500' :
                      site.currentOccupancy / site.capacity > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(site.currentOccupancy / site.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Network Integration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Radio className="h-5 w-5 mr-2" />
          Emergency Response Network
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Emergency Hotlines</h4>
            <div className="space-y-1 text-sm text-red-700">
              <p>🚨 National Emergency: 911</p>
              <p>🚒 Fire Department: 116</p>
              <p>🚑 Medical Emergency: 117</p>
              <p>☎️ Barangay Emergency: {systemSettings.contactNumber}</p>
              <p>🌊 Flood Control: +63 2 8911 1234</p>
              <p>⛑️ Rescue Team: +63 2 8922 2345</p>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Coordination Centers</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <p>🏛️ NDRRMC Regional: +63 2 8933 3456</p>
              <p>🏢 City Disaster Office: +63 2 8944 4567</p>
              <p>📡 Communication Hub: +63 2 8955 5678</p>
              <p>🚁 Air Support: +63 2 8966 6789</p>
              <p>🚢 Coast Guard: +63 2 8977 7890</p>
              <p>⚡ Power Company: +63 2 8988 8901</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Alerts Management</h2>
        <button 
          onClick={() => setShowAlertForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Issue Alert
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-600">{emergencyAlerts.filter(a => a.severity === 'critical').length}</p>
            </div>
            <Siren className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-orange-600">{emergencyAlerts.filter(a => a.severity === 'high').length}</p>
            </div>
            <Bell className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-yellow-600">{emergencyAlerts.filter(a => a.status === 'active').length}</p>
            </div>
            <Activity className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-blue-600">{emergencyAlerts.length}</p>
            </div>
            <Megaphone className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          {emergencyAlerts.map((alert) => (
            <div key={alert.id} className={`p-4 border rounded-lg ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Bell className="h-5 w-5" />
                    <span className="font-semibold">{alert.title}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                      {alert.type.toUpperCase()}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm mb-3">{alert.message}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="font-medium">Issued:</span> {alert.issuedAt}
                    </div>
                    <div>
                      <span className="font-medium">Expires:</span> {alert.expiresAt}
                    </div>
                    <div>
                      <span className="font-medium">Areas:</span> {alert.affectedAreas.join(', ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEvacuation = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Evacuation Management</h2>
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
              <p className="text-2xl font-bold text-green-600">{evacuationSites.reduce((sum, site) => sum + site.capacity, 0)}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Occupancy</p>
              <p className="text-2xl font-bold text-blue-600">{evacuationSites.reduce((sum, site) => sum + site.currentOccupancy, 0)}</p>
            </div>
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Space</p>
              <p className="text-2xl font-bold text-purple-600">
                {evacuationSites.reduce((sum, site) => sum + (site.capacity - site.currentOccupancy), 0)}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evacuation Sites</h3>
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
                    <div>
                      <div className="text-sm font-medium text-gray-900">{site.name}</div>
                      <div className="text-sm text-gray-500">{site.address}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{site.capacity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {site.currentOccupancy} ({((site.currentOccupancy / site.capacity) * 100).toFixed(1)}%)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(site.status)}`}>
                      {site.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{site.contactNumber}</td>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Resources</p>
              <p className="text-2xl font-bold text-green-600">{emergencyResources.filter(r => r.status === 'available').length}</p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{emergencyResources.filter(r => r.status === 'low').length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{emergencyResources.filter(r => r.status === 'out').length}</p>
            </div>
            <X className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {emergencyResources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resource.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.quantity} {resource.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      resource.status === 'available' ? 'bg-green-100 text-green-800' :
                      resource.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {resource.status}
                    </span>
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

  const renderPlanning = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Emergency Planning</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-red-800 font-medium">Flood Risk</span>
              <span className="text-red-600 font-bold">HIGH</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-800 font-medium">Fire Risk</span>
              <span className="text-yellow-600 font-bold">MEDIUM</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-green-800 font-medium">Earthquake Risk</span>
              <span className="text-green-600 font-bold">LOW</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Drills</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">Fire Drill</p>
                <p className="text-sm text-blue-700">Last conducted: March 1, 2024</p>
              </div>
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-900">Earthquake Drill</p>
                <p className="text-sm text-green-700">Last conducted: February 15, 2024</p>
              </div>
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Response Protocols</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Flood Response</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>1. Monitor water levels</li>
              <li>2. Issue early warnings</li>
              <li>3. Activate evacuation sites</li>
              <li>4. Deploy rescue teams</li>
            </ul>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Fire Response</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>1. Alert fire department</li>
              <li>2. Evacuate affected areas</li>
              <li>3. Secure perimeter</li>
              <li>4. Provide medical aid</li>
            </ul>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Medical Emergency</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>1. Assess situation</li>
              <li>2. Call medical team</li>
              <li>3. Provide first aid</li>
              <li>4. Transport to hospital</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'alerts', label: 'Emergency Alerts', icon: Bell },
    { id: 'evacuation', label: 'Evacuation Sites', icon: MapPin },
    { id: 'resources', label: 'Resources', icon: Shield },
    { id: 'planning', label: 'Emergency Planning', icon: Calendar },
    { id: 'weather', label: 'Weather Monitor', icon: Cloud }
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
                  Disaster Management Portal
                </h1>
                <p className="text-orange-100 mt-2 text-sm sm:text-base">NDRRMC Emergency Response & Planning System</p>
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
        {activeTab === 'weather' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Cloud className="h-6 w-6 mr-2" />
                Advanced Weather Monitoring
              </h2>
              <div className="flex items-center space-x-4">
                <button className="text-orange-600 hover:text-orange-800 flex items-center text-sm">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Auto-refresh: ON
                </button>
                <a
                  href="https://zoom.earth/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Satellite className="h-4 w-4 mr-2" />
                  Zoom.earth Live Weather
                </a>
              </div>
            </div>
            
            {/* Detailed Weather Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">Current Conditions</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Temperature:</span>
                      <span className="font-bold ml-2">{weatherData.temperature.toFixed(1)}°C</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Feels Like:</span>
                      <span className="font-bold ml-2">{weatherData.feelsLike}°C</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Humidity:</span>
                      <span className="font-bold ml-2">{weatherData.humidity.toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Dew Point:</span>
                      <span className="font-bold ml-2">{weatherData.dewPoint}°C</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Wind:</span>
                      <span className="font-bold ml-2">{weatherData.windSpeed.toFixed(0)} km/h {weatherData.windDirection}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Pressure:</span>
                      <span className="font-bold ml-2">{weatherData.pressure} hPa</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3">Emergency Weather Thresholds</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Wind Speed Alert:</span>
                      <span className="font-bold">60+ km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Heavy Rain Alert:</span>
                      <span className="font-bold">50+ mm/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Temperature Alert:</span>
                      <span className="font-bold">35+ °C</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-3">Weather Data Sources</h3>
                  <div className="space-y-2">
                    <a
                      href="https://zoom.earth/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-2 bg-white rounded border hover:bg-gray-50"
                    >
                      <Satellite className="h-5 w-5 text-purple-600 mr-3" />
                      <div>
                        <div className="font-medium text-purple-900">Zoom.earth</div>
                        <div className="text-xs text-purple-700">Live satellite imagery & weather radar</div>
                      </div>
                    </a>
                    
                    <div className="flex items-center p-2 bg-white rounded border">
                      <Radar className="h-5 w-5 text-purple-600 mr-3" />
                      <div>
                        <div className="font-medium text-purple-900">Local Weather Station</div>
                        <div className="text-xs text-purple-700">Real-time local measurements</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-2 bg-white rounded border">
                      <Globe className="h-5 w-5 text-purple-600 mr-3" />
                      <div>
                        <div className="font-medium text-purple-900">PAGASA</div>
                        <div className="text-xs text-purple-700">Official weather forecasts</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-3">Weather Alerts</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-yellow-800">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span>Monitor for potential thunderstorms</span>
                    </div>
                    <div className="flex items-center text-yellow-800">
                      <Droplets className="h-4 w-4 mr-2" />
                      <span>High humidity may affect visibility</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alert Form Modal */}
      {showAlertForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
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
                  <select
                    value={newAlert.type}
                    onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="weather">Weather</option>
                    <option value="evacuation">Evacuation</option>
                    <option value="emergency">Emergency</option>
                    <option value="health">Health</option>
                    <option value="update">Update</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select
                    value={newAlert.severity}
                    onChange={(e) => setNewAlert({...newAlert, severity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Title</label>
                <input
                  type="text"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter alert title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Message</label>
                <textarea
                  value={newAlert.message}
                  onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter detailed alert message"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
                <input
                  type="datetime-local"
                  value={newAlert.expiresAt}
                  onChange={(e) => setNewAlert({...newAlert, expiresAt: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAlertForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAlert}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
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