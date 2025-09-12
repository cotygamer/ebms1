import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Shield, 
  FileText, 
  Camera, 
  Clock, 
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  LogOut,
  Activity,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  X,
  Save,
  Bell,
  TrendingUp,
  BarChart3,
  CheckCircle,
  UserCheck,
  Radio,
  Siren,
  Clipboard
} from 'lucide-react';

const SecurityPortal: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [showBlotterForm, setShowBlotterForm] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [selectedBlotter, setSelectedBlotter] = useState<any>(null);

  const [incidents, setIncidents] = useState([
    {
      id: '1',
      type: 'Theft',
      description: 'Motorcycle theft reported at Purok 3',
      location: 'Purok 3, Main Street',
      dateTime: '2024-03-20 14:30',
      reporter: 'Juan Dela Cruz',
      reporterContact: '+63 912 345 6789',
      status: 'investigating',
      priority: 'high',
      assignedOfficer: 'Officer Santos',
      evidence: ['Photo of scene', 'Witness statement']
    },
    {
      id: '2',
      type: 'Noise Complaint',
      description: 'Loud music disturbing neighbors',
      location: 'Purok 1, Oak Street',
      dateTime: '2024-03-19 22:15',
      reporter: 'Maria Garcia',
      reporterContact: '+63 917 654 3210',
      status: 'resolved',
      priority: 'medium',
      assignedOfficer: 'Officer Martinez',
      evidence: []
    },
    {
      id: '3',
      type: 'Vandalism',
      description: 'Graffiti on public property',
      location: 'Barangay Hall',
      dateTime: '2024-03-18 08:00',
      reporter: 'Security Guard',
      reporterContact: '+63 918 765 4321',
      status: 'reported',
      priority: 'low',
      assignedOfficer: 'Officer Lopez',
      evidence: ['Photos of vandalism']
    }
  ]);

  const [blotterEntries, setBlotterEntries] = useState([
    {
      id: '1',
      caseNumber: 'BLT-2024-001',
      complainant: {
        name: 'Pedro Martinez',
        address: 'Purok 2, Pine Street',
        contact: '+63 919 876 5432'
      },
      respondent: {
        name: 'Carlos Rivera',
        address: 'Purok 2, Pine Street',
        contact: '+63 920 987 6543'
      },
      incidentDetails: 'Boundary dispute between neighbors regarding fence construction',
      incidentDate: '2024-03-15',
      location: 'Purok 2, Pine Street',
      status: 'active',
      officerOnDuty: 'Officer Santos',
      caseType: 'civil',
      severity: 'minor',
      witnesses: [
        { name: 'Rosa Lopez', contact: '+63 921 098 7654' }
      ]
    },
    {
      id: '2',
      caseNumber: 'BLT-2024-002',
      complainant: {
        name: 'Ana Cruz',
        address: 'Purok 1, Main Street',
        contact: '+63 922 109 8765'
      },
      respondent: {
        name: 'Miguel Santos',
        address: 'Purok 1, Main Street',
        contact: '+63 923 210 9876'
      },
      incidentDetails: 'Verbal altercation over parking space',
      incidentDate: '2024-03-18',
      location: 'Purok 1, Main Street',
      status: 'resolved',
      officerOnDuty: 'Officer Martinez',
      caseType: 'civil',
      severity: 'minor',
      witnesses: []
    }
  ]);

  const [newIncident, setNewIncident] = useState({
    type: '',
    description: '',
    location: '',
    dateTime: '',
    reporterName: '',
    reporterContact: '',
    reporterAddress: '',
    priority: 'medium',
    assignedOfficer: ''
  });

  const [newBlotter, setNewBlotter] = useState({
    complainant: {
      name: '',
      address: '',
      contact: '',
      age: '',
      civilStatus: ''
    },
    respondent: {
      name: '',
      address: '',
      contact: '',
      age: '',
      civilStatus: ''
    },
    incidentDetails: '',
    incidentDate: '',
    incidentTime: '',
    location: '',
    caseType: 'civil',
    severity: 'minor',
    officerOnDuty: ''
  });

  const handleLogout = () => {
    const { logout } = useAuth();
    logout();
    navigate('/');
  };

  const handleSubmitIncident = () => {
    if (newIncident.type && newIncident.description && newIncident.location) {
      const incident = {
        id: Date.now().toString(),
        ...newIncident,
        status: 'reported',
        evidence: [],
        dateTime: newIncident.dateTime || new Date().toISOString().slice(0, 16).replace('T', ' ')
      };
      setIncidents(prev => [incident, ...prev]);
      setNewIncident({
        type: '',
        description: '',
        location: '',
        dateTime: '',
        reporterName: '',
        reporterContact: '',
        reporterAddress: '',
        priority: 'medium',
        assignedOfficer: ''
      });
      setShowIncidentForm(false);
    }
  };

  const handleSubmitBlotter = () => {
    if (newBlotter.complainant.name && newBlotter.respondent.name && newBlotter.incidentDetails) {
      const blotter = {
        id: Date.now().toString(),
        caseNumber: `BLT-2024-${String(blotterEntries.length + 1).padStart(3, '0')}`,
        ...newBlotter,
        status: 'active',
        witnesses: []
      };
      setBlotterEntries(prev => [blotter, ...prev]);
      setNewBlotter({
        complainant: { name: '', address: '', contact: '', age: '', civilStatus: '' },
        respondent: { name: '', address: '', contact: '', age: '', civilStatus: '' },
        incidentDetails: '',
        incidentDate: '',
        incidentTime: '',
        location: '',
        caseType: 'civil',
        severity: 'minor',
        officerOnDuty: ''
      });
      setShowBlotterForm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'reported': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    { label: 'Total Incidents', value: incidents.length.toString(), icon: AlertTriangle, color: 'bg-red-500', trend: '+5%' },
    { label: 'Active Cases', value: incidents.filter(i => i.status === 'investigating').length.toString(), icon: Activity, color: 'bg-blue-500', trend: '+12%' },
    { label: 'Resolved Today', value: incidents.filter(i => i.status === 'resolved').length.toString(), icon: CheckCircle, color: 'bg-green-500', trend: '+8%' },
    { label: 'Blotter Entries', value: blotterEntries.length.toString(), icon: FileText, color: 'bg-purple-500', trend: '+3%' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend} from last week
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setShowIncidentForm(true)}
            className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Report Incident</h4>
              <p className="text-sm text-gray-600">File new report</p>
            </div>
          </button>
          
          <button
            onClick={() => setShowBlotterForm(true)}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Blotter Entry</h4>
              <p className="text-sm text-gray-600">Record case</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Radio className="h-8 w-8 text-green-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Radio Check</h4>
              <p className="text-sm text-gray-600">Communication test</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Clipboard className="h-8 w-8 text-purple-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Daily Report</h4>
              <p className="text-sm text-gray-600">Generate report</p>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Incidents */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Incidents</h3>
            <button 
              onClick={() => setActiveTab('incidents')}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {incidents.slice(0, 3).map((incident) => (
              <div key={incident.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{incident.type}</p>
                    <p className="text-sm text-gray-600">{incident.location} • {incident.dateTime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                    {incident.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{incident.priority} priority</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Blotter Cases */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Blotter Cases</h3>
            <button 
              onClick={() => setActiveTab('blotter')}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {blotterEntries.filter(b => b.status === 'active').map((blotter) => (
              <div key={blotter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{blotter.caseNumber}</p>
                    <p className="text-sm text-gray-600">{blotter.complainant.name} vs {blotter.respondent.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(blotter.status)}`}>
                    {blotter.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{blotter.incidentDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <Shield className="h-12 w-12 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600 mb-1">92%</div>
            <div className="text-sm text-red-800">Response Rate</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600 mb-1">8 min</div>
            <div className="text-sm text-blue-800">Avg. Response Time</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 mb-1">78%</div>
            <div className="text-sm text-green-800">Resolution Rate</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIncidents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Incident Reports</h2>
        <button 
          onClick={() => setShowIncidentForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Report Incident
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {incidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{incident.type}</div>
                      <div className="text-sm text-gray-500">{incident.dateTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.reporter}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(incident.priority)}`}>
                      {incident.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedIncident(incident)}
                      className="text-blue-600 hover:text-blue-900"
                    >
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

  const renderBlotter = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Blotter Entries</h2>
        <button 
          onClick={() => setShowBlotterForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parties</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blotterEntries.map((blotter) => (
                <tr key={blotter.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{blotter.caseNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{blotter.complainant.name}</div>
                      <div className="text-gray-500">vs {blotter.respondent.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{blotter.caseType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(blotter.status)}`}>
                      {blotter.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{blotter.incidentDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedBlotter(blotter)}
                      className="text-blue-600 hover:text-blue-900"
                    >
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
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'blotter', label: 'Blotter', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-red-200 hover:text-white flex items-center"
              >
                <ArrowLeft className="h-6 w-6" />
                <span className="ml-2 hidden sm:inline">Home</span>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                  <Shield className="mr-3 h-8 w-8" />
                  Security Portal
                </h1>
                <p className="text-red-100 mt-2 text-sm sm:text-base">Barangay Security Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-red-100 text-sm">Welcome, Security Personnel</p>
                <p className="text-xs text-red-200">Badge: SEC-001</p>
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
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'incidents' && renderIncidents()}
        {activeTab === 'blotter' && renderBlotter()}
        {activeTab === 'reports' && (
          <div className="text-center py-12">
            <BarChart3 className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Reports</h3>
            <p className="text-gray-600">Generate comprehensive security reports and analytics</p>
          </div>
        )}
      </div>

      {/* Incident Form Modal */}
      {showIncidentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Report New Incident</h3>
              <button
                onClick={() => setShowIncidentForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Incident Type</label>
                <select
                  value={newIncident.type}
                  onChange={(e) => setNewIncident({...newIncident, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select incident type</option>
                  <option value="Theft">Theft</option>
                  <option value="Assault">Assault</option>
                  <option value="Vandalism">Vandalism</option>
                  <option value="Noise Complaint">Noise Complaint</option>
                  <option value="Domestic Dispute">Domestic Dispute</option>
                  <option value="Traffic Violation">Traffic Violation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                <select
                  value={newIncident.priority}
                  onChange={(e) => setNewIncident({...newIncident, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={newIncident.dateTime}
                  onChange={(e) => setNewIncident({...newIncident, dateTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newIncident.location}
                  onChange={(e) => setNewIncident({...newIncident, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter incident location"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reporter Name</label>
                <input
                  type="text"
                  value={newIncident.reporterName}
                  onChange={(e) => setNewIncident({...newIncident, reporterName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter reporter name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reporter Contact</label>
                <input
                  type="tel"
                  value={newIncident.reporterContact}
                  onChange={(e) => setNewIncident({...newIncident, reporterContact: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="+63 912 345 6789"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Incident Description</label>
                <textarea
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Provide detailed description of the incident"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowIncidentForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitIncident}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blotter Form Modal */}
      {showBlotterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">New Blotter Entry</h3>
              <button
                onClick={() => setShowBlotterForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Complainant Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Complainant Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newBlotter.complainant.name}
                      onChange={(e) => setNewBlotter({
                        ...newBlotter,
                        complainant: { ...newBlotter.complainant, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter complainant name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input
                      type="tel"
                      value={newBlotter.complainant.contact}
                      onChange={(e) => setNewBlotter({
                        ...newBlotter,
                        complainant: { ...newBlotter.complainant, contact: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="+63 912 345 6789"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={newBlotter.complainant.address}
                      onChange={(e) => setNewBlotter({
                        ...newBlotter,
                        complainant: { ...newBlotter.complainant, address: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter complainant address"
                    />
                  </div>
                </div>
              </div>

              {/* Respondent Information */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Respondent Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newBlotter.respondent.name}
                      onChange={(e) => setNewBlotter({
                        ...newBlotter,
                        respondent: { ...newBlotter.respondent, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter respondent name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input
                      type="tel"
                      value={newBlotter.respondent.contact}
                      onChange={(e) => setNewBlotter({
                        ...newBlotter,
                        respondent: { ...newBlotter.respondent, contact: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="+63 912 345 6789"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={newBlotter.respondent.address}
                      onChange={(e) => setNewBlotter({
                        ...newBlotter,
                        respondent: { ...newBlotter.respondent, address: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter respondent address"
                    />
                  </div>
                </div>
              </div>

              {/* Incident Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Incident Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Incident Date</label>
                    <input
                      type="date"
                      value={newBlotter.incidentDate}
                      onChange={(e) => setNewBlotter({...newBlotter, incidentDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Incident Time</label>
                    <input
                      type="time"
                      value={newBlotter.incidentTime}
                      onChange={(e) => setNewBlotter({...newBlotter, incidentTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Case Type</label>
                    <select
                      value={newBlotter.caseType}
                      onChange={(e) => setNewBlotter({...newBlotter, caseType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="civil">Civil</option>
                      <option value="criminal">Criminal</option>
                      <option value="administrative">Administrative</option>
                      <option value="domestic">Domestic</option>
                      <option value="noise">Noise</option>
                      <option value="property">Property</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select
                      value={newBlotter.severity}
                      onChange={(e) => setNewBlotter({...newBlotter, severity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="minor">Minor</option>
                      <option value="moderate">Moderate</option>
                      <option value="major">Major</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={newBlotter.location}
                      onChange={(e) => setNewBlotter({...newBlotter, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter incident location"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Incident Details</label>
                    <textarea
                      value={newBlotter.incidentDetails}
                      onChange={(e) => setNewBlotter({...newBlotter, incidentDetails: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Provide detailed description of the incident"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Officer on Duty</label>
                    <input
                      type="text"
                      value={newBlotter.officerOnDuty}
                      onChange={(e) => setNewBlotter({...newBlotter, officerOnDuty: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter officer name"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowBlotterForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitBlotter}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Create Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityPortal;