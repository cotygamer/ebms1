import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Sidebar from '../components/Sidebar';
import Analytics from '../components/Analytics';
import UserManagement from '../components/UserManagement';
import ResidentManagement from '../components/ResidentManagement';
import SystemSettings from '../components/SystemSettings';
import ModuleControl from '../components/ModuleControl';
import SyncTestPanel from '../components/SyncTestPanel';
import DataSyncMonitor from '../components/DataSyncMonitor';
import DocumentProcessing from '../components/DocumentProcessing';
import ComplaintManagement from '../components/ComplaintManagement';
import AnnouncementManagement from '../components/AnnouncementManagement';
import MessagingCenter from '../components/MessagingCenter';
import MessagingCenter from '../components/MessagingCenter';
import ProjectGallery from '../components/ProjectGallery';
import { 
  Home,
  Users,
  Settings,
  Shield,
  Database,
  TestTube,
  Activity,
  FileText,
  AlertTriangle,
  Bell,
  MessageSquare,
  Camera,
  LogOut
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'residents', label: 'Resident Management', icon: Users },
    { id: 'documents', label: 'Document Processing', icon: FileText },
    { id: 'complaints', label: 'Complaint Management', icon: AlertTriangle },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'projects', label: 'Project Gallery', icon: Camera },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'modules', label: 'Module Control', icon: Shield },
    { id: 'sync-tests', label: 'Sync Tests', icon: TestTube },
    { id: 'data-monitor', label: 'Data Monitor', icon: Database }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Analytics />;
      case 'users':
        return <UserManagement />;
      case 'residents':
        return <ResidentManagement />;
      case 'documents':
        return <DocumentProcessing />;
      case 'complaints':
        return <ComplaintManagement />;
      case 'announcements':
        return <AnnouncementManagement />;
      case 'messages':
        return <MessagingCenter />;
      case 'projects':
        return <ProjectGallery />;
      case 'settings':
        return <SystemSettings />;
      case 'modules':
        return <ModuleControl />;
      case 'sync-tests':
        return <SyncTestPanel />;
      case 'data-monitor':
        return <DataSyncMonitor />;
      default:
        return <Analytics />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole="super-admin"
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-600">Super Admin Portal</p>
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