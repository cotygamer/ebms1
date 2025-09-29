import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Shield, AlertTriangle, Users, FileText, Clock, CheckCircle, XCircle, Search, Filter, Plus, Eye, Edit, MapPin, Calendar, Phone, Mail, User, Building2, LogOut, Activity, BarChart3, Settings, Bell, Camera, Download, Upload, Star, TrendingUp, Target, Zap, Award, Home, Navigation, Crosshair, Save, X, ChevronDown, ChevronUp, Siren, Hand as Handcuffs, Scale, Gavel, UserX, AlertCircle, Radio, Car, Megaphone } from 'lucide-react';

interface Incident {
  id: string;
  reporter_name: string;
  reporter_email: string;
  reporter_phone?: string;
  incident_type: string;
  subject: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high';
  location?: string;
  date_occurred?: string;
  time_occurred?: string;
  witness_name?: string;
  witness_contact?: string;
  assigned_to?: string;
  resolution?: string;
  date_submitted: string;
  evidence_files?: any[];
  created_at: string;
  updated_at: string;
}

export default function PeaceOrderPortal() {
  const { user, logout } = useAuth();
  const { complaints: incidents, updateComplaint } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showAddIncident, setShowAddIncident] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState<Incident | null>(null);
  const [newIncident, setNewIncident] = useState({
    reporter_name: '',
    reporter_email: '',
    reporter_phone: '',
    incident_type: '',
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    location: '',
    date_occurred: '',
    time_occurred: '',
    witness_name: '',
    witness_contact: ''
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.reporter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.incident_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || incident.priority === filterPriority;
    const matchesType = filterType === 'all' || incident.incident_type === filterType;
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const handleUpdateIncidentStatus = async (incidentId: string, newStatus: string, assignedTo?: string, resolution?: string) => {
    try {
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      if (assignedTo) {
        updateData.assigned_to = assignedTo;
      }
      
      if (resolution) {
        updateData.resolution = resolution;
      }
      
      await updateComplaint(incidentId, updateData);
    } catch (error) {
      console.error('Failed to update incident:', error);
      alert('Failed to update incident status');
    }
  };

  const handleAssignIncident = async (incidentId: string, assignedTo: string) => {
    try {
      await updateComplaint(incidentId, { 
        assigned_to: assignedTo,
        status: 'investigating',
        updated_at: new Date().toISOString()
      });
      setShowAssignModal(null);
    } catch (error) {
      console.error('Failed to assign incident:', error);
      alert('Failed to assign incident');
    }
  };

  const incidentTypes = [
    'Noise Complaint',
    'Theft',
    'Vandalism',
    'Dispute',
    'Traffic Violation',
    'Public Disturbance',
    'Property Damage',
    'Domestic Violence',
    'Drug-related',
    'Assault',
    'Robbery',
    'Fraud',
    'Cybercrime',
    'Other'
  ];

  const peaceOrderOfficers = [
    'Officer Juan Santos',
    'Officer Maria Garcia',
    'Officer Pedro Reyes',
    'Officer Ana Cruz',
    'Barangay Captain',
    'Kagawad Rodriguez',
    'Kagawad Fernandez'
  ];

  const stats = [
    { 
      label: 'Total Incidents', 
      value: incidents.length, 
      icon: AlertTriangle, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12 this month'
    },
    { 
      label: 'Pending Investigation', 
      value: incidents.filter(i => i.status === 'pending').length, 
      icon: Clock, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      trend: 'Needs attention'
    },
    { 
      label: 'Under Investigation', 
      value: incidents.filter(i => i.status === 'investigating').length, 
      icon: Search, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: 'Active cases'
    },
    { 
      label: 'Resolved Cases', 
      value: incidents.filter(i => i.status === 'resolved').length, 
      icon: CheckCircle, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '89% resolution rate'
    }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-lg p-6 border-l-4 border-blue-500`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.trend}</p>
              </div>
              <stat.icon className={`h-12 w-12 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('incidents')}
            className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">View All Incidents</h4>
              <p className="text-sm text-gray-600">Manage incident reports</p>
            </div>
          </button>
          
          <button
            onClick={() => setShowAddIncident(true)}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="h-8 w-8 text-blue-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">File New Report</h4>
              <p className="text-sm text-gray-600">Create incident report</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Crime Analytics</h4>
              <p className="text-sm text-gray-600">View statistics</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('patrol')}
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Car className="h-8 w-8 text-purple-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Patrol Schedule</h4>
              <p className="text-sm text-gray-600">Manage patrols</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent High Priority Incidents */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">High Priority Incidents</h3>
          <button 
            onClick={() => setActiveTab('incidents')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {incidents.filter(i => i.priority === 'high').slice(0, 5).map((incident) => (
            <div key={incident.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{incident.subject}</p>
                  <p className="text-sm text-gray-600">{incident.incident_type} • {incident.reporter_name}</p>
                  <p className="text-xs text-gray-500">{incident.date_submitted}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  incident.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {incident.status.toUpperCase()}
                </span>
                <button 
                  onClick={() => setSelectedIncident(incident)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crime Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Types Distribution</h3>
          <div className="space-y-3">
            {incidentTypes.slice(0, 6).map((type, index) => {
              const count = incidents.filter(i => i.incident_type === type).length;
              const percentage = incidents.length > 0 ? (count / incidents.length) * 100 : 0;
              return (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{type}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">-15%</div>
              <div className="text-sm text-green-800">Crime Rate Decrease</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">92%</div>
              <div className="text-sm text-blue-800">Resolution Rate</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">2.1 days</div>
              <div className="text-sm text-purple-800">Average Response Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIncidents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Incident Management</h2>
        <button
          onClick={() => setShowAddIncident(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          File New Report
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {incidentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {filteredIncidents.length} incidents found
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{incident.reporter_name}</div>
                      <div className="text-sm text-gray-500">{incident.reporter_email}</div>
                      {incident.reporter_phone && (
                        <div className="text-xs text-gray-400">{incident.reporter_phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      incident.incident_type?.includes('Theft') || incident.incident_type?.includes('Robbery') ? 'bg-red-100 text-red-800' :
                      incident.incident_type?.includes('Noise') || incident.incident_type?.includes('Disturbance') ? 'bg-yellow-100 text-yellow-800' :
                      incident.incident_type?.includes('Dispute') ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {incident.incident_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{incident.subject}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{incident.description}</div>
                    {incident.location && (
                      <div className="text-xs text-gray-400 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {incident.location}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      incident.priority === 'high' ? 'bg-red-100 text-red-800' :
                      incident.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {incident.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      incident.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                      incident.status === 'dismissed' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {incident.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {incident.date_submitted}
                    {incident.date_occurred && (
                      <div className="text-xs text-gray-500">
                        Occurred: {incident.date_occurred}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {incident.assigned_to ? (
                      <span className="text-blue-600 font-medium">{incident.assigned_to}</span>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => setSelectedIncident(incident)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {!incident.assigned_to && (
                      <button 
                        onClick={() => setShowAssignModal(incident)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Assign Officer"
                      >
                        <User className="h-4 w-4" />
                      </button>
                    )}
                    {incident.status === 'pending' && (
                      <button 
                        onClick={() => handleUpdateIncidentStatus(incident.id, 'investigating', user?.name)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Start Investigation"
                      >
                        <Search className="h-4 w-4" />
                      </button>
                    )}
                    {incident.status === 'investigating' && (
                      <button 
                        onClick={() => {
                          const resolution = prompt('Enter resolution details:');
                          if (resolution) {
                            handleUpdateIncidentStatus(incident.id, 'resolved', undefined, resolution);
                          }
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="Mark as Resolved"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Crime Analytics & Reports</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cases</p>
              <p className="text-3xl font-bold text-blue-600">{incidents.length}</p>
              <p className="text-sm text-green-600">+12 this month</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
              <p className="text-3xl font-bold text-green-600">92%</p>
              <p className="text-sm text-green-600">+5% improvement</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-3xl font-bold text-purple-600">2.1</p>
              <p className="text-sm text-purple-600">days</p>
            </div>
            <Clock className="h-12 w-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Cases</p>
              <p className="text-3xl font-bold text-yellow-600">
                {incidents.filter(i => i.status === 'investigating').length}
              </p>
              <p className="text-sm text-yellow-600">Under investigation</p>
            </div>
            <Search className="h-12 w-12 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Crime Hotspots */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Crime Hotspots</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <MapPin className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h4 className="text-lg font-bold text-red-600">Purok 1</h4>
            <p className="text-sm text-red-800">8 incidents this month</p>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <MapPin className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h4 className="text-lg font-bold text-yellow-600">Main Street</h4>
            <p className="text-sm text-yellow-800">5 incidents this month</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <MapPin className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h4 className="text-lg font-bold text-orange-600">Market Area</h4>
            <p className="text-sm text-orange-800">3 incidents this month</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatrol = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Patrol Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Patrols</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Car className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Patrol Unit Alpha</p>
                  <p className="text-sm text-gray-600">Officer Santos • Purok 1-3</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                ON DUTY
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Car className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Patrol Unit Bravo</p>
                  <p className="text-sm text-gray-600">Officer Garcia • Purok 4-6</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                ON DUTY
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Car className="h-6 w-6 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Patrol Unit Charlie</p>
                  <p className="text-sm text-gray-600">Officer Reyes • Purok 7-8</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                OFF DUTY
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patrol Schedule</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="font-medium text-gray-700">Time</div>
              <div className="font-medium text-gray-700">Unit</div>
              <div className="font-medium text-gray-700">Area</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-sm py-2 border-t border-gray-200">
              <div className="text-gray-900">06:00 - 14:00</div>
              <div className="text-blue-600">Alpha</div>
              <div className="text-gray-600">Purok 1-3</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-sm py-2 border-t border-gray-200">
              <div className="text-gray-900">14:00 - 22:00</div>
              <div className="text-blue-600">Bravo</div>
              <div className="text-gray-600">Purok 4-6</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-sm py-2 border-t border-gray-200">
              <div className="text-gray-900">22:00 - 06:00</div>
              <div className="text-blue-600">Charlie</div>
              <div className="text-gray-600">Purok 7-8</div>
            </div>
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
        return renderIncidents();
      case 'analytics':
        return renderAnalytics();
      case 'patrol':
        return renderPatrol();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Peace and Order Central Management</h1>
                <p className="text-red-100 mt-2 text-sm sm:text-base">Comprehensive Incident Management & Crime Prevention</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-red-100 text-sm">Welcome, {user?.name}</p>
                <p className="text-xs text-red-200 capitalize">{user?.role?.replace('-', ' ')}</p>
              </div>
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
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
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'incidents', label: 'Incident Management', icon: AlertTriangle },
              { id: 'analytics', label: 'Crime Analytics', icon: BarChart3 },
              { id: 'patrol', label: 'Patrol Management', icon: Car }
            ].map((tab) => (
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

      {/* Incident Details Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Incident Report Details</h3>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Reporter Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{selectedIncident.reporter_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedIncident.reporter_email}</p>
                    </div>
                    {selectedIncident.reporter_phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-sm text-gray-900">{selectedIncident.reporter_phone}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Incident Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      <p className="text-sm text-gray-900">{selectedIncident.incident_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Priority</label>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedIncident.priority === 'high' ? 'bg-red-100 text-red-800' :
                        selectedIncident.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedIncident.priority.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedIncident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        selectedIncident.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                        selectedIncident.status === 'dismissed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedIncident.status.toUpperCase()}
                      </span>
                    </div>
                    {selectedIncident.location && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <p className="text-sm text-gray-900">{selectedIncident.location}</p>
                      </div>
                    )}
                    {selectedIncident.date_occurred && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Date/Time Occurred</label>
                        <p className="text-sm text-gray-900">
                          {selectedIncident.date_occurred}
                          {selectedIncident.time_occurred && ` at ${selectedIncident.time_occurred}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Incident Description</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">{selectedIncident.subject}</h5>
                  <p className="text-gray-700">{selectedIncident.description}</p>
                </div>
              </div>
              
              {selectedIncident.witness_name && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Witness Information</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">
                      <strong>Name:</strong> {selectedIncident.witness_name}
                    </p>
                    {selectedIncident.witness_contact && (
                      <p className="text-sm text-gray-900">
                        <strong>Contact:</strong> {selectedIncident.witness_contact}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {selectedIncident.resolution && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Resolution</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedIncident.resolution}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <p>Submitted: {selectedIncident.date_submitted}</p>
                  <p>Last Updated: {new Date(selectedIncident.updated_at).toLocaleString()}</p>
                  {selectedIncident.assigned_to && (
                    <p>Assigned to: {selectedIncident.assigned_to}</p>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  {selectedIncident.status === 'pending' && (
                    <button
                      onClick={() => {
                        handleUpdateIncidentStatus(selectedIncident.id, 'investigating', user?.name);
                        setSelectedIncident(null);
                      }}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      Start Investigation
                    </button>
                  )}
                  {selectedIncident.status === 'investigating' && (
                    <button
                      onClick={() => {
                        const resolution = prompt('Enter resolution details:');
                        if (resolution) {
                          handleUpdateIncidentStatus(selectedIncident.id, 'resolved', undefined, resolution);
                          setSelectedIncident(null);
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Mark as Resolved
                    </button>
                  )}
                  {selectedIncident.status !== 'dismissed' && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to dismiss this incident?')) {
                          handleUpdateIncidentStatus(selectedIncident.id, 'dismissed');
                          setSelectedIncident(null);
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Officer Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Assign Officer</h3>
                <button
                  onClick={() => setShowAssignModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Incident: {showAssignModal.subject}</h4>
                <p className="text-sm text-gray-600">Type: {showAssignModal.incident_type}</p>
                <p className="text-sm text-gray-600">Priority: {showAssignModal.priority}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Officer</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAssignIncident(showAssignModal.id, e.target.value);
                    }
                  }}
                >
                  <option value="">Select an officer</option>
                  {peaceOrderOfficers.map(officer => (
                    <option key={officer} value={officer}>{officer}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Incident Modal */}
      {showAddIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">File New Incident Report</h3>
                <button
                  onClick={() => setShowAddIncident(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reporter Name</label>
                  <input
                    type="text"
                    value={newIncident.reporter_name}
                    onChange={(e) => setNewIncident({ ...newIncident, reporter_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full name of reporter"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reporter Email</label>
                  <input
                    type="email"
                    value={newIncident.reporter_email}
                    onChange={(e) => setNewIncident({ ...newIncident, reporter_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email address"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Incident Type</label>
                  <select
                    value={newIncident.incident_type}
                    onChange={(e) => setNewIncident({ ...newIncident, incident_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select incident type</option>
                    {incidentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newIncident.priority}
                    onChange={(e) => setNewIncident({ ...newIncident, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={newIncident.subject}
                  onChange={(e) => setNewIncident({ ...newIncident, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the incident"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detailed description of what happened"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={newIncident.location}
                    onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Where did this incident occur?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reporter Phone</label>
                  <input
                    type="tel"
                    value={newIncident.reporter_phone}
                    onChange={(e) => setNewIncident({ ...newIncident, reporter_phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contact number"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Occurred</label>
                  <input
                    type="date"
                    value={newIncident.date_occurred}
                    onChange={(e) => setNewIncident({ ...newIncident, date_occurred: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Occurred</label>
                  <input
                    type="time"
                    value={newIncident.time_occurred}
                    onChange={(e) => setNewIncident({ ...newIncident, time_occurred: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Witness Name (Optional)</label>
                  <input
                    type="text"
                    value={newIncident.witness_name}
                    onChange={(e) => setNewIncident({ ...newIncident, witness_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Witness full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Witness Contact (Optional)</label>
                  <input
                    type="text"
                    value={newIncident.witness_contact}
                    onChange={(e) => setNewIncident({ ...newIncident, witness_contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone or email"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddIncident(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      // Add incident logic here
                      console.log('Adding new incident:', newIncident);
                      setShowAddIncident(false);
                      setNewIncident({
                        reporter_name: '',
                        reporter_email: '',
                        reporter_phone: '',
                        incident_type: '',
                        subject: '',
                        description: '',
                        priority: 'medium',
                        location: '',
                        date_occurred: '',
                        time_occurred: '',
                        witness_name: '',
                        witness_contact: ''
                      });
                    } catch (error) {
                      console.error('Failed to add incident:', error);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  File Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}