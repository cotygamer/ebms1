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
  Calendar
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

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Emergency Alerts</h3>
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
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Live Monitoring</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Temperature</h3>
            <Thermometer className="h-6 w-6 text-red-500" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">32°C</div>
            <div className="text-sm text-red-500">Very Hot</div>
            <div className="mt-4 bg-red-100 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Wind Speed</h3>
            <Wind className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">85 km/h</div>
            <div className="text-sm text-blue-500">Typhoon Level</div>
            <div className="mt-4 bg-blue-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Rainfall</h3>
            <Cloud className="h-6 w-6 text-gray-500" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-600 mb-2">Heavy</div>
            <div className="text-sm text-gray-500">150mm/hr</div>
            <div className="mt-4 bg-gray-100 rounded-full h-2">
              <div className="bg-gray-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensor Network Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Weather Station 1', location: 'Barangay Hall', status: 'Online', lastUpdate: '2 min ago' },
            { name: 'Flood Sensor A', location: 'Main Street', status: 'Online', lastUpdate: '1 min ago' },
            { name: 'Wind Monitor B', location: 'Elementary School', status: 'Offline', lastUpdate: '15 min ago' },
            { name: 'Rain Gauge C', location: 'Health Center', status: 'Online', lastUpdate: '3 min ago' },
          ].map((sensor, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{sensor.name}</h4>
                <p className="text-sm text-gray-600">{sensor.location}</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  sensor.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    sensor.status === 'Online' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  {sensor.status}
                </div>
                <p className="text-xs text-gray-500 mt-1">{sensor.lastUpdate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEmergencyServices = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Emergency Services</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Fire Department', units: 3, status: 'Available', contact: '911', color: 'red' },
          { name: 'Medical Team', units: 2, status: 'On Standby', contact: '911', color: 'green' },
          { name: 'Rescue Team', units: 1, status: 'Deployed', contact: '911', color: 'yellow' },
          { name: 'Police Unit', units: 2, status: 'Available', contact: '911', color: 'blue' },
          { name: 'Barangay Response', units: 4, status: 'Active', contact: '123-4567', color: 'purple' },
          { name: 'Evacuation Team', units: 3, status: 'On Standby', contact: '123-4568', color: 'orange' },
        ].map((service, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
              <div className={`w-3 h-3 rounded-full ${
                service.status === 'Available' ? 'bg-green-500' :
                service.status === 'On Standby' ? 'bg-yellow-500' :
                service.status === 'Deployed' || service.status === 'Active' ? 'bg-blue-500' :
                'bg-red-500'
              }`}></div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Units: {service.units}</p>
              <p className="text-sm text-gray-600">Status: {service.status}</p>
              <p className="text-sm text-gray-600">Contact: {service.contact}</p>
            </div>
            <button className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
              Contact Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEvacuationCenters = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Evacuation Centers</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            name: 'Barangay Hall',
            capacity: 150,
            current: 120,
            address: 'Main Street, Barangay Center',
            facilities: ['Restrooms', 'Kitchen', 'Medical Station', 'Generator'],
            status: 'Active'
          },
          {
            name: 'Elementary School',
            capacity: 200,
            current: 127,
            address: 'Education Street, Zone 2',
            facilities: ['Classrooms', 'Cafeteria', 'Playground', 'Water Supply'],
            status: 'Active'
          },
          {
            name: 'Community Center',
            capacity: 100,
            current: 0,
            address: 'Community Avenue, Zone 3',
            facilities: ['Hall', 'Stage', 'Storage', 'Parking'],
            status: 'Standby'
          },
          {
            name: 'Covered Court',
            capacity: 80,
            current: 0,
            address: 'Sports Complex, Zone 1',
            facilities: ['Open Space', 'Bleachers', 'Lighting', 'Security'],
            status: 'Standby'
          }
        ].map((center, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{center.name}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                center.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {center.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Capacity: {center.capacity} people</span>
                <span className="text-sm font-medium text-gray-900">
                  Current: {center.current} ({Math.round((center.current / center.capacity) * 100)}%)
                </span>
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
              
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {center.address}
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

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(announcement.category)}`}>
                    {announcement.category}
                  </span>
                  <span className={`text-sm font-medium ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority} Priority
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{announcement.title}</h3>
                <p className="text-gray-600 mb-3">{announcement.content}</p>
                <div className="text-sm text-gray-500">
                  <p>By {announcement.author} • {new Date(announcement.createdAt).toLocaleDateString()}</p>
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
      <h2 className="text-2xl font-bold text-gray-900">Emergency Planning</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Protocols</h3>
          <div className="space-y-3">
            {[
              'Typhoon Response Protocol',
              'Flood Emergency Procedures',
              'Fire Safety Guidelines',
              'Medical Emergency Response',
              'Evacuation Procedures',
              'Communication Protocols'
            ].map((protocol, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-gray-900">{protocol}</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Inventory</h3>
          <div className="space-y-3">
            {[
              { item: 'Emergency Food Supplies', quantity: '500 packs', status: 'Adequate' },
              { item: 'Medical Supplies', quantity: '200 kits', status: 'Low' },
              { item: 'Rescue Equipment', quantity: '15 sets', status: 'Adequate' },
              { item: 'Communication Radios', quantity: '25 units', status: 'Good' },
              { item: 'Emergency Generators', quantity: '8 units', status: 'Good' },
              { item: 'Water Purification Tablets', quantity: '1000 tablets', status: 'Low' }
            ].map((resource, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{resource.item}</p>
                  <p className="text-sm text-gray-600">{resource.quantity}</p>
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