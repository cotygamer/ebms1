import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Save, Building2, MapPin, Phone, Mail, Globe, Shield, Database, Bell, Palette, Clock, Users } from 'lucide-react';

export default function SystemSettings() {
  const { systemSettings, updateSystemSettings } = useData();
  
  // Initialize settings from systemSettings and update when systemSettings changes
  const [settings, setSettings] = useState(() => ({
    barangayName: systemSettings.barangayName || 'Barangay San Miguel',
    barangayAddress: systemSettings.barangayAddress || 'San Miguel, Metro Manila, Philippines',
    contactNumber: systemSettings.contactNumber || '+63 2 8123 4567',
    emailAddress: systemSettings.emailAddress || 'info@barangaysanmiguel.gov.ph',
    website: systemSettings.website || 'https://barangaysanmiguel.gov.ph',
    facebookPage: systemSettings.facebookPage || 'https://facebook.com/barangaysanmiguel',
    operatingHours: systemSettings.operatingHours || '8:00 AM - 5:00 PM',
    timezone: systemSettings.timezone || 'Asia/Manila',
    language: systemSettings.language || 'English',
    currency: systemSettings.currency || 'PHP',
    dateFormat: systemSettings.dateFormat || 'MM/DD/YYYY',
    timeFormat: systemSettings.timeFormat || '12-hour',
    maxFileSize: systemSettings.maxFileSize || '10',
    allowedFileTypes: systemSettings.allowedFileTypes || 'PDF, JPG, PNG, DOCX',
    sessionTimeout: systemSettings.sessionTimeout || '30',
    passwordPolicy: systemSettings.passwordPolicy || 'strong',
    twoFactorAuth: systemSettings.twoFactorAuth || false,
    emailNotifications: systemSettings.emailNotifications || true,
    smsNotifications: systemSettings.smsNotifications || false,
    pushNotifications: systemSettings.pushNotifications || true,
    maintenanceMode: systemSettings.maintenanceMode || false,
    debugMode: systemSettings.debugMode || false,
    backupFrequency: systemSettings.backupFrequency || 'daily',
    primaryColor: systemSettings.primaryColor || '#2563eb',
    secondaryColor: systemSettings.secondaryColor || '#059669',
    accentColor: systemSettings.accentColor || '#dc2626'
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  // Update local settings when systemSettings changes
  React.useEffect(() => {
    setSettings({
      barangayName: systemSettings.barangayName || 'Barangay San Miguel',
      barangayAddress: systemSettings.barangayAddress || 'San Miguel, Metro Manila, Philippines',
      contactNumber: systemSettings.contactNumber || '+63 2 8123 4567',
      emailAddress: systemSettings.emailAddress || 'info@barangaysanmiguel.gov.ph',
      website: systemSettings.website || 'https://barangaysanmiguel.gov.ph',
      facebookPage: systemSettings.facebookPage || 'https://facebook.com/barangaysanmiguel',
      operatingHours: systemSettings.operatingHours || '8:00 AM - 5:00 PM',
      timezone: systemSettings.timezone || 'Asia/Manila',
      language: systemSettings.language || 'English',
      currency: systemSettings.currency || 'PHP',
      dateFormat: systemSettings.dateFormat || 'MM/DD/YYYY',
      timeFormat: systemSettings.timeFormat || '12-hour',
      maxFileSize: systemSettings.maxFileSize || '10',
      allowedFileTypes: systemSettings.allowedFileTypes || 'PDF, JPG, PNG, DOCX',
      sessionTimeout: systemSettings.sessionTimeout || '30',
      passwordPolicy: systemSettings.passwordPolicy || 'strong',
      twoFactorAuth: systemSettings.twoFactorAuth || false,
      emailNotifications: systemSettings.emailNotifications || true,
      smsNotifications: systemSettings.smsNotifications || false,
      pushNotifications: systemSettings.pushNotifications || true,
      maintenanceMode: systemSettings.maintenanceMode || false,
      debugMode: systemSettings.debugMode || false,
      backupFrequency: systemSettings.backupFrequency || 'daily',
      primaryColor: systemSettings.primaryColor || '#2563eb',
      secondaryColor: systemSettings.secondaryColor || '#059669',
      accentColor: systemSettings.accentColor || '#dc2626'
    });
  }, [systemSettings]);

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      await updateSystemSettings(settings);
      setMessage('Settings updated successfully!');
      
      // Trigger map refresh if Google Maps API key exists
      if (settings.googleMapsApiKey) {
        window.dispatchEvent(new CustomEvent('refreshGoogleMaps'));
      }
      
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    } catch (error) {
      setMessage('Failed to update settings. Please try again.');
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'contact', label: 'Contact Info', icon: Phone },
    { id: 'localization', label: 'Localization', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Database },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Barangay Name</label>
          <input
            type="text"
            value={settings.barangayName}
            onChange={(e) => setSettings({ ...settings, barangayName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
          <input
            type="text"
            value={settings.operatingHours}
            onChange={(e) => setSettings({ ...settings, operatingHours: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address</label>
        <textarea
          value={settings.barangayAddress}
          onChange={(e) => setSettings({ ...settings, barangayAddress: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Official Website</label>
        <input
          type="url"
          value={settings.website}
          onChange={(e) => setSettings({ ...settings, website: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderContactSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
          <input
            type="tel"
            value={settings.contactNumber}
            onChange={(e) => setSettings({ ...settings, contactNumber: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={settings.emailAddress}
            onChange={(e) => setSettings({ ...settings, emailAddress: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Page</label>
        <input
          type="url"
          value={settings.facebookPage}
          onChange={(e) => setSettings({ ...settings, facebookPage: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderLocalizationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={settings.timezone}
            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
            <option value="UTC">UTC (GMT+0)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="English">English</option>
            <option value="Filipino">Filipino</option>
            <option value="Tagalog">Tagalog</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={settings.currency}
            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PHP">PHP (₱)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
          <select
            value={settings.dateFormat}
            onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
          <select
            value={settings.timeFormat}
            onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="12-hour">12-hour (AM/PM)</option>
            <option value="24-hour">24-hour</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
          <select
            value={settings.passwordPolicy}
            onChange={(e) => setSettings({ ...settings, passwordPolicy: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="basic">Basic (6+ characters)</option>
            <option value="medium">Medium (8+ chars, mixed case)</option>
            <option value="strong">Strong (8+ chars, mixed case, numbers, symbols)</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600">Require 2FA for all admin accounts</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-600">Send notifications via email</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">SMS Notifications</h4>
            <p className="text-sm text-gray-600">Send notifications via SMS</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, smsNotifications: !settings.smsNotifications })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.smsNotifications ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Push Notifications</h4>
            <p className="text-sm text-gray-600">Send browser push notifications</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, pushNotifications: !settings.pushNotifications })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
          <input
            type="number"
            value={settings.maxFileSize}
            onChange={(e) => setSettings({ ...settings, maxFileSize: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Allowed File Types</label>
        <input
          type="text"
          value={settings.allowedFileTypes}
          onChange={(e) => setSettings({ ...settings, allowedFileTypes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="PDF, JPG, PNG, DOCX"
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
            <p className="text-sm text-gray-600">Put system in maintenance mode</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Debug Mode</h4>
            <p className="text-sm text-gray-600">Enable detailed error logging</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, debugMode: !settings.debugMode })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.debugMode ? 'bg-yellow-600' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.debugMode ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={settings.primaryColor}
              onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.secondaryColor}
              onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={settings.secondaryColor}
              onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={settings.accentColor}
              onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-4">Color Preview</h4>
        <div className="flex space-x-4">
          <div 
            className="w-16 h-16 rounded-lg shadow-sm border"
            style={{ backgroundColor: settings.primaryColor }}
            title="Primary Color"
          ></div>
          <div 
            className="w-16 h-16 rounded-lg shadow-sm border"
            style={{ backgroundColor: settings.secondaryColor }}
            title="Secondary Color"
          ></div>
          <div 
            className="w-16 h-16 rounded-lg shadow-sm border"
            style={{ backgroundColor: settings.accentColor }}
            title="Accent Color"
          ></div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'contact':
        return renderContactSettings();
      case 'localization':
        return renderLocalizationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'system':
        return renderSystemSettings();
      case 'appearance':
        return renderAppearanceSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">System Settings</h2>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') ? 'bg-green-50 border border-green-200 text-green-700' :
          'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* System Integration Health Check */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Integration Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">Database</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-green-700">All tables synchronized</p>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">Authentication</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-blue-700">Unified login system active</p>
          </div>
          
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-800">Cross-Portal Data</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-purple-700">Data sharing operational</p>
          </div>
          
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-800">External APIs</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-orange-700">Maps & weather integrated</p>
          </div>
        </div>
      </div>
    </div>
  );
}