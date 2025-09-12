import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Building, 
  FileText, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  AlertCircle,
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
  DollarSign,
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
  Shield,
  Briefcase,
  Store,
  Factory,
  Home
} from 'lucide-react';

const BusinessPortal: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const [applications, setApplications] = useState([
    {
      id: '1',
      businessName: 'Santos Sari-Sari Store',
      ownerName: 'Maria Santos',
      businessType: 'Retail',
      permitType: 'new',
      status: 'approved',
      applicationDate: '2024-02-15',
      approvalDate: '2024-02-28',
      expiryDate: '2025-02-28',
      fee: 2500,
      paymentStatus: 'paid',
      documents: ['DTI Registration', 'Sanitary Permit', 'Fire Safety Certificate']
    },
    {
      id: '2',
      businessName: 'Dela Cruz Auto Repair',
      ownerName: 'Juan Dela Cruz',
      businessType: 'Service',
      permitType: 'renewal',
      status: 'under-review',
      applicationDate: '2024-03-10',
      fee: 3000,
      paymentStatus: 'paid',
      documents: ['DTI Registration', 'Environmental Compliance']
    },
    {
      id: '3',
      businessName: 'Garcia Bakery',
      ownerName: 'Ana Garcia',
      businessType: 'Food Service',
      permitType: 'new',
      status: 'pending',
      applicationDate: '2024-03-18',
      fee: 3500,
      paymentStatus: 'unpaid',
      documents: ['DTI Registration']
    }
  ]);

  const [newApplication, setNewApplication] = useState({
    businessName: '',
    ownerName: '',
    ownerEmail: '',
    businessType: '',
    permitType: 'new',
    address: '',
    contactNumber: '',
    description: '',
    expectedEmployees: '',
    operatingHours: '',
    businessArea: ''
  });

  const handleLogout = () => {
    try {
      const { logout } = useAuth();
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/');
    }
  };

  const handleSubmitApplication = () => {
    if (newApplication.businessName && newApplication.ownerName && newApplication.businessType) {
      const application = {
        id: Date.now().toString(),
        ...newApplication,
        status: 'pending',
        applicationDate: new Date().toISOString().split('T')[0],
        fee: calculateFee(newApplication.businessType),
        paymentStatus: 'unpaid',
        documents: []
      };
      setApplications(prev => [application, ...prev]);
      setNewApplication({
        businessName: '',
        ownerName: '',
        ownerEmail: '',
        businessType: '',
        permitType: 'new',
        address: '',
        contactNumber: '',
        description: '',
        expectedEmployees: '',
        operatingHours: '',
        businessArea: ''
      });
      setShowApplicationForm(false);
    }
  };

  const calculateFee = (businessType: string): number => {
    const fees: { [key: string]: number } = {
      'Retail': 2500,
      'Service': 3000,
      'Food Service': 3500,
      'Manufacturing': 5000,
      'Professional': 2000,
      'Other': 2500
    };
    return fees[businessType] || 2500;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'under-review': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBusinessTypeIcon = (type: string) => {
    switch (type) {
      case 'Retail': return Store;
      case 'Service': return Briefcase;
      case 'Food Service': return Home;
      case 'Manufacturing': return Factory;
      default: return Building;
    }
  };

  const stats = [
    { label: 'Total Applications', value: applications.length.toString(), icon: FileText, color: 'bg-blue-500', trend: '+12%' },
    { label: 'Approved Permits', value: applications.filter(a => a.status === 'approved').length.toString(), icon: CheckCircle, color: 'bg-green-500', trend: '+8%' },
    { label: 'Pending Review', value: applications.filter(a => a.status === 'pending' || a.status === 'under-review').length.toString(), icon: Clock, color: 'bg-yellow-500', trend: '+5%' },
    { label: 'Total Revenue', value: `₱${applications.filter(a => a.paymentStatus === 'paid').reduce((sum, a) => sum + a.fee, 0).toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500', trend: '+15%' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend} from last month
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
            onClick={() => setShowApplicationForm(true)}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="h-8 w-8 text-blue-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">New Application</h4>
              <p className="text-sm text-gray-600">Apply for permit</p>
            </div>
          </button>
          
          <button
            onClick={() => setShowDocumentUpload(true)}
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Upload className="h-8 w-8 text-green-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Upload Documents</h4>
              <p className="text-sm text-gray-600">Submit requirements</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <CreditCard className="h-8 w-8 text-purple-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Pay Fees</h4>
              <p className="text-sm text-gray-600">Online payment</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <Download className="h-8 w-8 text-orange-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Download Permits</h4>
              <p className="text-sm text-gray-600">Get certificates</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
          <button 
            onClick={() => setActiveTab('applications')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {applications.slice(0, 3).map((app) => {
            const BusinessIcon = getBusinessTypeIcon(app.businessType);
            return (
              <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <BusinessIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{app.businessName}</p>
                    <p className="text-sm text-gray-600">{app.businessType} • {app.applicationDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">₱{app.fee.toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Business Analytics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600 mb-1">85%</div>
            <div className="text-sm text-blue-800">Approval Rate</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 mb-1">7 days</div>
            <div className="text-sm text-green-800">Avg. Processing Time</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Building className="h-12 w-12 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600 mb-1">156</div>
            <div className="text-sm text-purple-800">Active Businesses</div>
          </div>
        </div>
      </div>

      {/* Business Support Network */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Building className="h-5 w-5 mr-2" />
          Business Support Network
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Government Agencies</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <p>🏛️ DTI Office: +63 2 8123 4567</p>
              <p>🔥 Fire Department: +63 2 8234 5678</p>
              <p>🏥 Health Department: +63 2 8345 6789</p>
              <p>🌍 Environmental Office: +63 2 8456 7890</p>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Business Support</h4>
            <div className="space-y-1 text-sm text-green-700">
              <p>💼 Business Helpdesk: +63 2 8567 8901</p>
              <p>📋 Permit Assistance: +63 2 8678 9012</p>
              <p>💰 Financial Aid: +63 2 8789 0123</p>
              <p>📚 Training Center: +63 2 8890 1234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Business Permit Applications</h2>
        <button 
          onClick={() => setShowApplicationForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search applications..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => {
                const BusinessIcon = getBusinessTypeIcon(app.businessType);
                return (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <BusinessIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{app.businessName}</div>
                          <div className="text-sm text-gray-500">{app.ownerName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.businessType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(app.paymentStatus)}`}>
                        {app.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.applicationDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      {app.status === 'approved' && (
                        <button className="text-purple-600 hover:text-purple-900">
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
        <button 
          onClick={() => setShowDocumentUpload(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Documents
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'DTI Business Registration',
            'Sanitary Permit',
            'Fire Safety Certificate',
            'Environmental Compliance Certificate',
            'Zoning Clearance',
            'Building Permit (if applicable)',
            'Professional License (if applicable)',
            'Tax Identification Number (TIN)'
          ].map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-gray-900">{doc}</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  Upload
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-gray-900">
                ₱{applications.filter(a => a.paymentStatus === 'paid').reduce((sum, a) => sum + a.fee, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unpaid</p>
              <p className="text-2xl font-bold text-gray-900">
                ₱{applications.filter(a => a.paymentStatus === 'unpaid').reduce((sum, a) => sum + a.fee, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₱{applications.reduce((sum, a) => sum + a.fee, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
        <div className="space-y-3">
          {applications.filter(a => a.paymentStatus === 'paid').map((app) => (
            <div key={app.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{app.businessName}</p>
                <p className="text-sm text-gray-600">Business Permit Fee</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">₱{app.fee.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{app.approvalDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'documents', label: 'Documents', icon: Upload },
    { id: 'payments', label: 'Payments', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-blue-200 hover:text-white flex items-center"
              >
                <ArrowLeft className="h-6 w-6" />
                <span className="ml-2 hidden sm:inline">Home</span>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                  <Building className="mr-3 h-8 w-8" />
                  Business Portal
                </h1>
                <p className="text-blue-100 mt-2 text-sm sm:text-base">Business Permit Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-blue-100 text-sm">Welcome, Business Owner</p>
                <p className="text-xs text-blue-200">Manage your permits</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-blue-200 hover:text-white hover:bg-blue-700 rounded-lg transition-colors"
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'documents' && renderDocuments()}
        {activeTab === 'payments' && renderPayments()}
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">New Business Permit Application</h3>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={newApplication.businessName}
                  onChange={(e) => setNewApplication({...newApplication, businessName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter business name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  value={newApplication.ownerName}
                  onChange={(e) => setNewApplication({...newApplication, ownerName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter owner name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newApplication.ownerEmail}
                  onChange={(e) => setNewApplication({...newApplication, ownerEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                <select
                  value={newApplication.businessType}
                  onChange={(e) => setNewApplication({...newApplication, businessType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select business type</option>
                  <option value="Retail">Retail</option>
                  <option value="Service">Service</option>
                  <option value="Food Service">Food Service</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Professional">Professional</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permit Type</label>
                <select
                  value={newApplication.permitType}
                  onChange={(e) => setNewApplication({...newApplication, permitType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="new">New Application</option>
                  <option value="renewal">Renewal</option>
                  <option value="amendment">Amendment</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="tel"
                  value={newApplication.contactNumber}
                  onChange={(e) => setNewApplication({...newApplication, contactNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+63 912 345 6789"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                <textarea
                  value={newApplication.address}
                  onChange={(e) => setNewApplication({...newApplication, address: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter complete business address"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                <textarea
                  value={newApplication.description}
                  onChange={(e) => setNewApplication({...newApplication, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your business activities"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowApplicationForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApplication}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {showDocumentUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Upload Documents</h3>
              <button
                onClick={() => setShowDocumentUpload(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select document type</option>
                  <option value="dti">DTI Registration</option>
                  <option value="sanitary">Sanitary Permit</option>
                  <option value="fire">Fire Safety Certificate</option>
                  <option value="environmental">Environmental Compliance</option>
                  <option value="zoning">Zoning Clearance</option>
                  <option value="building">Building Permit</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDocumentUpload(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Application Details</h3>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Business Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Business Name</label>
                    <p className="text-sm text-gray-900">{selectedApplication.businessName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Owner</label>
                    <p className="text-sm text-gray-900">{selectedApplication.ownerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Business Type</label>
                    <p className="text-sm text-gray-900">{selectedApplication.businessType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Permit Type</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedApplication.permitType}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Application Status</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedApplication.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Application Date</label>
                    <p className="text-sm text-gray-900">{selectedApplication.applicationDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Fee</label>
                    <p className="text-sm text-gray-900">₱{selectedApplication.fee.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Payment Status</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedApplication.paymentStatus}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Submitted Documents</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedApplication.documents.map((doc: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800">{doc}</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessPortal;