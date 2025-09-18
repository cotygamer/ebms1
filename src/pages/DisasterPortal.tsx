import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  AlertTriangle, 
  Users, 
  Calendar, 
  FileText, 
  MapPin, 
  Activity,
  Plus,
  Search,
  Filter,
  Download,
  Bell,
  Shield,
  Radio,
  Truck,
  Heart,
  LogOut,
  ArrowLeft,
  Save,
  X,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Zap,
  Home,
  Phone,
  Mail,
  Navigation,
  Siren,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  Sun,
  Cloud,
  Layers
} from 'lucide-react';

const DisasterPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [showEvacuationForm, setShowEvacuationForm] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);
  
  const [alerts, setAlerts] = useState([
    {
      id: '1',
      title: 'Heavy Rainfall Warning',
      message: 'Heavy rainfall expected in the next 24 hours. Residents in low-lying areas should be prepared for possible flooding.',
      type: 'weather',
      priority: 'high' as 'low' | 'medium' | 'high',
      status: 'active',
      author: 'Weather Monitoring Team',
      date: '2024-03-20',
      time: '08:30 AM',
      affectedAreas: ['Zone 1', 'Zone 3', 'Riverside Area']
    },
    {
      id: '2',
      title: 'Evacuation Drill Reminder',
      message: 'Monthly evacuation drill scheduled for March 25, 2024. All residents are encouraged to participate.',
      type: 'drill',
      priority: 'medium' as 'low' | 'medium' | 'high',
      status: 'scheduled',
      author: 'Emergency Response Team',
      date: '2024-03-18',
      time: '02:00 PM',
      affectedAreas: ['All Zones']
    }
  ]);

  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    type: 'weather',
    priority: 'medium' as 'low' | 'medium' | 'high',
    affectedAreas: [] as string[]
  });

  const [evacuationCenters, setEvacuationCenters] = useState([
    { 
      id: 1, 
      name: 'Barangay Hall Main Building', 
      capacity: 200, 
      currentOccupancy: 0, 
      status: 'Available',
      address: 'Main Street, Barangay Center',
      facilities: ['Restrooms', 'Kitchen', 'Medical Station', 'Generator'],
      contact: '+63 912 345 6789'
    },
    { 
      id: 2, 
      name: 'Community Center', 
      capacity: 150, 
      currentOccupancy: 0, 
      status: 'Available',
      address: 'Community Road, Zone 2',
      facilities: ['Restrooms', 'Kitchen', 'First Aid'],
      contact: '+63 917 654 3210'
    },
    { 
      id: 3, 
      name: 'Elementary School Gymnasium', 
      capacity: 300, 
      currentOccupancy: 0, 
      status: 'Available',
      address: 'School Avenue, Zone 4',
      facilities: ['Restrooms', 'Cafeteria', 'Medical Room', 'Playground'],
      contact: '+63 920 123 4567'
    }
  ]);

  const [resources, setResources] = useState([
    { id: 1, name: 'Emergency Food Packs', quantity: 500, unit: 'packs', status: 'Available', location: 'Warehouse A' },
    { id: 2, name: 'Drinking Water', quantity: 1000, unit: 'liters', status: 'Available', location: 'Warehouse A' },
    { id: 3, name: 'Medical Supplies', quantity: 50, unit: 'kits', status: 'Available', location: 'Health Center' },
    { id: 4, name: 'Blankets', quantity: 200, unit: 'pieces', status: 'Available', location: 'Warehouse B' },
    { id: 5, name: 'Flashlights', quantity: 100, unit: 'pieces', status: 'Available', location: 'Equipment Room' },
    { id: 6, name: 'Portable Radios', quantity: 25, unit: 'pieces', status: 'Available', location: 'Communication Center' }
  ]);

  const [weatherData, setWeatherData] = useState({
    temperature: 28,
    humidity: 75,
    windSpeed: 15,
    rainfall: 2.5,
    condition: 'Partly Cloudy',
    forecast: [
      { day: 'Today', condition: 'Partly Cloudy', high: 30, low: 24, rain: 20 },
      { day: 'Tomorrow', condition: 'Rainy', high: 27, low: 22, rain: 80 },
      { day: 'Friday', condition: 'Heavy Rain', high: 25, low: 20, rain: 95 },
      { day: 'Saturday', condition: 'Cloudy', high: 28, low: 23, rain: 40 },
      { day: 'Sunday', condition: 'Sunny', high: 32, low: 25, rain: 10 }
    ]
  });

  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: 'Barangay Emergency Hotline', number: '911', type: 'Emergency' },
    { id: 2, name: 'Fire Department', number: '116', type: 'Fire' },
    { id: 3, name: 'Police Station', number: '117', type: 'Police' },
    { id: 4, name: 'Medical Emergency', number: '143', type: 'Medical' },
    { id: 5, name: 'Disaster Risk Reduction Office', number: '+63 2 8123 4567', type: 'Disaster' },
    { id: 6, name: 'Red Cross', number: '+63 2 8527 0000', type: 'Relief' }
  ]);

  const handleLogout = () => {
    try {
      // Clear any local storage data
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      // Call the logout function from auth context
      logout();
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/');
    }
    navigate('/');
  };

  const handleAddAlert = () => {
    if (newAlert.title && newAlert.message) {
      const alert = {
        id: Date.now().toString(),
        ...newAlert,
        status: 'active',
        author: user?.name || 'Disaster Management Team',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setAlerts(prev => [alert, ...prev]);
      setNewAlert({ title: '', message: '', type: 'weather', priority: 'medium', affectedAreas: [] });
      setShowAlertForm(false);
    }
  };

  const stats = [
    { label: 'Active Alerts', value: alerts.filter(a => a.status === 'active').length.toString(), icon: AlertTriangle, color: 'bg-red-500', trend: '+2 today' },
    { label: 'Evacuation Centers', value: evacuationCenters.length.toString(), icon: Home, color: 'bg-blue-500', trend: `${evacuationCenters.reduce((sum, center) => sum + center.capacity, 0)} capacity` },
    { label: 'Emergency Resources', value: resources.length.toString(), icon: Truck, color: 'bg-green-500', trend: 'All available' },
    { label: 'Response Teams', value: '8', icon: Users, color: 'bg-purple-500', trend: 'All ready' }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return CloudRain;
      case 'fire':
        return Zap;
      case 'earthquake':
        return Activity;
      case 'flood':
        return Droplets;
      case 'drill':
        return Shield;
      default:
        return AlertTriangle;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return Sun;
      case 'partly cloudy':
        return Cloud;
      case 'cloudy':
        return Cloud;
      case 'rainy':
        return CloudRain;
      case 'heavy rain':
        return CloudRain;
      default:
        return Sun;
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
                <p className="text-sm text-gray-500">{stat.trend}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weather Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Thermometer className="h-5 w-5 mr-2 text-blue-600" />
          Current Weather Conditions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Thermometer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600 mb-1">{weatherData.temperature}°C</div>
            <div className="text-sm text-blue-800">Temperature</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Droplets className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 mb-1">{weatherData.humidity}%</div>
            <div className="text-sm text-green-800">Humidity</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Wind className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600 mb-1">{weatherData.windSpeed} km/h</div>
            <div className="text-sm text-purple-800">Wind Speed</div>
          </div>
          
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <CloudRain className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-indigo-600 mb-1">{weatherData.rainfall} mm</div>
            <div className="text-sm text-indigo-800">Rainfall (24h)</div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">5-Day Forecast</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {weatherData.forecast.map((day, index) => {
              const WeatherIcon = getWeatherIcon(day.condition);
              return (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900 mb-2">{day.day}</div>
                  <WeatherIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600 mb-1">{day.condition}</div>
                  <div className="text-sm font-medium text-gray-900">{day.high}°/{day.low}°</div>
                  <div className="text-xs text-blue-600">{day.rain}% rain</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setShowAlertForm(true)}
            className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Siren className="h-8 w-8 text-red-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Issue Alert</h4>
              <p className="text-sm text-gray-600">Send emergency alert</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('evacuation')}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Home className="h-8 w-8 text-blue-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Evacuation</h4>
              <p className="text-sm text-gray-600">Manage centers</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('resources')}
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Truck className="h-8 w-8 text-green-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Resources</h4>
              <p className="text-sm text-gray-600">Check inventory</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('contacts')}
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Phone className="h-8 w-8 text-purple-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Contacts</h4>
              <p className="text-sm text-gray-600">Emergency numbers</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
          <button 
            onClick={() => setActiveTab('alerts')}
            className="text-orange-600 hover:text-orange-800 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {alerts.slice(0, 3).map((alert) => {
            const AlertIcon = getAlertIcon(alert.type);
            return (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.priority)}`}>
                <div className="flex items-start">
                  <AlertIcon className="h-5 w-5 text-gray-600 mr-3 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                        alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{alert.message}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{alert.date} at {alert.time}</span>
                      <span>Areas: {alert.affectedAreas.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Issue Alert
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-red-600">{alerts.filter(a => a.status === 'active').length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-yellow-600">{alerts.filter(a => a.status === 'scheduled').length}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weather Alerts</p>
              <p className="text-2xl font-bold text-blue-600">{alerts.filter(a => a.type === 'weather').length}</p>
            </div>
            <CloudRain className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drills</p>
              <p className="text-2xl font-bold text-green-600">{alerts.filter(a => a.type === 'drill').length}</p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search alerts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => {
            const AlertIcon = getAlertIcon(alert.type);
            return (
              <div key={alert.id} className={`p-6 rounded-lg border-l-4 ${getAlertColor(alert.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <AlertIcon className="h-6 w-6 text-gray-600 mr-4 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                            alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {alert.priority.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            alert.status === 'active' ? 'bg-green-100 text-green-800' :
                            alert.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {alert.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{alert.message}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <strong>Type:</strong> {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                        </div>
                        <div>
                          <strong>Date:</strong> {alert.date} at {alert.time}
                        </div>
                        <div>
                          <strong>Author:</strong> {alert.author}
                        </div>
                      </div>
                      <div className="mt-3">
                        <strong className="text-sm text-gray-600">Affected Areas:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {alert.affectedAreas.map((area, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderEvacuation = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Evacuation Centers</h2>
        <button 
          onClick={() => setShowEvacuationForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Center
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Home className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Centers</p>
              <p className="text-2xl font-bold text-gray-900">{evacuationCenters.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-900">{evacuationCenters.reduce((sum, center) => sum + center.capacity, 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Occupancy</p>
              <p className="text-2xl font-bold text-gray-900">{evacuationCenters.reduce((sum, center) => sum + center.currentOccupancy, 0)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {evacuationCenters.map((center) => (
          <div key={center.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{center.name}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  center.status === 'Available' ? 'bg-green-100 text-green-800' :
                  center.status === 'Occupied' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {center.status}
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {center.address}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {center.contact}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Occupancy</span>
                  <span>{center.currentOccupancy}/{center.capacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(center.currentOccupancy / center.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Facilities</h4>
                <div className="flex flex-wrap gap-1">
                  {center.facilities.map((facility, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
                  View Details
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Resources</h2>
        <button 
          onClick={() => setShowResourceForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Resources</p>
              <p className="text-2xl font-bold text-gray-900">{resources.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">{resources.filter(r => r.status === 'Available').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
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
              {resources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {resource.quantity} {resource.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      resource.status === 'Available' ? 'bg-green-100 text-green-800' :
                      resource.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
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
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
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

  const renderContacts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Contacts</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emergencyContacts.map((contact) => (
          <div key={contact.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                contact.type === 'Emergency' ? 'bg-red-100 text-red-800' :
                contact.type === 'Fire' ? 'bg-orange-100 text-orange-800' :
                contact.type === 'Police' ? 'bg-blue-100 text-blue-800' :
                contact.type === 'Medical' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {contact.type}
              </span>
            </div>
            
            <div className="flex items-center mb-4">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-lg font-mono text-gray-900">{contact.number}</span>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 flex items-center justify-center">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Emergency Protocol</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• For life-threatening emergencies, call 911 immediately</li>
              <li>• For fire emergencies, call 116 (Fire Department)</li>
              <li>• For police assistance, call 117</li>
              <li>• For medical emergencies, call 143</li>
              <li>• Always provide clear location and nature of emergency</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'alerts', label: 'Alerts & Warnings', icon: AlertTriangle },
    { id: 'evacuation', label: 'Evacuation Centers', icon: Home },
    { id: 'resources', label: 'Emergency Resources', icon: Truck },
    { id: 'contacts', label: 'Emergency Contacts', icon: Phone },
    { id: 'operations-map', label: 'Operations Map', icon: Layers }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              {user?.role === 'barangay-official' && (
                <Link
                  to="/barangay-official-dashboard"
                  className="text-orange-200 hover:text-white flex items-center"
                >
                  <ArrowLeft className="h-6 w-6" />
                  <span className="ml-2 hidden sm:inline">Back</span>
                </Link>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                  <Shield className="mr-3 h-8 w-8" />
                  Disaster Management Portal
                </h1>
                <p className="text-orange-100 mt-2 text-sm sm:text-base">Emergency Planning & Response Operations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-orange-100 text-sm">Welcome, {user?.name}</p>
                <p className="text-xs text-orange-200 capitalize">{user?.role?.replace('-', ' ')}</p>
              </div>
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
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
        {activeTab === 'contacts' && renderContacts()}
        {activeTab === 'operations-map' && <LiveOperationsMap />}
      </div>

      {/* Alert Form Modal */}
      {showAlertForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={newAlert.message}
                  onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter alert message"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type</label>
                <select
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="weather">Weather</option>
                  <option value="fire">Fire</option>
                  <option value="earthquake">Earthquake</option>
                  <option value="flood">Flood</option>
                  <option value="drill">Emergency Drill</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                <select
                  value={newAlert.priority}
                  onChange={(e) => setNewAlert({...newAlert, priority: e.target.value as 'low' | 'medium' | 'high'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Affected Areas</label>
                <div className="space-y-2">
                  {['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Riverside Area', 'All Zones'].map((area) => (
                    <label key={area} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newAlert.affectedAreas.includes(area)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewAlert({...newAlert, affectedAreas: [...newAlert.affectedAreas, area]});
                          } else {
                            setNewAlert({...newAlert, affectedAreas: newAlert.affectedAreas.filter(a => a !== area)});
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{area}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAlertForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAlert}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Issue Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Live Operations Map Component
const LiveOperationsMap: React.FC = () => {
  const { systemSettings } = useData();
  const [mapData, setMapData] = useState({
    incidents: [
      { id: 1, type: 'flood', location: { lat: 14.5995, lng: 120.9842 }, severity: 'high', status: 'active', description: 'Flooding in Zone 1' },
      { id: 2, type: 'fire', location: { lat: 14.6010, lng: 120.9850 }, severity: 'medium', status: 'contained', description: 'House fire reported' },
      { id: 3, type: 'medical', location: { lat: 14.5980, lng: 120.9835 }, severity: 'high', status: 'responding', description: 'Medical emergency' }
    ],
    resources: [
      { id: 1, type: 'ambulance', location: { lat: 14.5990, lng: 120.9845 }, status: 'available', unit: 'AMB-001' },
      { id: 2, type: 'fire-truck', location: { lat: 14.6000, lng: 120.9840 }, status: 'deployed', unit: 'FT-002' },
      { id: 3, type: 'rescue-team', location: { lat: 14.5985, lng: 120.9838 }, status: 'available', unit: 'RT-003' }
    ],
    evacuationRoutes: [
      { id: 1, from: { lat: 14.5995, lng: 120.9842 }, to: { lat: 14.6020, lng: 120.9860 }, status: 'clear' },
      { id: 2, from: { lat: 14.6010, lng: 120.9850 }, to: { lat: 14.6030, lng: 120.9870 }, status: 'blocked' }
    ]
  });
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 14.5995, lng: 120.9842 });
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMapData(prev => ({
        ...prev,
        incidents: prev.incidents.map(incident => ({
          ...incident,
          // Simulate status changes
          status: Math.random() > 0.8 ? 
            (incident.status === 'active' ? 'responding' : 
             incident.status === 'responding' ? 'contained' : incident.status) : 
            incident.status
        }))
      }));
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'flood': return '🌊';
      case 'fire': return '🔥';
      case 'medical': return '🚑';
      case 'earthquake': return '🌍';
      default: return '⚠️';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'ambulance': return '🚑';
      case 'fire-truck': return '🚒';
      case 'rescue-team': return '👥';
      case 'police': return '🚔';
      default: return '🚐';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-100';
      case 'responding': return 'text-blue-600 bg-blue-100';
      case 'contained': return 'text-green-600 bg-green-100';
      case 'available': return 'text-green-600 bg-green-100';
      case 'deployed': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Live Operations Map</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Live</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Display */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-96 bg-gray-100 relative">
              {systemSettings.googleMapsApiKey ? (
                <div className="w-full h-full relative">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/view?key=${systemSettings.googleMapsApiKey}&center=${mapCenter.lat},${mapCenter.lng}&zoom=15`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                  
                  {/* Overlay markers for incidents and resources */}
                  <div className="absolute inset-0 pointer-events-none">
                    {mapData.incidents.map((incident, index) => (
                      <div
                        key={incident.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
                        style={{
                          left: `${50 + (index * 10)}%`,
                          top: `${40 + (index * 5)}%`
                        }}
                        onClick={() => setSelectedIncident(incident)}
                      >
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${getSeverityColor(incident.severity)} border-2 border-white shadow-lg`}>
                          {getIncidentIcon(incident.type)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
                  <div className="text-center">
                    <Layers className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Operations Map</h3>
                    <p className="text-gray-600 mb-4">Configure Google Maps API key in System Settings to enable live map</p>
                    
                    {/* Simulated map with incident markers */}
                    <div className="relative w-full max-w-md mx-auto h-48 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="absolute inset-4">
                        {mapData.incidents.map((incident, index) => (
                          <div
                            key={incident.id}
                            className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer ${getSeverityColor(incident.severity)} border-2 border-white shadow`}
                            style={{
                              left: `${20 + (index * 25)}%`,
                              top: `${30 + (index * 15)}%`
                            }}
                            onClick={() => setSelectedIncident(incident)}
                            title={incident.description}
                          >
                            {getIncidentIcon(incident.type)}
                          </div>
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">Barangay Operations Area</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="space-y-4">
          {/* Active Incidents */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              Active Incidents ({mapData.incidents.filter(i => i.status === 'active').length})
            </h3>
            <div className="space-y-2">
              {mapData.incidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`p-2 rounded border cursor-pointer hover:bg-gray-50 ${
                    selectedIncident?.id === incident.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedIncident(incident)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{getIncidentIcon(incident.type)} {incident.type.toUpperCase()}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{incident.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Available Resources */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Truck className="h-5 w-5 text-green-600 mr-2" />
              Resources ({mapData.resources.filter(r => r.status === 'available').length} available)
            </h3>
            <div className="space-y-2">
              {mapData.resources.map((resource) => (
                <div key={resource.id} className="p-2 rounded border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{getResourceIcon(resource.type)} {resource.unit}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(resource.status)}`}>
                      {resource.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 capitalize">{resource.type.replace('-', ' ')}</p>
                </div>
              ))}
            </div>
          {/* Map Controls */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Map Controls</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                📍 Center on Barangay
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100">
                🚨 Show All Incidents
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100">
                🚐 Show Resources
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded hover:bg-purple-100">
                🛣️ Evacuation Routes
              </button>
            </div>
          </div>
        </div>
      </div>
          </div>
      {/* Incident Details Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                {getIncidentIcon(selectedIncident.type)}
                <span className="ml-2 capitalize">{selectedIncident.type} Incident</span>
              </h3>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="text-gray-900">{selectedIncident.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Severity</label>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getSeverityColor(selectedIncident.severity)}`}>
                    {selectedIncident.severity.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getStatusColor(selectedIncident.status)}`}>
                    {selectedIncident.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <p className="text-gray-900">
                  {selectedIncident.location.lat.toFixed(4)}°N, {selectedIncident.location.lng.toFixed(4)}°E
                </p>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Dispatch Resources
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700">
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisasterPortal;