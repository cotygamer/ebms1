import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Sidebar from '../components/Sidebar';
import { 
  Home,
  AlertTriangle,
  Users,
  MapPin,
  Bell,
  Radio,
  Shield,
  Activity,
  Cloud,
  Zap,
  LogOut
} from 'lucide-react';

export default function DisasterPortal() {
  const { user, logout } = useAuth();
  const { announcements, residents } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'alerts', label: 'Emergency Alerts', icon: AlertTriangle },
    { id: 'evacuation', label: 'Evacuation Management', icon: Users },
    { id: 'resources', label: 'Emergency Resources', icon: Shield },
    { id: 'communication', label: 'Communication', icon: Radio }
  ];

  const emergencyAlerts = announcements.filter(a => a.type === 'emergency' || a.type === 'weather');
  const evacuationCenters = [
    { name: 'Community Center', capacity: 200, currentOccupancy: 0, status: 'available' },
    { name: 'Elementary School', capacity: 150, currentOccupancy: 0, status: 'available' },
    { name: 'Barangay Hall', capacity: 100, currentOccupancy: 0, status: 'available' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Disaster Management Dashboard</h2>
      
      {/* Emergency Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-3xl font-bold text-red-600">{emergencyAlerts.length}</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Evacuation Centers</p>
              <p className="text-3xl font-bold text-blue-600">{evacuationCenters.length}</p>
            </div>
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="text-3xl font-bold text-green-600">
                {evacuationCenters.reduce((sum, center) => sum + center.capacity, 0)}
              </p>
            </div>
            <Users className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Evacuees</p>
              <p className="text-3xl font-bold text-purple-600">
                {evacuationCenters.reduce((sum, center) => sum + center.currentOccupancy, 0)}
              </p>
            </div>
            <MapPin className="h-12 w-12 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Emergency Alerts</h3>
        {emergencyAlerts.length > 0 ? (
          <div className="space-y-4">
            {emergencyAlerts.map((alert) => (
              <div key={alert.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-red-900">{alert.title}</h4>
                    <p className="text-red-700 text-sm">{alert.content}</p>
                    <p className="text-red-600 text-xs mt-1">
                      Issued: {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    alert.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alert.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No active emergency alerts</p>
          </div>
        )}
      </div>

      {/* Evacuation Centers */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evacuation Centers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {evacuationCenters.map((center, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{center.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{center.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current:</span>
                  <span className="font-medium">{center.currentOccupancy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    center.status === 'available' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {center.status}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(center.currentOccupancy / center.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'alerts':
        return <div className="text-center py-12"><AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900">Emergency Alerts</h3><p className="text-gray-600">Emergency alert management coming soon</p></div>;
      case 'evacuation':
        return <div className="text-center py-12"><Users className="h-16 w-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900">Evacuation Management</h3><p className="text-gray-600">Evacuation management features coming soon</p></div>;
      case 'resources':
        return <div className="text-center py-12"><Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900">Emergency Resources</h3><p className="text-gray-600">Emergency resource management coming soon</p></div>;
      case 'communication':
        return <div className="text-center py-12"><Radio className="h-16 w-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900">Communication</h3><p className="text-gray-600">Emergency communication features coming soon</p></div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole="disaster-portal"
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-600">Disaster Management Portal</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}