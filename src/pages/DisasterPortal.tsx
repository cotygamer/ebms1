import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  AlertTriangle, 
  Shield, 
  Radio, 
  MapPin, 
  Users, 
  Activity,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  LogOut,
  Bell,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  X,
  Save,
  Zap,
  Cloud,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  CloudRain,
  Navigation,
  Home,
  Building2,
  Car,
  Truck,
  Ambulance,
  Target,
  Megaphone,
  FileText,
  BarChart3
} from 'lucide-react';

const DisasterPortal: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [showEvacuationForm, setShowEvacuationForm] = useState(false);
  const [showIncidentForm, setShowIncidentForm] = useState(false);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'weather',
      title: 'Heavy Rainfall Warning',
      message: 'Heavy rainfall expected in the next 24 hours. Residents in low-lying areas should be prepared.',
      priority: 'high' as 'low' | 'medium' | 'high',
      status: 'active',
      date: '2024-03-20',
      time: '14:30',
      affectedAreas: ['Zone 1', 'Zone 2']
    },
    {
      id: 2,
      type: 'flood',
      title: 'Flood Advisory',
      message: 'Rising water levels in Main Creek. Monitor conditions closely.',
      priority: 'medium' as 'low' | 'medium' | 'high',
      status: 'monitoring',
      date: '2024-03-19',
      time: '08:15',
      affectedAreas: ['Zone 3']
    }
  ]);

  const [evacuationCenters] = useState([
    { id: 1, name: 'Barangay Hall', capacity: 200, current: 45, status: 'operational', address: 'Main Street', contact: '+63 912 345 6789' },
    { id: 2, name: 'Community Center', capacity: 150, current: 0, status: 'standby', address: 'Center Road', contact: '+63 917 654 3210' },
    { id: 3, name: 'Elementary School', capacity: 300, current: 0, status: 'standby', address: 'School Avenue', contact: '+63 922 111 2222' }
  ]);

  const [incidents] = useState([
    { id: 1, type: 'Fire', location: 'Block 5, Lot 12', status: 'resolved', priority: 'high', date: '2024-03-18', time: '15:45', responders: 3 },
    { id: 2, type: 'Medical Emergency', location: 'Zone 2, House 45', status: 'ongoing', priority: 'high', date: '2024-03-20', time: '10:30', responders: 2 },
    { id: 3, type: 'Accident', location: 'Main Street', status: 'resolved', priority: 'medium', date: '2024-03-19', time: '12:15', responders: 4 }
  ]);

  const [newAlert, setNewAlert] = useState({
    type: 'weather',
    title: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    affectedAreas: [] as string[]
  });

  const handleLogout = () => {
    const { logout } = useAuth();
    logout();
    navigate('/');
  };

  const handleAddAlert = () => {
    if (newAlert.title && newAlert.message) {
      const alert = {
        id: Date.now(),
        ...newAlert,
        status: 'active',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      };
      setAlerts(prev => [alert, ...prev]);
      setNewAlert({
        type: 'weather',
        title: '',
        message: '',
        priority: 'medium',
        affectedAreas: []
      });
      setShowAlertForm(false);
    }
  };

  const stats = [
    { label: 'Active Alerts', value: alerts.filter(a => a.status === 'active').length.toString(), icon: AlertTriangle, color: 'bg-red-500', trend: '+2' },
    { label: 'Evacuation Centers', value: evacuationCenters.length.toString(), icon: Shield, color: 'bg-blue-500', trend: '3' },
    { label: 'Current Evacuees', value: evacuationCenters.reduce((sum, center) => sum + center.current, 0).toString(), icon: Users, color: 'bg-green-500', trend: '+45' },
    { label: 'Response Teams', value: '12', icon: Radio, color: 'bg-purple-500', trend: 'Ready' }
  ];

  const weatherData = {
    temperature: '28°C',
    humidity: '75%',
    windSpeed: '15 km/h',
    rainfall: '12mm',
    condition: 'Partly Cloudy'
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
          <Cloud className="h-5 w-5 mr-2" />
          Current Weather Conditions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Thermometer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{weatherData.temperature}</div>
            <div className="text-sm text-blue-800">Temperature</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Droplets className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{weatherData.humidity}</div>
            <div className="text-sm text-green-800">Humidity</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Wind className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{weatherData.windSpeed}</div>
            <div className="text-sm text-purple-800">Wind Speed</div>
          </div>
          
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <CloudRain className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-indigo-600">{weatherData.rainfall}</div>
            <div className="text-sm text-indigo-800">Rainfall (24h)</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Sun className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-yellow-600">{weatherData.condition}</div>
            <div className="text-sm text-yellow-800">Condition</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setShowAlertForm(true)}
            className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Issue Alert</h4>
              <p className="text-sm text-gray-600">Send emergency alert</p>
            </div>
          </button>
          
          <button
            onClick={() => setShowEvacuationForm(true)}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Evacuation</h4>
              <p className="text-sm text-gray-600">Manage evacuation</p>
            </div>
          </button>
          
          <button
            onClick={() => setShowIncidentForm(true)}
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Radio className="h-8 w-8 text-green-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Report Incident</h4>
              <p className="text-sm text-gray-600">Log new incident</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Megaphone className="h-8 w-8 text-purple-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Broadcast</h4>
              <p className="text-sm text-gray-600">Public announcement</p>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
            <button 
              onClick={() => setActiveTab('alerts')}
              className="text-orange-600 hover:text-orange-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {alerts.filter(alert => alert.status === 'active').slice(0, 3).map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                alert.priority === 'high' ? 'bg-red-50 border-red-500' :
                alert.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                'bg-blue-50 border-blue-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {alert.date} {alert.time}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                    alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evacuation Centers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Evacuation Centers</h3>
            <button 
              onClick={() => setActiveTab('evacuation')}
              className="text-orange-600 hover:text-orange-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {evacuationCenters.slice(0, 3).map((center) => (
              <div key={center.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    center.status === 'operational' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Home className={`h-5 w-5 ${
                      center.status === 'operational' ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{center.name}</p>
                    <p className="text-sm text-gray-600">
                      {center.current}/{center.capacity} occupancy
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  center.status === 'operational' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {center.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-red-50 rounded-lg">
            <Phone className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Fire Department</p>
              <p className="text-sm text-gray-600">911 / +63 2 8123 4567</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <Ambulance className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Medical Emergency</p>
              <p className="text-sm text-gray-600">911 / +63 2 8765 4321</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <Car className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Police</p>
              <p className="text-sm text-gray-600">911 / +63 2 8111 2222</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Alerts</h2>
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
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{alerts.filter(a => a.priority === 'high').length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Medium Priority</p>
              <p className="text-2xl font-bold text-yellow-600">{alerts.filter(a => a.priority === 'medium').length}</p>
            </div>
            <Bell className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-green-600">{alerts.filter(a => a.status === 'active').length}</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-blue-600">{alerts.length}</p>
            </div>
            <Radio className="h-8 w-8 text-blue-600" />
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
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
              alert.priority === 'high' ? 'bg-red-50 border-red-500' :
              alert.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
              'bg-blue-50 border-blue-500'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.type === 'weather' ? 'bg-blue-100 text-blue-800' :
                      alert.type === 'flood' ? 'bg-indigo-100 text-indigo-800' :
                      alert.type === 'fire' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {alert.type.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                      alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.priority.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {alert.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{alert.title}</h3>
                  <p className="text-gray-600 mb-3">{alert.message}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {alert.date} {alert.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {alert.affectedAreas.join(', ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
          Add Center
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-green-600">{evacuationCenters.reduce((sum, center) => sum + center.capacity, 0)}</p>
            </div>
            <Home className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Evacuees</p>
              <p className="text-2xl font-bold text-blue-600">{evacuationCenters.reduce((sum, center) => sum + center.current, 0)}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Space</p>
              <p className="text-2xl font-bold text-purple-600">
                {evacuationCenters.reduce((sum, center) => sum + (center.capacity - center.current), 0)}
              </p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evacuation Centers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evacuationCenters.map((center) => (
            <div key={center.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{center.name}</h4>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  center.status === 'operational' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {center.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Capacity:</span>
                  <span className="font-medium">{center.capacity} people</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current:</span>
                  <span className="font-medium">{center.current} people</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      (center.current / center.capacity) > 0.8 ? 'bg-red-500' :
                      (center.current / center.capacity) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(center.current / center.capacity) * 100}%` }}
                  ></div>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {center.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-1" />
                    {center.contact}
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
                    Manage
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-50">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderIncidents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Incident Management</h2>
        <button 
          onClick={() => setShowIncidentForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Report Incident
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{incidents.filter(i => i.priority === 'high').length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ongoing</p>
              <p className="text-2xl font-bold text-blue-600">{incidents.filter(i => i.status === 'ongoing').length}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{incidents.filter(i => i.status === 'resolved').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Incidents</p>
              <p className="text-2xl font-bold text-purple-600">{incidents.length}</p>
            </div>
            <Radio className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {incidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{incident.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      incident.status === 'ongoing' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      incident.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {incident.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {incident.date} {incident.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.responders}</td>
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

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'alerts', label: 'Emergency Alerts', icon: AlertTriangle },
    { id: 'evacuation', label: 'Evacuation', icon: Shield },
    { id: 'incidents', label: 'Incidents', icon: Radio },
    { id: 'resources', label: 'Resources', icon: Truck }
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
                  <AlertTriangle className="mr-3 h-8 w-8" />
                  Disaster Management Portal
                </h1>
                <p className="text-orange-100 mt-2 text-sm sm:text-base">Emergency Response & Disaster Preparedness</p>
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
        {activeTab === 'incidents' && renderIncidents()}
        {activeTab === 'resources' && (
          <div className="text-center py-12">
            <Truck className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Resource Management</h3>
            <p className="text-gray-600">Emergency resource tracking and allocation features coming soon!</p>
          </div>
        )}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type</label>
                <select
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="weather">Weather</option>
                  <option value="flood">Flood</option>
                  <option value="fire">Fire</option>
                  <option value="earthquake">Earthquake</option>
                  <option value="health">Health Emergency</option>
                  <option value="security">Security</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
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
                <input
                  type="text"
                  placeholder="Zone 1, Zone 2, etc."
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

      {/* Other modals would go here... */}
    </div>
  );
};

export default DisasterPortal;