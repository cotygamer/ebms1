import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  AlertTriangle, 
  Cloud, 
  Thermometer, 
  Wind, 
  Eye, 
  Radio, 
  Users, 
  MapPin, 
  Phone, 
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  LogOut,
  ArrowLeft,
  Activity,
  Shield,
  Bell,
  Calendar,
  Clock,
  CheckCircle,
  Zap,
  Droplets,
  Navigation,
  Siren,
  Home,
  Building,
  Search,
  Filter,
  Download
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Emergency' | 'Weather' | 'Evacuation' | 'Update';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Published' | 'Draft';
  createdAt: string;
  author: string;
}

const DisasterPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Typhoon Warning Alert - Signal No. 2',
      content: 'Signal No. 2 has been raised for our area. Residents in low-lying areas are advised to evacuate immediately to designated evacuation centers.',
      category: 'Emergency',
      priority: 'High',
      status: 'Published',
      createdAt: '2024-01-15T10:00:00Z',
      author: 'Disaster Management Team'
    },
    {
      id: '2',
      title: 'Evacuation Center Update',
      content: 'Barangay Hall evacuation center is now at 80% capacity. Additional centers at Elementary School are being prepared.',
      category: 'Evacuation',
      priority: 'High',
      status: 'Published',
      createdAt: '2024-01-15T09:30:00Z',
      author: 'Emergency Response Team'
    },
    {
      id: '3',
      title: 'Weather Update - Heavy Rainfall Expected',
      content: 'Heavy to intense rainfall expected in the next 6-12 hours. Residents are advised to stay indoors and avoid unnecessary travel.',
      category: 'Weather',
      priority: 'Medium',
      status: 'Published',
      createdAt: '2024-01-15T08:45:00Z',
      author: 'Weather Monitoring Team'
    }
  ]);

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    category: 'Update' as const,
    priority: 'Medium' as const
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveAnnouncement = () => {
    if (editingAnnouncement) {
      setAnnouncements(prev => prev.map(ann => 
        ann.id === editingAnnouncement.id 
          ? { ...ann, ...newAnnouncement, updatedAt: new Date().toISOString() }
          : ann
      ));
    } else {
      const announcement: Announcement = {
        id: Date.now().toString(),
        ...newAnnouncement,
        status: 'Published',
        createdAt: new Date().toISOString(),
        author: user?.name || 'Disaster Management'
      };
      setAnnouncements(prev => [announcement, ...prev]);
    }
    
    setShowAnnouncementModal(false);
    setEditingAnnouncement(null);
    setNewAnnouncement({
      title: '',
      content: '',
      category: 'Update',
      priority: 'Medium'
    });
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      priority: announcement.priority
    });
    setShowAnnouncementModal(true);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'Weather': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Evacuation': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'monitoring', label: 'Live Monitoring', icon: Eye },
    { id: 'emergency', label: 'Emergency Services', icon: Phone },
    { id: 'evacuation', label: 'Evacuation Centers', icon: MapPin },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'planning', label: 'Emergency Planning', icon: Shield },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Emergency Status Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alert Level</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">Level 2</p>
              <p className="text-xs text-red-500 mt-1">High Risk</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weather Status</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">Stormy</p>
              <p className="text-xs text-blue-500 mt-1">Heavy Rain</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Cloud className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Evacuees</p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">247</p>
              <p className="text-xs text-orange-500 mt-1">2 Centers</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Teams</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">8</p>
              <p className="text-xs text-green-500 mt-1">Active Teams</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Radio className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setShowAnnouncementModal(true)}
            className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Siren className="h-8 w-8 text-red-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Emergency Alert</h4>
              <p className="text-sm text-gray-600">Send urgent alert</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Eye className="h-8 w-8 text-blue-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Monitor Weather</h4>
              <p className="text-sm text-gray-600">Check conditions</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <MapPin className="h-8 w-8 text-orange-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Evacuation</h4>
              <p className="text-sm text-gray-600">Manage centers</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Radio className="h-8 w-8 text-green-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Dispatch Team</h4>
              <p className="text-sm text-gray-600">Deploy response</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Emergency Alerts</h3>
          <button 
            onClick={() => setActiveTab('announcements')}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {announcements.slice(0, 3).map((announcement) => (
            <div key={announcement.id} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium text-red-900">{announcement.title}</h4>
                <p className="text-sm text-red-700 mt-1">{announcement.content.substring(0, 100)}...</p>
                <p className="text-xs text-red-600 mt-2">{new Date(announcement.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Response Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 mb-1">98%</div>
            <div className="text-sm text-green-800">Response Rate</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600 mb-1">4.2 min</div>
            <div className="text-sm text-blue-800">Avg Response Time</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Shield className="h-12 w-12 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600 mb-1">156</div>
            <div className="text-sm text-purple-800">Lives Saved</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Live Environmental Monitoring</h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live Data</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Temperature</h3>
            <Thermometer className="h-6 w-6 text-red-500" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">32°C</div>
            <div className="text-sm text-red-500 mb-2">Very Hot</div>
            <div className="mt-4 bg-red-100 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Last updated: 2 min ago</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Wind Speed</h3>
            <Wind className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">85 km/h</div>
            <div className="text-sm text-blue-500 mb-2">Typhoon Level</div>
            <div className="mt-4 bg-blue-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Last updated: 1 min ago</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Rainfall</h3>
            <Droplets className="h-6 w-6 text-gray-500" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-600 mb-2">Heavy</div>
            <div className="text-sm text-gray-500 mb-2">150mm/hr</div>
            <div className="mt-4 bg-gray-100 rounded-full h-2">
              <div className="bg-gray-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Last updated: 30 sec ago</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Flood Level</h3>
            <Navigation className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-600 mb-2">1.2m</div>
            <div className="text-sm text-yellow-500 mb-2">Moderate</div>
            <div className="mt-4 bg-yellow-100 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Last updated: 5 min ago</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensor Network Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Weather Station 1', location: 'Barangay Hall', status: 'Online', lastUpdate: '2 min ago', signal: 95 },
            { name: 'Flood Sensor A', location: 'Main Street', status: 'Online', lastUpdate: '1 min ago', signal: 88 },
            { name: 'Wind Monitor B', location: 'Elementary School', status: 'Offline', lastUpdate: '15 min ago', signal: 0 },
            { name: 'Rain Gauge C', location: 'Health Center', status: 'Online', lastUpdate: '3 min ago', signal: 92 },
            { name: 'Seismic Sensor D', location: 'Community Center', status: 'Online', lastUpdate: '1 min ago', signal: 85 },
            { name: 'Air Quality Monitor', location: 'Market Area', status: 'Warning', lastUpdate: '2 min ago', signal: 78 },
          ].map((sensor, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{sensor.name}</h4>
                <p className="text-sm text-gray-600">{sensor.location}</p>
                <p className="text-xs text-gray-500 mt-1">Signal: {sensor.signal}%</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  sensor.status === 'Online' ? 'bg-green-100 text-green-800' : 
                  sensor.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    sensor.status === 'Online' ? 'bg-green-500' : 
                    sensor.status === 'Warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  {sensor.status}
                </div>
                <p className="text-xs text-gray-500 mt-1">{sensor.lastUpdate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Forecast */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">24-Hour Weather Forecast</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { time: '12:00', temp: '32°C', condition: 'Stormy', icon: Cloud },
            { time: '15:00', temp: '30°C', condition: 'Heavy Rain', icon: Droplets },
            { time: '18:00', temp: '28°C', condition: 'Rain', icon: Cloud },
            { time: '21:00', temp: '26°C', condition: 'Cloudy', icon: Cloud },
            { time: '00:00', temp: '25°C', condition: 'Partly Cloudy', icon: Cloud },
            { time: '03:00', temp: '24°C', condition: 'Clear', icon: CheckCircle },
          ].map((forecast, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{forecast.time}</p>
              <forecast.icon className="h-8 w-8 text-blue-500 mx-auto my-2" />
              <p className="text-lg font-bold text-gray-900">{forecast.temp}</p>
              <p className="text-xs text-gray-600">{forecast.condition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEmergencyServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Services</h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Deploy Team
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Fire Department', units: 3, status: 'Available', contact: '911', color: 'red', deployed: 0 },
          { name: 'Medical Team', units: 2, status: 'On Standby', contact: '911', color: 'green', deployed: 1 },
          { name: 'Rescue Team', units: 1, status: 'Deployed', contact: '911', color: 'yellow', deployed: 1 },
          { name: 'Police Unit', units: 2, status: 'Available', contact: '911', color: 'blue', deployed: 0 },
          { name: 'Barangay Response', units: 4, status: 'Active', contact: '123-4567', color: 'purple', deployed: 2 },
          { name: 'Evacuation Team', units: 3, status: 'On Standby', contact: '123-4568', color: 'orange', deployed: 0 },
        ].map((service, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-red-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
              <div className={`w-3 h-3 rounded-full ${
                service.status === 'Available' ? 'bg-green-500' :
                service.status === 'On Standby' ? 'bg-yellow-500' :
                service.status === 'Deployed' || service.status === 'Active' ? 'bg-blue-500' :
                'bg-red-500'
              }`}></div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Units:</span>
                <span className="text-sm font-medium text-gray-900">{service.units}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Deployed:</span>
                <span className="text-sm font-medium text-gray-900">{service.deployed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Available:</span>
                <span className="text-sm font-medium text-gray-900">{service.units - service.deployed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-medium ${
                  service.status === 'Available' ? 'text-green-600' :
                  service.status === 'On Standby' ? 'text-yellow-600' :
                  'text-blue-600'
                }`}>{service.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Contact:</span>
                <span className="text-sm font-medium text-gray-900">{service.contact}</span>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm">
                <Phone className="h-4 w-4 inline mr-1" />
                Contact
              </button>
              <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <Radio className="h-4 w-4 inline mr-1" />
                Deploy
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Response Team Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Response Activities</h3>
        <div className="space-y-4">
          {[
            { time: '10:30 AM', team: 'Rescue Team Alpha', activity: 'Deployed to flood-affected area in Zone 3', status: 'In Progress' },
            { time: '09:45 AM', team: 'Medical Team Bravo', activity: 'Providing first aid at evacuation center', status: 'Completed' },
            { time: '09:15 AM', team: 'Fire Department', activity: 'Standby at Barangay Hall', status: 'Standby' },
            { time: '08:30 AM', team: 'Evacuation Team', activity: 'Assisted 15 families to safety', status: 'Completed' },
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  activity.status === 'In Progress' ? 'bg-blue-500' :
                  activity.status === 'Completed' ? 'bg-green-500' :
                  'bg-yellow-500'
                }`}></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{activity.team}</h4>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.activity}</p>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                  activity.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEvacuationCenters = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Evacuation Centers</h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Center
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Centers</p>
              <p className="text-2xl font-bold text-orange-600">4</p>
            </div>
            <Building className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-blue-600">530</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Evacuees</p>
              <p className="text-2xl font-bold text-red-600">247</p>
            </div>
            <Home className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Space</p>
              <p className="text-2xl font-bold text-green-600">283</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            name: 'Barangay Hall',
            capacity: 150,
            current: 120,
            address: 'Main Street, Barangay Center',
            facilities: ['Restrooms', 'Kitchen', 'Medical Station', 'Generator'],
            status: 'Active',
            manager: 'Juan Dela Cruz',
            contact: '+63 912 345 6789'
          },
          {
            name: 'Elementary School',
            capacity: 200,
            current: 127,
            address: 'Education Street, Zone 2',
            facilities: ['Classrooms', 'Cafeteria', 'Playground', 'Water Supply'],
            status: 'Active',
            manager: 'Maria Santos',
            contact: '+63 917 654 3210'
          },
          {
            name: 'Community Center',
            capacity: 100,
            current: 0,
            address: 'Community Avenue, Zone 3',
            facilities: ['Hall', 'Stage', 'Storage', 'Parking'],
            status: 'Standby',
            manager: 'Pedro Garcia',
            contact: '+63 920 123 4567'
          },
          {
            name: 'Covered Court',
            capacity: 80,
            current: 0,
            address: 'Sports Complex, Zone 1',
            facilities: ['Open Space', 'Bleachers', 'Lighting', 'Security'],
            status: 'Standby',
            manager: 'Ana Lopez',
            contact: '+63 918 765 4321'
          }
        ].map((center, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{center.name}</h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                center.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {center.status}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Capacity: {center.capacity} people</span>
                <span className="text-sm font-medium text-gray-900">
                  Current: {center.current} ({Math.round((center.current / center.capacity) * 100)}%)
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    (center.current / center.capacity) > 0.8 ? 'bg-red-500' :
                    (center.current / center.capacity) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(center.current / center.capacity) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex items-start text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{center.address}</span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Manager:</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{center.manager}</span>
                  <a href={`tel:${center.contact}`} className="text-sm text-blue-600 hover:text-blue-800">
                    {center.contact}
                  </a>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Facilities:</p>
                <div className="flex flex-wrap gap-1">
                  {center.facilities.map((facility, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  <Eye className="h-4 w-4 inline mr-1" />
                  View Details
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Disaster Announcements</h2>
        <button
          onClick={() => setShowAnnouncementModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Alert
        </button>
      </div>

      {/* Announcement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-red-600">{announcements.length}</p>
            </div>
            <Megaphone className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-orange-600">{announcements.filter(a => a.priority === 'High').length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-blue-600">{announcements.filter(a => a.status === 'Published').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-green-600">
                {announcements.filter(a => new Date(a.createdAt).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search announcements..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(announcement.category)}`}>
                    {announcement.category.toUpperCase()}
                  </span>
                  <span className={`text-sm font-medium ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(announcement.createdAt).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{announcement.title}</h3>
                <p className="text-gray-600 mb-3">{announcement.content}</p>
                <div className="text-sm text-gray-500">
                  <p>By {announcement.author}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleEditAnnouncement(announcement)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteAnnouncement(announcement.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlanning = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Planning & Preparedness</h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Plan
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Protocols</h3>
          <div className="space-y-3">
            {[
              { name: 'Typhoon Response Protocol', status: 'Active', lastUpdated: '2024-01-10' },
              { name: 'Flood Emergency Procedures', status: 'Active', lastUpdated: '2024-01-08' },
              { name: 'Fire Safety Guidelines', status: 'Under Review', lastUpdated: '2024-01-05' },
              { name: 'Medical Emergency Response', status: 'Active', lastUpdated: '2024-01-03' },
              { name: 'Evacuation Procedures', status: 'Active', lastUpdated: '2024-01-01' },
              { name: 'Communication Protocols', status: 'Draft', lastUpdated: '2023-12-28' }
            ].map((protocol, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex-1">
                  <span className="text-gray-900 font-medium">{protocol.name}</span>
                  <p className="text-xs text-gray-500 mt-1">Updated: {protocol.lastUpdated}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    protocol.status === 'Active' ? 'bg-green-100 text-green-800' :
                    protocol.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {protocol.status}
                  </span>
                  <button className="text-blue-600 hover:text-blue-900 text-sm">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Inventory</h3>
          <div className="space-y-3">
            {[
              { item: 'Emergency Food Supplies', quantity: '500 packs', status: 'Adequate', lastCheck: '2024-01-12' },
              { item: 'Medical Supplies', quantity: '200 kits', status: 'Low', lastCheck: '2024-01-10' },
              { item: 'Rescue Equipment', quantity: '15 sets', status: 'Adequate', lastCheck: '2024-01-08' },
              { item: 'Communication Radios', quantity: '25 units', status: 'Good', lastCheck: '2024-01-07' },
              { item: 'Emergency Generators', quantity: '8 units', status: 'Good', lastCheck: '2024-01-05' },
              { item: 'Water Purification Tablets', quantity: '1000 tablets', status: 'Low', lastCheck: '2024-01-03' }
            ].map((resource, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{resource.item}</p>
                  <p className="text-sm text-gray-600">{resource.quantity}</p>
                  <p className="text-xs text-gray-500 mt-1">Last checked: {resource.lastCheck}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  resource.status === 'Good' ? 'bg-green-100 text-green-800' :
                  resource.status === 'Adequate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {resource.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Training and Drills */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Training & Drills Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Fire Safety Drill', date: '2024-01-20', participants: 45, status: 'Scheduled' },
            { title: 'Evacuation Exercise', date: '2024-01-25', participants: 120, status: 'Scheduled' },
            { title: 'First Aid Training', date: '2024-01-18', participants: 25, status: 'Completed' },
            { title: 'Emergency Communication Test', date: '2024-01-15', participants: 15, status: 'Completed' },
            { title: 'Flood Response Simulation', date: '2024-02-01', participants: 80, status: 'Planning' },
            { title: 'Medical Emergency Drill', date: '2024-02-05', participants: 30, status: 'Planning' },
          ].map((drill, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
              <h4 className="font-medium text-gray-900 mb-2">{drill.title}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><Calendar className="h-4 w-4 inline mr-1" />{drill.date}</p>
                <p><Users className="h-4 w-4 inline mr-1" />{drill.participants} participants</p>
              </div>
              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                drill.status === 'Completed' ? 'bg-green-100 text-green-800' :
                drill.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {drill.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment Matrix</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hazard Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mitigation Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { hazard: 'Typhoon', probability: 'High', impact: 'High', risk: 'Critical', mitigation: 'Active' },
                { hazard: 'Flooding', probability: 'High', impact: 'Medium', risk: 'High', mitigation: 'Active' },
                { hazard: 'Fire', probability: 'Medium', impact: 'High', risk: 'High', mitigation: 'Planned' },
                { hazard: 'Earthquake', probability: 'Low', impact: 'High', risk: 'Medium', mitigation: 'Planned' },
                { hazard: 'Landslide', probability: 'Low', impact: 'Medium', risk: 'Low', mitigation: 'Monitored' },
              ].map((risk, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{risk.hazard}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{risk.probability}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{risk.impact}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      risk.risk === 'Critical' ? 'bg-red-100 text-red-800' :
                      risk.risk === 'High' ? 'bg-orange-100 text-orange-800' :
                      risk.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {risk.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      risk.mitigation === 'Active' ? 'bg-green-100 text-green-800' :
                      risk.mitigation === 'Planned' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {risk.mitigation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'monitoring':
        return renderMonitoring();
      case 'emergency':
        return renderEmergencyServices();
      case 'evacuation':
        return renderEvacuationCenters();
      case 'announcements':
        return renderAnnouncements();
      case 'planning':
        return renderPlanning();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              {user?.role === 'barangay-official' && (
                <Link
                  to="/barangay-official-dashboard"
                  className="text-red-200 hover:text-white flex items-center"
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
                <p className="text-red-100 mt-2 text-sm sm:text-base">Emergency Response & Disaster Preparedness System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-red-100 text-sm">Welcome, {user?.name}</p>
                <p className="text-xs text-red-200 capitalize">{user?.role?.replace('-', ' ')}</p>
              </div>
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-red-200 hover:text-white hover:bg-red-700 rounded-lg transition-colors"
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
                    ? 'border-red-500 text-red-600'
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
        {renderContent()}
      </div>

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingAnnouncement ? 'Edit Announcement' : 'New Emergency Alert'}
              </h3>
              <button
                onClick={() => {
                  setShowAnnouncementModal(false);
                  setEditingAnnouncement(null);
                  setNewAnnouncement({ title: '', content: '', category: 'Update', priority: 'Medium' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter announcement title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter announcement content"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newAnnouncement.category}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="Weather">Weather</option>
                    <option value="Evacuation">Evacuation</option>
                    <option value="Update">Update</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAnnouncementModal(false);
                  setEditingAnnouncement(null);
                  setNewAnnouncement({ title: '', content: '', category: 'Update', priority: 'Medium' });
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAnnouncement}
                disabled={!newAnnouncement.title || !newAnnouncement.content}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingAnnouncement ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisasterPortal;