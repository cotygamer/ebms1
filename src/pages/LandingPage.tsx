import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { supabase } from '../lib/supabase';
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
  Menu,
  X,
  Play,
  Download,
  ExternalLink
} from 'lucide-react';

export default function LandingPage() {
  const { systemSettings, residents } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    category: 'general',
    subject: '',
    message: ''
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    setContactMessage('');

    try {
      console.log('Submitting contact form:', contactForm);
      
      // Create message data
      const messageData = {
        sender_name: `${contactForm.firstName} ${contactForm.lastName}`.trim(),
        sender_email: contactForm.email,
        sender_phone: contactForm.phone || null,
        subject: contactForm.subject,
        message: contactForm.message,
        content: contactForm.message, // Backward compatibility
        category: contactForm.category,
        priority: 'medium',
        status: 'unread',
        source: 'website'
      };

      console.log('Message data to send:', messageData);

      // Send directly to Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to send message: ${error.message}`);
      }

      console.log('Message sent successfully:', data);

      setContactMessage('Message sent successfully! We will get back to you soon.');
      setContactForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        category: 'general',
        subject: '',
        message: ''
      });
      
      // Trigger data refresh across all portals
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('refreshAllData'));
      }, 1000);
    } catch (error) {
      console.error('Contact form error:', error);
      setContactMessage(error.message || 'Failed to send message. Please try again or contact us directly.');
    } finally {
      setIsSubmittingContact(false);
      setTimeout(() => setContactMessage(''), 5000);
    }
  };
  
  // Mock data for announcements
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

  const services = [
    {
      icon: FileText,
      title: 'Document Services',
      description: 'Barangay Clearance, Certificates, Business Permits',
      features: ['Online Application', 'Fast Processing', 'Digital Copies']
    },
    {
      icon: Users,
      title: 'Resident Registration',
      description: 'Digital ID System with QR Code Verification',
      features: ['Digital ID', 'QR Code', 'Family Tree']
    },
    {
      icon: Shield,
      title: 'Security & Safety',
      description: 'Community Safety and Emergency Response',
      features: ['24/7 Monitoring', 'Emergency Alerts', 'Safety Programs']
    },
    {
      icon: Heart,
      title: 'Health Services',
      description: 'Community Health Programs and Medical Services',
      features: ['Health Center', 'Medical Records', 'Vaccination Programs']
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
      rating: 5,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    },
    {
      name: 'Juan Dela Cruz',
      role: 'Business Owner',
      content: 'Processing my business permit was quick and transparent. The online tracking system kept me updated throughout the process.',
      rating: 5,
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
    },
    {
      name: 'Ana Garcia',
      role: 'Senior Citizen',
      content: 'The staff is very helpful and the new QR code system makes transactions faster. Great improvement for our community!',
      rating: 5,
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{barangayInfo.name}</h1>
                <p className="text-sm text-gray-600">Digital Government Services</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Services</a>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">About</Link>
              <a href="#announcements" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">News</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Resident Login
                </Link>
                <Link
                  to="/bms"
                  className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  Staff Portal
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                >
                  Register Now
                </Link>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Resident Portal
              </button>
              <Link
                to="/bms"
                className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center font-semibold"
              >
                Staff Portal
              </Link>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</a>
                <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Services</a>
                <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">About</Link>
                <a href="#announcements" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">News</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors text-center"
                  >
                    Resident Login
                  </Link>
                  <Link
                    to="/bms"
                    className="text-purple-600 hover:text-purple-800 font-medium transition-colors text-center"
                  >
                    Staff Portal
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-center font-medium"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <Globe className="h-4 w-4 mr-2" />
                Digital Government Services
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Welcome to <br />
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  {barangayInfo.name}
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience modern, efficient, and transparent barangay services through our comprehensive digital platform. 
                Get your documents processed faster, stay connected with community updates, and access services 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center font-semibold"
                >
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center font-semibold">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-500 mr-2" />
                  <span>Secure & Verified</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-500 mr-2" />
                  <span>24/7 Available</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-purple-500 mr-2" />
                  <span>1,200+ Residents</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* Main Dashboard Preview */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Digital Services Portal</h3>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700 font-medium">Online Document Processing</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700 font-medium">QR Code Verification System</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-700 font-medium">Real-time Status Updates</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-700 font-medium">Mobile-Friendly Interface</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Service Rating</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-gray-700 ml-2 font-semibold">4.9/5</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-10 w-10 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <FileText className="h-4 w-4 mr-2" />
              Our Services
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Comprehensive Digital Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience seamless barangay transactions with our modern digital platform designed 
              for efficiency, transparency, and convenience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:-translate-y-2 group">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center group-hover:translate-x-2 transition-transform">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section id="announcements" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-6">
              <Bell className="h-4 w-4 mr-2" />
              Latest Updates
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Community Announcements
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed with the latest news, events, and important updates from our barangay
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2 group border border-gray-100">
                <div className={`h-2 ${
                  announcement.priority === 'high' ? 'bg-red-500' :
                  announcement.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      announcement.type === 'health' ? 'bg-red-100 text-red-800' :
                      announcement.type === 'event' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {announcement.type.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">{announcement.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{announcement.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">By {announcement.author}</span>
                    <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium group-hover:translate-x-2 transition-transform">
                      Read More <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              View All Announcements
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4 mr-2" />
              Testimonials
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What Our Residents Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real feedback from community members who have experienced our digital transformation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
                <div className="flex items-center space-x-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center space-x-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of residents who have already experienced the convenience of our digital services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center font-semibold"
            >
              Register as Resident
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center font-semibold"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
              <p className="text-gray-300 mb-8 text-lg">
                Have questions or need assistance? We're here to help you with all your barangay service needs.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Visit Our Office</h3>
                    <p className="text-gray-300">{barangayInfo.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Call Us</h3>
                    <p className="text-gray-300">{barangayInfo.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Email Us</h3>
                    <p className="text-gray-300">{barangayInfo.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Office Hours</h3>
                    <p className="text-gray-300">{barangayInfo.hours}</p>
                    <p className="text-gray-300">Monday - Friday</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href={barangayInfo.facebook} target="_blank" rel="noopener noreferrer" className="bg-blue-700 p-3 rounded-xl hover:bg-blue-800 transition-colors">
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a href="#" className="bg-blue-700 p-3 rounded-xl hover:bg-blue-800 transition-colors">
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a href="#" className="bg-blue-700 p-3 rounded-xl hover:bg-blue-800 transition-colors">
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a href="#" className="bg-blue-700 p-3 rounded-xl hover:bg-blue-800 transition-colors">
                    <Youtube className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 text-gray-900">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={contactForm.firstName}
                      onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={contactForm.lastName}
                      onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+63 912 345 6789"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={contactForm.category}
                    onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="complaint">Complaint</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What is this about?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    name="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmittingContact}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                >
                  {isSubmittingContact ? 'Sending...' : 'Send Message'}
                </button>
                
                {contactMessage && (
                  <div className={`p-4 rounded-lg ${
                    contactMessage.includes('successfully') 
                      ? 'bg-green-50 border border-green-200 text-green-700' 
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    <div className="flex items-center">
                      {contactMessage.includes('successfully') ? (
                        <CheckCircle className="h-5 w-5 mr-2" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 mr-2" />
                      )}
                      {contactMessage}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{barangayInfo.name}</h3>
                  <p className="text-gray-400">Digital Government Services</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Committed to providing excellent public service through transparent, accountable, 
                and innovative governance for the welfare of all residents.
              </p>
              <div className="flex space-x-4">
                <a href={barangayInfo.facebook} target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Services</h4>
              <ul className="space-y-3">
                <li><span className="text-gray-400">Barangay Clearance</span></li>
                <li><span className="text-gray-400">Business Permits</span></li>
                <li><span className="text-gray-400">Certificates</span></li>
                <li><span className="text-gray-400">Digital ID</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 {barangayInfo.name}. All rights reserved. | 
              <span className="ml-2">Powered by Digital Government Solutions</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}