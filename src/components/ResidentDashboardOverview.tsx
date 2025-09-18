import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  FileText, 
  AlertTriangle, 
  Shield, 
  Users, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Home,
  Award,
  Activity,
  Bell,
  CreditCard,
  Download,
  Eye,
  Plus,
  ArrowRight,
  User,
  QrCode,
  Building2
} from 'lucide-react';

export default function ResidentDashboardOverview() {
  const { user } = useAuth();
  const { documents, complaints, residents } = useData();

  // Filter data for current user
  const userDocuments = documents.filter(doc => doc.resident_id === user?.id);
  const userComplaints = complaints.filter(complaint => 
    complaint.reporter_email === user?.email || complaint.residentEmail === user?.email
  );

  const stats = [
    {
      title: 'Total Documents',
      value: userDocuments.length,
      icon: FileText,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+2 this month',
      changeColor: 'text-green-600'
    },
    {
      title: 'Pending Requests',
      value: userDocuments.filter(doc => doc.status === 'pending').length,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '3 in progress',
      changeColor: 'text-yellow-600'
    },
    {
      title: 'Completed',
      value: userDocuments.filter(doc => doc.status === 'released').length,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+1 this week',
      changeColor: 'text-green-600'
    },
    {
      title: 'Incidents Reported',
      value: userComplaints.length,
      icon: AlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      change: userComplaints.filter(c => c.status === 'resolved').length + ' resolved',
      changeColor: 'text-green-600'
    }
  ];

  const quickActions = [
    {
      title: 'Request Document',
      description: 'Apply for barangay clearance, certificates, and permits',
      icon: FileText,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      action: 'documents'
    },
    {
      title: 'Report Incident',
      description: 'Report issues, complaints, or emergencies',
      icon: AlertTriangle,
      color: 'bg-red-600',
      hoverColor: 'hover:bg-red-700',
      action: 'incidents'
    },
    {
      title: 'Update Profile',
      description: 'Manage your personal information and settings',
      icon: User,
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
      action: 'profile'
    },
    {
      title: 'View QR Code',
      description: 'Access your digital identification code',
      icon: QrCode,
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      action: 'qr-code'
    }
  ];

  const recentActivities = [
    {
      type: 'document',
      title: 'Barangay Clearance Approved',
      description: 'Your barangay clearance request has been approved and is ready for pickup',
      time: '2 hours ago',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      type: 'verification',
      title: 'Profile Updated',
      description: 'Your profile information has been successfully updated',
      time: '1 day ago',
      icon: User,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      type: 'incident',
      title: 'Incident Report Submitted',
      description: 'Your noise complaint has been submitted and assigned to an officer',
      time: '3 days ago',
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-blue-100 text-lg">
              Manage your barangay services and stay connected with your community
            </p>
            <div className="flex items-center mt-4 space-x-6">
              <div className="flex items-center text-blue-100">
                <Shield className="h-4 w-4 mr-2" />
                <span className="text-sm capitalize">
                  {user?.verificationStatus?.replace('-', ' ') || 'Non Verified'}
                </span>
              </div>
              <div className="flex items-center text-blue-100">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  Member since {user?.dateRegistered ? new Date(user.dateRegistered).getFullYear() : 'Recently'}
                </span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <Building2 className="h-16 w-16 text-white opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
              <p className={`text-xs font-medium ${stat.changeColor}`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <span className="text-sm text-gray-500">Most used services</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setActiveTab?.(action.action)}
              className={`${action.color} ${action.hoverColor} text-white p-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg group`}
            >
              <action.icon className="h-8 w-8 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
              <p className="text-sm opacity-90 leading-relaxed">{action.description}</p>
              <ArrowRight className="h-4 w-4 mt-3 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                  <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{activity.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Account Status</h2>
          <div className="space-y-6">
            {/* Verification Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Verification Status</h4>
                  <p className="text-sm text-gray-600 capitalize">
                    {user?.verificationStatus?.replace('-', ' ') || 'Non Verified'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab?.('verification')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Details
              </button>
            </div>

            {/* QR Code Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <QrCode className="h-5 w-5 text-purple-600" />
                <div>
                  <h4 className="font-medium text-gray-900">QR Code</h4>
                  <p className="text-sm text-gray-600">
                    {user?.qrCode ? 'Available' : 'Not Generated'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab?.('qr-code')}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                {user?.qrCode ? 'View Code' : 'Generate'}
              </button>
            </div>

            {/* Location Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-gray-900">House Location</h4>
                  <p className="text-sm text-gray-600">
                    {user?.houseLocation ? 'Pinned' : 'Not Set'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab?.('location')}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                {user?.houseLocation ? 'View Map' : 'Set Location'}
              </button>
            </div>

            {/* Family Tree Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-orange-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Family Members</h4>
                  <p className="text-sm text-gray-600">
                    {user?.familyTree?.length || 0} members added
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab?.('family')}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements & Updates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Community Updates</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center mb-3">
              <Bell className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-xs font-semibold text-blue-800 uppercase">Important</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Community Health Drive</h4>
            <p className="text-sm text-gray-600 mb-3">
              Free medical checkup and vaccination for all residents. March 25-27, 2024.
            </p>
            <span className="text-xs text-gray-500">2 days ago</span>
          </div>

          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <div className="flex items-center mb-3">
              <Activity className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-xs font-semibold text-green-800 uppercase">Event</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Barangay Assembly</h4>
            <p className="text-sm text-gray-600 mb-3">
              Monthly community meeting on March 30, 2024 at 7:00 PM. All residents invited.
            </p>
            <span className="text-xs text-gray-500">5 days ago</span>
          </div>

          <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div className="flex items-center mb-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-xs font-semibold text-yellow-800 uppercase">Notice</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Road Maintenance</h4>
            <p className="text-sm text-gray-600 mb-3">
              Main Street maintenance scheduled for March 25-27. Use alternative routes.
            </p>
            <span className="text-xs text-gray-500">1 week ago</span>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Barangay Office</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Phone</h4>
              <p className="text-sm text-gray-600">+63 2 8123 4567</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-3 bg-green-100 rounded-lg">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Email</h4>
              <p className="text-sm text-gray-600">info@barangaysanmiguel.gov.ph</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Home className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Office Hours</h4>
              <p className="text-sm text-gray-600">8:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}