import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Sidebar from '../components/Sidebar';
import ComplaintManagement from '../components/ComplaintManagement';
import { 
  Home,
  Shield,
  AlertTriangle,
  Users,
  FileText,
  Activity,
  Eye,
  Clock,
  CheckCircle,
  LogOut
} from 'lucide-react';

export default function PeaceOrderPortal() {
  const { user, logout } = useAuth();
  const { complaints, residents } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'incidents', label: 'Incident Management', icon: AlertTriangle },
    { id: 'patrol', label: 'Patrol Management', icon: Shield },
    { id: 'reports', label: 'Crime Reports', icon: FileText },
    { id: 'community', label: 'Community Safety', icon: Users }
  ];

  const incidentStats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    investigating: complaints.filter(c => c.status === 'investigating').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    highPriority: complaints.filter(c => c.priority === 'high').length
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Peace & Order Dashboard</h2>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Incidents</p>
              <p className="text-3xl font-bold text-red-600">{incidentStats.total}</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Under Investigation</p>
              <p className="text-3xl font-bold text-blue-600">{incidentStats.investigating}</p>
            </div>
            <Eye className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved Cases</p>
              <p className="text-3xl font-bold text-green-600">{incidentStats.resolved}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-3xl font-bold text-orange-600">{incidentStats.highPriority}</p>
            </div>
            <Shield className="h-12 w-12 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Incidents</h3>
        {complaints.length > 0 ? (
          <div className="space-y-4">
            {complaints.slice(0, 5).map((incident) => (
              <div key={incident.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className={`p-2 rounded-full ${
                  incident.priority === 'high' ? 'bg-red-100' :
                  incident.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <AlertTriangle className={`h-5 w-5 ${
                    incident.priority === 'high' ? 'text-red-600' :
                    incident.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{incident.subject}</h4>
                  <p className="text-sm text-gray-600">{incident.incident_type}</p>
                  <p className="text-xs text-gray-500">
                    Reported by {incident.reporter_name} on {new Date(incident.date_submitted || incident.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  incident.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                  incident.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {incident.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No incidents reported</p>
          </div>
        )}
      </div>

      {/* Safety Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Safety Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-green-900">Safe</h4>
            <p className="text-sm text-green-700">No immediate threats</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-blue-900">Active Patrols</h4>
            <p className="text-sm text-blue-700">3 patrol units deployed</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-purple-900">Community Watch</h4>
            <p className="text-sm text-purple-700">24/7 monitoring active</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'incidents':
        return <ComplaintManagement />;
      case 'patrol':
        return <div className="text-center py-12"><Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900">Patrol Management</h3><p className="text-gray-600">Patrol management features coming soon</p></div>;
      case 'reports':
        return <div className="text-center py-12"><FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900">Crime Reports</h3><p className="text-gray-600">Crime reporting features coming soon</p></div>;
      case 'community':
        return <div className="text-center py-12"><Users className="h-16 w-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900">Community Safety</h3><p className="text-gray-600">Community safety features coming soon</p></div>;
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
        userRole="peace-order-portal"
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-600">Peace & Order Portal</p>
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