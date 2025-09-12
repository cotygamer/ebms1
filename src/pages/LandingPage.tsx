import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { 
  Building2, 
  Users, 
  Shield, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Heart,
  Award,
  Globe,
  Smartphone,
  Bell,
  AlertTriangle,
  Calendar,
  Camera,
  TrendingUp,
  Target,
  Eye,
  ChevronRight,
  Search,
  Download,
  ExternalLink,
  Info,
  Scale,
  BookOpen,
  Gavel,
  Building,
  Calculator,
  Activity,
  Briefcase
} from 'lucide-react';

export default function LandingPage() {
  const { systemSettings, residents } = useData();
  
  // Mock data for announcements (in real app, this would come from API)
  const [announcements] = useState([
    {
      id: 1,
      title: 'Community Health Drive - Free Medical Checkup',
      content: 'Free medical checkup and vaccination for all residents. Bring your barangay ID and health records.',
      type: 'health',
      priority: 'high',
      date: '2024-03-20',
      author: 'Barangay Health Center'
    },
    {
      id: 2,
      title: 'Road Maintenance Schedule',
      content: 'Main Street will undergo maintenance from March 25-27. Please use alternative routes.',
      type: 'notice',
      priority: 'medium',
      date: '2024-03-18',
      author: 'Public Works'
    },
    {
      id: 3,
      title: 'Barangay Assembly Meeting',
      content: 'Monthly barangay assembly meeting on March 30, 2024 at 7:00 PM. All residents are invited.',
      type: 'event',
      priority: 'medium',
      date: '2024-03-15',
      author: 'Barangay Council'
    }
  ]);

  // Mock data for projects (in real app, this would come from API)
  const [projects] = useState([
    {
      id: 1,
      title: 'Digital Barangay Management System',
      description: 'Complete digital transformation of barangay services with online processing and QR code system.',
      category: 'technology',
      status: 'completed',
      budget: 500000,
      beneficiaries: 1245,
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
      achievements: ['100% digital transformation', '98% user satisfaction', 'Reduced processing time by 80%']
    },
    {
      id: 2,
      title: 'Community Health Center Upgrade',
      description: 'Modern medical equipment and facility improvements for better healthcare services.',
      category: 'health',
      status: 'completed',
      budget: 750000,
      beneficiaries: 1245,
      image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg',
      achievements: ['New medical equipment', 'Increased capacity by 50%', 'Improved healthcare services']
    },
    {
      id: 3,
      title: 'Road Infrastructure Improvement',
      description: 'Major road rehabilitation with proper drainage systems for all main streets.',
      category: 'infrastructure',
      status: 'completed',
      budget: 1200000,
      beneficiaries: 1245,
      image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg',
      achievements: ['5km of roads improved', 'Better drainage system', 'Reduced flooding incidents']
    }
  ]);

  // Mock data for warnings/alerts
  const [alerts] = useState([
    {
      id: 1,
      type: 'weather',
      title: 'Heavy Rainfall Warning',
      message: 'Heavy rainfall expected in the next 24 hours. Residents in low-lying areas should be prepared.',
      priority: 'high',
      date: '2024-03-20'
    }
  ]);

  const [barangayInfo, setBarangayInfo] = useState({
    name: systemSettings.barangayName || 'Barangay San Miguel',
    address: systemSettings.barangayAddress || 'San Miguel, Metro Manila, Philippines',
    phone: systemSettings.contactNumber || '+63 2 8123 4567',
    email: systemSettings.emailAddress || 'info@barangaysanmiguel.gov.ph',
    website: systemSettings.website || 'https://barangaysanmiguel.gov.ph',
    facebook: systemSettings.facebookPage || 'https://facebook.com/barangaysanmiguel',
    hours: systemSettings.operatingHours || '8:00 AM - 5:00 PM'
  });

  // Listen for barangay settings updates
  useEffect(() => {
    const handleSettingsUpdate = (event: any) => {
      const updatedSettings = event.detail;
      setBarangayInfo({
        name: updatedSettings.barangayName || 'Barangay San Miguel',
        address: updatedSettings.barangayAddress || 'San Miguel, Metro Manila, Philippines',
        phone: updatedSettings.contactNumber || '+63 2 8123 4567',
        email: updatedSettings.emailAddress || 'info@barangaysanmiguel.gov.ph',
        website: updatedSettings.website || 'https://barangaysanmiguel.gov.ph',
        facebook: updatedSettings.facebookPage || 'https://facebook.com/barangaysanmiguel',
        hours: updatedSettings.operatingHours || '8:00 AM - 5:00 PM'
      });
    };

    window.addEventListener('barangaySettingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('barangaySettingsUpdated', handleSettingsUpdate);
  }, []);

  // Update barangay info when systemSettings change
  useEffect(() => {
    setBarangayInfo({
      name: systemSettings.barangayName || 'Barangay San Miguel',
      address: systemSettings.barangayAddress || 'San Miguel, Metro Manila, Philippines',
      phone: systemSettings.contactNumber || '+63 2 8123 4567',
      email: systemSettings.emailAddress || 'info@barangaysanmiguel.gov.ph',
      website: systemSettings.website || 'https://barangaysanmiguel.gov.ph',
      facebook: systemSettings.facebookPage || 'https://facebook.com/barangaysanmiguel',
      hours: systemSettings.operatingHours || '8:00 AM - 5:00 PM'
    });
  }, [systemSettings]);

  const [showContactForm, setShowContactForm] = useState(false);
  const [showFOIForm, setShowFOIForm] = useState(false);
  const [showTrackingWidget, setShowTrackingWidget] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  const [foiRequest, setFoiRequest] = useState({
    requestorName: '',
    email: '',
    address: '',
    contactNumber: '',
    informationRequested: '',
    purpose: '',
    preferredFormat: 'digital'
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message to the backend
    alert('Thank you for your message! We will get back to you soon.');
    setContactForm({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    setShowContactForm(false);
  };

  const handleFOISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the FOI request
    alert('Your Freedom of Information request has been submitted. You will receive a tracking number via email.');
    setFoiRequest({
      requestorName: '',
      email: '',
      address: '',
      contactNumber: '',
      informationRequested: '',
      purpose: '',
      preferredFormat: 'digital'
    });
    setShowFOIForm(false);
  };

  const handleTrackApplication = () => {
    if (trackingNumber) {
      // Mock tracking result
      alert(`Tracking ${trackingNumber}: Your application is currently being processed. Expected completion: 3-5 business days.`);
    }
  };

  const services = [
    {
      icon: FileText,
      title: 'Document Services',
      description: 'Barangay Clearance, Certificates, Business Permits',
      features: ['Online Application', 'Fast Processing', 'Digital Copies'],
      link: '/register'
    },
    {
      icon: Users,
      title: 'Resident Registration',
      description: 'Digital ID System with QR Code Verification',
      features: ['Digital ID', 'QR Code', 'Family Tree'],
      link: '/register'
    },
    {
      icon: Building,
      title: 'Business Services',
      description: 'Business Permits and Commercial Registration',
      features: ['Online Application', 'Document Upload', 'Payment Processing'],
      link: '/business-portal'
    },
    {
      icon: Shield,
      title: 'Security Services',
      description: 'Incident Reporting and Community Safety',
      features: ['24/7 Reporting', 'Emergency Response', 'Safety Programs'],
      link: '/security-portal'
    },
    {
      icon: Heart,
      title: 'Health Services',
      description: 'Community Health Programs and Medical Services',
      features: ['Health Center', 'Medical Records', 'Vaccination Programs'],
      link: '/register'
    },
    {
      icon: Calculator,
      title: 'Financial Services',
      description: 'Payment Processing and Financial Management',
      features: ['Online Payments', 'Fee Calculator', 'Receipt Generation'],
      link: '/register'
    }
  ];

  const stats = [
    { number: residents.length.toString(), label: 'Registered Residents', icon: Users },
    { number: residents.filter(r => r.verificationStatus === 'verified').length.toString(), label: 'Verified Residents', icon: Shield },
    { number: '2,341', label: 'Documents Processed', icon: FileText },
    { number: '99.9%', label: 'Service Satisfaction', icon: Star }
  ];

  const testimonials = [
    {
      name: 'Maria Santos',
      role: 'Local Resident',
      content: 'The digital system made getting my barangay clearance so much easier. I was able to apply online and pick it up the next day!',
      rating: 5
    },
    {
      name: 'Juan Dela Cruz',
      role: 'Business Owner',
      content: 'Processing my business permit was quick and transparent. The online tracking system kept me updated throughout the process.',
      rating: 5
    },
    {
      name: 'Ana Garcia',
      role: 'Senior Citizen',
      content: 'The staff is very helpful and the new QR code system makes transactions faster. Great improvement for our community!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{barangayInfo.name}</h1>
                <p className="text-sm text-gray-600">Digital Government Services</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">Services</a>
              <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#transparency" className="text-gray-600 hover:text-blue-600 transition-colors">Transparency</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            </div>
            
            <div className="md:hidden">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Welcome to <span className="text-blue-600">{barangayInfo.name}</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Experience modern, efficient, and transparent barangay services through our comprehensive digital platform. 
                Get your documents processed faster, stay connected with community updates, and access services 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Contact Us
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Digital Services Portal</h3>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Online Document Processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">QR Code Verification System</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Real-time Status Updates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Mobile-Friendly Interface</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Service Rating</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-gray-700 ml-2">4.9/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Tracking Widget */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <div className="text-center mb-6">
              <Search className="h-12 w-12 text-blue-200 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Track Your Application</h2>
              <p className="text-blue-200">Enter your tracking number to check the status of your application</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number (e.g., DOC-2024-001)"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  onClick={handleTrackApplication}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Track
                </button>
              </div>
              <p className="text-blue-200 text-sm mt-2 text-center">
                Don't have a tracking number? <Link to="/register" className="text-white underline">Apply for services here</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alerts/Warnings Section */}
      {alerts.length > 0 && (
        <section className="py-12 bg-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-red-800 mb-2 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 mr-2" />
                Important Alerts
              </h2>
              <p className="text-red-700">Stay informed about important community updates</p>
            </div>
            
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-white border-l-4 border-red-500 rounded-lg p-6 shadow-sm">
                  <div className="flex items-start">
                    <AlertTriangle className="h-6 w-6 text-red-500 mr-3 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-red-800 mb-2">{alert.title}</h3>
                      <p className="text-red-700 mb-2">{alert.message}</p>
                      <p className="text-sm text-red-600">Posted on {alert.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Government Transparency Section */}
      <section id="transparency" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Scale className="h-8 w-8 text-blue-600 mr-3" />
              Transparency & Accountability
            </h2>
            <p className="text-xl text-gray-600">
              Committed to open governance and public transparency
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Transparency Seal */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Transparency Seal</h3>
              <p className="text-gray-600 text-sm mb-4">
                Certified transparent and accountable local government unit
              </p>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mx-auto">
                View Certificate <ExternalLink className="h-4 w-4 ml-1" />
              </button>
            </div>

            {/* Citizen's Charter */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Citizen's Charter</h3>
              <p className="text-gray-600 text-sm mb-4">
                Our commitment to quality public service delivery
              </p>
              <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center mx-auto">
                Download PDF <Download className="h-4 w-4 ml-1" />
              </button>
            </div>

            {/* Freedom of Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Freedom of Information</h3>
              <p className="text-gray-600 text-sm mb-4">
                Request access to public information and government data
              </p>
              <button 
                onClick={() => setShowFOIForm(true)}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center mx-auto"
              >
                Submit Request <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            {/* Legal Framework */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gavel className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Framework</h3>
              <p className="text-gray-600 text-sm mb-4">
                Laws, ordinances, and regulations governing our barangay
              </p>
              <button className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center mx-auto">
                View Documents <ExternalLink className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Bell className="h-8 w-8 text-blue-600 mr-3" />
              Latest Announcements
            </h2>
            <p className="text-xl text-gray-600">
              Stay updated with the latest news and events from our barangay
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {announcements.slice(0, 3).map((announcement) => (
              <div key={announcement.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`h-2 ${
                  announcement.priority === 'high' ? 'bg-red-500' :
                  announcement.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      announcement.type === 'health' ? 'bg-red-100 text-red-800' :
                      announcement.type === 'event' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {announcement.type.toUpperCase()}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">{announcement.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{announcement.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{announcement.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">By {announcement.author}</span>
                    <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
                      Read More <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Announcements
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Camera className="h-8 w-8 text-green-600 mr-3" />
              Community Projects
            </h2>
            <p className="text-xl text-gray-600">
              Discover the projects and improvements we've made for our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      project.category === 'technology' ? 'bg-indigo-100 text-indigo-800' :
                      project.category === 'health' ? 'bg-red-100 text-red-800' :
                      project.category === 'infrastructure' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.category.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      project.status === 'completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center justify-between">
                      <span>Budget:</span>
                      <span className="font-semibold text-green-600">₱{project.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Beneficiaries:</span>
                      <span className="font-semibold">{project.beneficiaries.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Achievements:</h4>
                    <ul className="space-y-1">
                      {project.achievements.slice(0, 2).map((achievement, index) => (
                        <li key={index} className="flex items-center text-xs text-gray-600">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive digital services designed to make your barangay transactions faster, 
              easier, and more convenient than ever before.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                  <service.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-800">
                  <span className="text-sm font-medium">Access Service</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Residents Say</h2>
            <p className="text-xl text-gray-600">
              Real feedback from community members who have used our digital services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-blue-100 mb-8">
                Have questions or need assistance? We're here to help you with all your barangay service needs.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-300 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-blue-100">{barangayInfo.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-blue-300 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-blue-100">{barangayInfo.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-blue-300 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-blue-100">{barangayInfo.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-blue-300 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Office Hours</h3>
                    <p className="text-blue-100">{barangayInfo.hours}</p>
                    <p className="text-blue-100">Monday - Friday</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href={barangayInfo.facebook} target="_blank" rel="noopener noreferrer" className="bg-blue-700 p-3 rounded-full hover:bg-blue-800 transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="bg-blue-700 p-3 rounded-full hover:bg-blue-800 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="bg-blue-700 p-3 rounded-full hover:bg-blue-800 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="bg-blue-700 p-3 rounded-full hover:bg-blue-800 transition-colors">
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 text-gray-900">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={contactForm.firstName}
                      onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={contactForm.lastName}
                      onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Building2 className="h-8 w-8 text-blue-400" />
                <div>
                  <h3 className="text-xl font-bold">{barangayInfo.name}</h3>
                  <p className="text-gray-400">Digital Government Services</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Committed to providing excellent public service through transparent, accountable, 
                and innovative governance for the welfare of all residents.
              </p>
              <div className="flex space-x-4">
                <a href={barangayInfo.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><a href="#transparency" className="text-gray-400 hover:text-white transition-colors">Transparency</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><span className="text-gray-400">Barangay Clearance</span></li>
                <li><span className="text-gray-400">Business Permits</span></li>
                <li><span className="text-gray-400">Certificates</span></li>
                <li><span className="text-gray-400">Digital ID</span></li>
                <li><span className="text-gray-400">Security Services</span></li>
                <li><span className="text-gray-400">Health Services</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 {barangayInfo.name}. All rights reserved. | 
              <span className="ml-2">Powered by Digital Government Solutions</span>
            </p>
          </div>
        </div>
      </footer>

      {/* FOI Request Modal */}
      {showFOIForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Freedom of Information Request</h3>
              <button
                onClick={() => setShowFOIForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleFOISubmit} className="space-y-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">About FOI Requests</h4>
                <p className="text-purple-700 text-sm">
                  The Freedom of Information Act ensures your right to access government information. 
                  We are committed to transparency and will process your request within 15 working days.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={foiRequest.requestorName}
                    onChange={(e) => setFoiRequest({ ...foiRequest, requestorName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={foiRequest.email}
                    onChange={(e) => setFoiRequest({ ...foiRequest, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={foiRequest.address}
                  onChange={(e) => setFoiRequest({ ...foiRequest, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  value={foiRequest.contactNumber}
                  onChange={(e) => setFoiRequest({ ...foiRequest, contactNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Information Requested</label>
                <textarea
                  value={foiRequest.informationRequested}
                  onChange={(e) => setFoiRequest({ ...foiRequest, informationRequested: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Please describe the specific information you are requesting..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Request</label>
                <textarea
                  value={foiRequest.purpose}
                  onChange={(e) => setFoiRequest({ ...foiRequest, purpose: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Please explain why you need this information..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Format</label>
                <select
                  value={foiRequest.preferredFormat}
                  onChange={(e) => setFoiRequest({ ...foiRequest, preferredFormat: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="digital">Digital Copy (Email)</option>
                  <option value="physical">Physical Copy (Pickup)</option>
                  <option value="both">Both Digital and Physical</option>
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowFOIForm(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Contact Us</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={contactForm.firstName}
                    onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={contactForm.lastName}
                    onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}