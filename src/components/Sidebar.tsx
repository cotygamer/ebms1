import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Building2, LogOut } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface SidebarProps {
  menuItems: MenuItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
}

export default function Sidebar({ menuItems, activeTab, setActiveTab, userRole }: SidebarProps) {
  const { user, logout } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super-admin':
        return 'bg-red-600';
      case 'barangay-official':
        return 'bg-green-600';
      case 'resident':
        return 'bg-purple-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Barangay System</h2>
            <p className="text-sm text-gray-600 capitalize">{userRole.replace('-', ' ')}</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-8 h-8 ${getRoleColor(userRole)} rounded-full flex items-center justify-center text-white font-semibold`}>
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-600">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}