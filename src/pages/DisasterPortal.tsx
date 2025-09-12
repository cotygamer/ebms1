import React, { useState, useEffect } from 'react';
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
  BarChart3,
  Send,
  Volume2,
  Siren,
  Map,
  Compass,
  Route,
  Timer,
  UserCheck,
  AlertCircle,
  Info,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Globe,
  Satellite
} from 'lucide-react';

const DisasterPortal: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [showEvacuationForm, setShowEvacuationForm] = useState(false);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'weather',
      title: 'Heavy Rainfall Warning',
      message: 'Heavy rainfall expected in the next 24 hours. Residents in low-lying areas should be prepared for possible flooding.',
      priority: 'high' as 'low' | 'medium' | 'high',
      status: 'active',
      date: '2024-03-20',
      time: '14:30',
      affectedAreas: ['Zone 1', 'Zone 2', 'Zone 3'],
      estimatedDuration: '24 hours',
      responseTeams: ['Emergency Response Team A', 'Flood Control Unit'],
      evacuationRecommended: true
    },
    {
      id: 2,
      type: 'flood',
      title: 'Flood Advisory - Main Creek',
      message: 'Rising water levels detected in Main Creek. Residents near the creek should monitor conditions and be ready to evacuate if necessary.',
      priority: 'medium' as 'low' | 'medium' | 'high',
      status: 'monitoring',
      date: '2024-03-19',
      time: '08:15',
      affectedAreas: ['Zone 3', 'Riverside Area'],
      estimatedDuration: '12 hours',
      responseTeams: ['Flood Monitoring Team'],
      evacuationRecommended: false
    },
    {
      id: 3,
      type: 'fire',
      title: 'Fire Incident - Resolved',
      message: 'House fire at Block 5 has been successfully extinguished. No casualties reported. Area is now safe.',
      priority: 'high' as 'low' | 'medium' | 'high',
      status: 'resolved',
      date: '2024-03-18',
      time: '15:45',
      affectedAreas: ['Block 5'],
      estimatedDuration: 'Resolved',
      responseTeams: ['Fire Department', 'Medical Team', 'Security'],
      evacuationRecommended: false
    }
  ]);

  const [evacuationCenters, setEvacuationCenters] = useState([
    { 
      id: 1, 
      name: 'Barangay Hall Main Building', 
      capacity: 200, 
      current: 45, 
      status: 'operational', 
      address: 'Main Street, Barangay Center', 
      contact: '+63 912 345 6789',
      facilities: ['Restrooms', 'Kitchen', 'Medical Station', 'WiFi'],
      coordinator: 'Maria Santos',
      lastUpdated: '2024-03-20 14:30'
    },
    { 
      id: 2, 
      name: 'Community Center Gymnasium', 
      capacity: 150, 
      current: 0, 
      status: 'standby', 
      address: 'Center Road, Zone 2', 
      contact: '+63 917 654 3210',
      facilities: ['Restrooms', 'Kitchen', 'First Aid'],
      coordinator: 'Juan Dela Cruz',
      lastUpdated: '2024-03-20 12:00'
    },
    { 
      id: 3, 
      name: 'San Miguel Elementary School', 
      capacity: 300, 
      current: 0, 
      status: 'standby', 
      address: 'School Avenue, Zone 4', 
      contact: '+63 922 111 2222',
      facilities: ['Restrooms', 'Classrooms', 'Playground', 'Cafeteria'],
      coordinator: 'Ana Garcia',
      lastUpdated: '2024-03-20 10:15'
    }
  ]);

  const [incidents, setIncidents] = useState([
    { 
      id: 1, 
      type: 'Fire', 
      location: 'Block 5, Lot 12', 
      status: 'resolved', 
      priority: 'high', 
      date: '2024-03-18', 
      time: '15:45', 
      responders: 3,
      description: 'House fire caused by electrical malfunction',
      casualties: 0,
      damages: 'Partial house damage',
      responseTime: '8 minutes'
    },
    { 
      id: 2, 
      type: 'Medical Emergency', 
      location: 'Zone 2, House 45', 
      status: 'ongoing', 
      priority: 'high', 
      date: '2024-03-20', 
      time: '10:30', 
      responders: 2,
      description: 'Elderly resident experiencing chest pains',
      casualties: 0,
      damages: 'None',
      responseTime: '5 minutes'
    },
    { 
      id: 3, 
      type: 'Traffic Accident', 
      location: 'Main Street Intersection', 
      status: 'resolved', 
      priority: 'medium', 
      date: '2024-03-19', 
      time: '12:15', 
      responders: 4,
      description: 'Minor vehicle collision, no injuries',
      casualties: 0,
      damages: 'Minor vehicle damage',
      responseTime: '12 minutes'
    }
  ]);

  const [emergencyContacts] = useState([
    { category: 'Fire Department', number: '911', alternate: '+63 2 8123 4567', available: '24/7' },
    { category: 'Medical Emergency', number: '911', alternate: '+63 2 8765 4321', available: '24/7' },
    { category: 'Police', number: '911', alternate: '+63 2 8111 2222', available: '24/7' },
    { category: 'Barangay Emergency', number: '+63 912 345 6789', alternate: '+63 917 654 3210', available: '24/7' },
    { category: 'Red Cross', number: '143', alternate: '+63 2 8527 0000', available: '24/7' },
    { category: 'NDRRMC', number: '+63 2 8911 1406', alternate: '+63 2 8912 2665', available: '24/7' }
  ]);

  const [newAlert, setNewAlert] = useState({
    type: 'weather',
    title: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    affectedAreas: [] as string[],
    estimatedDuration: '',
    evacuationRecommended: false,
    responseTeams: [] as string[]
  });

  const [weatherData, setWeatherData] = useState({
    temperature: '28°C',
    humidity: '75%',
    windSpeed: '15 km/h',
    windDirection: 'NE',
    rainfall: '12mm',
    pressure: '1013 hPa',
    visibility: '10 km',
    condition: 'Partly Cloudy',
    lastUpdated: new Date().toLocaleString()
  });

  const [systemStatus] = useState({
    communicationSystems: {
      radio: 'operational',
      internet: 'operational',
      mobile: 'operational',
      satellite: 'standby'
    },
    emergencyEquipment: {
      generators: 'operational',
      vehicles: 'operational',
      medicalSupplies: 'adequate',
      communicationDevices: 'operational'
    },
    personnel: {
      onDuty: 12,
      available: 8,
      training: 2,
      total: 22
    }
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
        affectedAreas: [],
        estimatedDuration: '',
        evacuationRecommended: false,
        responseTeams: []
      });
      setShowAlertForm(false);
    }
  };

  const handleBroadcastAlert = (alertId: number) => {
    // Simulate broadcasting alert to all residents
    alert(`Broadcasting alert to all residents via SMS, email, and mobile app notifications...`);
  };

  const stats = [
    { label: 'Active Alerts', value: alerts.filter(a => a.status === 'active').length.toString(), icon: AlertTriangle, color: 'bg-red-500', trend: '+2' },
    { label: 'Evacuation Centers', value: evacuationCenters.length.toString(), icon: Shield, color: 'bg-blue-500', trend: '3' },
    { label: 'Current Evacuees', value: evacuationCenters.reduce((sum, center) => sum + center.current, 0).toString(), icon: Users, color: 'bg-green-500', trend: '+45' },
    { label: 'Response Teams', value: systemStatus.personnel.onDuty.toString(), icon: Radio, color: 'bg-purple-500', trend: 'Ready' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Emergency Status Banner */}
      {alerts.filter(a => a.status === 'active' && a.priority === 'high').length > 0 && (
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Siren className="h-6 w-6 mr-3 animate-pulse" />
              <div>
                <h3 className="font-bold">HIGH PRIORITY EMERGENCY ACTIVE</h3>
                <p className="text-red-100">
                  {alerts.filter(a => a.status === 'active' && a.priority === 'high').length} high priority alert(s) require immediate attention
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('alerts')}
              className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
            >
              View Alerts
            </button>
          </div>
        </div>
      )}

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

      {/* System Status Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          System Status Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Communication Systems */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
              <Radio className="h-4 w-4 mr-2" />
              Communication Systems
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Radio Network</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Internet</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Mobile Network</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Satellite Backup</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-xs text-yellow-600">Standby</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Equipment */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Emergency Equipment
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Generators</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600">Ready</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Emergency Vehicles</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600">Ready</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Medical Supplies</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600">Adequate</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Communication Devices</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600">Operational</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personnel Status */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Personnel Status
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700">On Duty</span>
                <span className="text-sm font-semibold text-purple-800">{systemStatus.personnel.onDuty}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700">Available</span>
                <span className="text-sm font-semibold text-purple-800">{systemStatus.personnel.available}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700">In Training</span>
                <span className="text-sm font-semibold text-purple-800">{systemStatus.personnel.training}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700">Total Staff</span>
                <span className="text-sm font-semibold text-purple-800">{systemStatus.personnel.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Cloud className="h-5 w-5 mr-2" />
            Current Weather Conditions
          </h3>
          <div className="text-sm text-gray-500">
            Last updated: {weatherData.lastUpdated}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Thermometer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-600">{weatherData.temperature}</div>
            <div className="text-xs text-blue-800">Temperature</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Droplets className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-green-600">{weatherData.humidity}</div>
            <div className="text-xs text-green-800">Humidity</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Wind className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-600">{weatherData.windSpeed}</div>
            <div className="text-xs text-purple-800">Wind Speed</div>
          </div>
          
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <Compass className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-indigo-600">{weatherData.windDirection}</div>
            <div className="text-xs text-indigo-800">Wind Direction</div>
          </div>
          
          <div className="text-center p-4 bg-cyan-50 rounded-lg">
            <CloudRain className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-cyan-600">{weatherData.rainfall}</div>
            <div className="text-xs text-cyan-800">Rainfall (24h)</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Target className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-600">{weatherData.pressure}</div>
            <div className="text-xs text-gray-800">Pressure</div>
          </div>
          
          <div className="text-center p-4 bg-teal-50 rounded-lg">
            <Eye className="h-8 w-8 text-teal-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-teal-600">{weatherData.visibility}</div>
            <div className="text-xs text-teal-800">Visibility</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Sun className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-yellow-600">{weatherData.condition}</div>
            <div className="text-xs text-yellow-800">Condition</div>
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
          
          <button
            onClick={() => setShowBroadcastForm(true)}
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
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
                    <p className="text-sm text-gray-600 mt-1">{alert.message.substring(0, 100)}...</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {alert.date} {alert.time}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                      alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.priority.toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleBroadcastAlert(alert.id)}
                      className="text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700"
                    >
                      Broadcast
                    </button>
                  </div>
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
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    center.status === 'operational' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {center.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((center.current / center.capacity) * 100)}% full
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Phone className="h-5 w-5 mr-2" />
          Emergency Contacts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="flex items-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{contact.category}</p>
                <p className="text-sm text-red-600 font-mono">{contact.number}</p>
                <p className="text-xs text-gray-600">{contact.alternate}</p>
                <p className="text-xs text-green-600">{contact.available}</p>
              </div>
              <button className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700">
                <Phone className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Incidents Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Incidents Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{incidents.filter(i => i.priority === 'high').length}</div>
            <div className="text-sm text-red-800">High Priority</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Activity className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{incidents.filter(i => i.status === 'ongoing').length}</div>
            <div className="text-sm text-blue-800">Ongoing</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{incidents.filter(i => i.status === 'resolved').length}</div>
            <div className="text-sm text-green-800">Resolved Today</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Alert Management</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowBroadcastForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
          >
            <Megaphone className="h-4 w-4 mr-2" />
            Broadcast
          </button>
          <button 
            onClick={() => setShowAlertForm(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Issue Alert
          </button>
        </div>
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
            <div key={alert.id} className={`p-6 rounded-lg border-l-4 ${
              alert.priority === 'high' ? 'bg-red-50 border-red-500' :
              alert.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
              'bg-blue-50 border-blue-500'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      alert.type === 'weather' ? 'bg-blue-100 text-blue-800' :
                      alert.type === 'flood' ? 'bg-indigo-100 text-indigo-800' :
                      alert.type === 'fire' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {alert.type.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                      alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.priority.toUpperCase()} PRIORITY
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      alert.status === 'active' ? 'bg-green-100 text-green-800' : 
                      alert.status === 'monitoring' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {alert.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{alert.title}</h3>
                  <p className="text-gray-600 mb-3">{alert.message}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <div className="flex items-center mb-1">
                        <Clock className="h-4 w-4 mr-2" />
                        <span><strong>Time:</strong> {alert.date} {alert.time}</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <Timer className="h-4 w-4 mr-2" />
                        <span><strong>Duration:</strong> {alert.estimatedDuration}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span><strong>Areas:</strong> {alert.affectedAreas.join(', ')}</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <Users className="h-4 w-4 mr-2" />
                        <span><strong>Teams:</strong> {alert.responseTeams?.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {alert.evacuationRecommended && (
                    <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded text-sm text-red-800">
                      <strong>⚠️ EVACUATION RECOMMENDED</strong> - Residents in affected areas should prepare to evacuate
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleBroadcastAlert(alert.id)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
        <h2 className="text-2xl font-bold text-gray-900">Evacuation Center Management</h2>
        <button 
          onClick={() => setShowEvacuationForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Center
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.round((evacuationCenters.reduce((sum, center) => sum + center.current, 0) / 
                evacuationCenters.reduce((sum, center) => sum + center.capacity, 0)) * 100)}%
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evacuation Centers</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {evacuationCenters.map((center) => (
            <div key={center.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{center.name}</h4>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  center.status === 'operational' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {center.status.toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Capacity:</span>
                  <span className="font-medium">{center.capacity} people</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Occupancy:</span>
                  <span className="font-medium">{center.current} people</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      (center.current / center.capacity) > 0.8 ? 'bg-red-500' :
                      (center.current / center.capacity) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((center.current / center.capacity) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <div className="text-xs text-gray-500 text-center">
                  {Math.round((center.current / center.capacity) * 100)}% occupied
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {center.address}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {center.contact}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Coordinator: {center.coordinator}
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Available Facilities:</h5>
                  <div className="flex flex-wrap gap-1">
                    {center.facilities.map((facility, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                    Manage
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-50 transition-colors">
                    Contact
                  </button>
                </div>
                
                <div className="text-xs text-gray-500 text-center pt-2">
                  Last updated: {center.lastUpdated}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evacuation Routes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Route className="h-5 w-5 mr-2" />
          Evacuation Routes & Procedures
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3">Primary Evacuation Routes</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• <strong>Zone 1-2:</strong> Main Street → Barangay Hall</li>
              <li>• <strong>Zone 3-4:</strong> Center Road → Community Center</li>
              <li>• <strong>Zone 5-6:</strong> School Avenue → Elementary School</li>
              <li>• <strong>Riverside:</strong> Creek Road → Higher Ground (Zone 7)</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-3">Emergency Procedures</h4>
            <ol className="text-sm text-green-700 space-y-2">
              <li>1. <strong>Alert Reception:</strong> Listen for emergency sirens/announcements</li>
              <li>2. <strong>Preparation:</strong> Gather emergency kit and important documents</li>
              <li>3. <strong>Evacuation:</strong> Follow designated routes to nearest center</li>
              <li>4. <strong>Registration:</strong> Check in at evacuation center</li>
              <li>5. <strong>Communication:</strong> Inform family/relatives of your status</li>
            </ol>
          </div>
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
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-purple-600">8.3</p>
              <p className="text-xs text-purple-600">minutes</p>
            </div>
            <Timer className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
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
                    {incident.date}<br />
                    <span className="text-xs text-gray-500">{incident.time}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.responseTime}</td>
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

  const renderResources = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Resources</h2>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </button>
      </div>

      {/* Resource Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emergency Vehicles</p>
              <p className="text-2xl font-bold text-red-600">8</p>
              <p className="text-xs text-green-600">All operational</p>
            </div>
            <Truck className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Medical Supplies</p>
              <p className="text-2xl font-bold text-blue-600">95%</p>
              <p className="text-xs text-green-600">Well stocked</p>
            </div>
            <Heart className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Communication Equipment</p>
              <p className="text-2xl font-bold text-green-600">12</p>
              <p className="text-xs text-green-600">All functional</p>
            </div>
            <Radio className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emergency Kits</p>
              <p className="text-2xl font-bold text-purple-600">150</p>
              <p className="text-xs text-green-600">Ready for distribution</p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Resource Inventory */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Inventory</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Emergency Vehicles</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">Ambulance Units</span>
                <span className="text-sm font-medium">2 available</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">Fire Trucks</span>
                <span className="text-sm font-medium">1 available</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">Rescue Vehicles</span>
                <span className="text-sm font-medium">3 available</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">Supply Trucks</span>
                <span className="text-sm font-medium">2 available</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Emergency Supplies</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">Food Packs</span>
                <span className="text-sm font-medium">500 units</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">Water Containers</span>
                <span className="text-sm font-medium">200 units</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">Blankets</span>
                <span className="text-sm font-medium">300 units</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">First Aid Kits</span>
                <span className="text-sm font-medium">50 units</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'alerts', label: 'Emergency Alerts', icon: AlertTriangle },
    { id: 'evacuation', label: 'Evacuation Centers', icon: Shield },
    { id: 'incidents', label: 'Incident Reports', icon: Radio },
    { id: 'resources', label: 'Emergency Resources', icon: Truck },
    { id: 'communications', label: 'Communications', icon: Megaphone }
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
                <p className="text-orange-100 mt-2 text-sm sm:text-base">Emergency Response & Disaster Preparedness System</p>
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
        {activeTab === 'resources' && renderResources()}
        {activeTab === 'communications' && (
          <div className="text-center py-12">
            <Megaphone className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Communication Center</h3>
            <p className="text-gray-600">Mass communication and alert broadcasting features coming soon!</p>
          </div>
        )}
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
                  <select
                    value={newAlert.type}
                    onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="weather">Weather Emergency</option>
                    <option value="flood">Flood Warning</option>
                    <option value="fire">Fire Emergency</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="health">Health Emergency</option>
                    <option value="security">Security Alert</option>
                    <option value="evacuation">Evacuation Order</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                  <select
                    value={newAlert.priority}
                    onChange={(e) => setNewAlert({...newAlert, priority: e.target.value as 'low' | 'medium' | 'high'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority - URGENT</option>
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
                  placeholder="Enter clear, descriptive alert title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Message</label>
                <textarea
                  value={newAlert.message}
                  onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter detailed alert message with specific instructions for residents"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Affected Areas</label>
                  <input
                    type="text"
                    placeholder="Zone 1, Zone 2, Riverside Area, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    value={newAlert.estimatedDuration}
                    onChange={(e) => setNewAlert({...newAlert, estimatedDuration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., 24 hours, 3 days, ongoing"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Response Teams</label>
                <input
                  type="text"
                  placeholder="Emergency Response Team A, Medical Team, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="evacuationRecommended"
                  checked={newAlert.evacuationRecommended}
                  onChange={(e) => setNewAlert({...newAlert, evacuationRecommended: e.target.checked})}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="evacuationRecommended" className="text-sm font-medium text-gray-700">
                  Recommend evacuation for affected areas
                </label>
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

      {/* Broadcast Form Modal */}
      {showBroadcastForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Broadcast Message</h3>
              <button
                onClick={() => setShowBroadcastForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Broadcast Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                  <option value="general">General Announcement</option>
                  <option value="emergency">Emergency Alert</option>
                  <option value="weather">Weather Update</option>
                  <option value="evacuation">Evacuation Notice</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter broadcast message"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Broadcast Channels</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm">SMS to all residents</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm">Email notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm">Mobile app push notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Public address system</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowBroadcastForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Broadcast Now
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