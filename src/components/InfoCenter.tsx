import React, { useState } from 'react';
import { 
  Info, 
  FileText, 
  Phone, 
  MapPin, 
  Clock, 
  Users,
  Building2,
  Heart,
  Shield,
  AlertTriangle,
  Search,
  ChevronRight,
  Download,
  ExternalLink,
  Mail,
  Globe,
  Calendar,
  Award,
  BookOpen,
  HelpCircle,
  X
} from 'lucide-react';

interface InfoItem {
  id: string;
  title: string;
  category: 'services' | 'procedures' | 'contacts' | 'forms' | 'faqs' | 'guides';
  content: string;
  lastUpdated: string;
  downloadUrl?: string;
  externalUrl?: string;
  isPopular?: boolean;
}

export default function InfoCenter() {
  const [activeCategory, setActiveCategory] = useState('services');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InfoItem | null>(null);

  const categories = [
    { id: 'services', name: 'Services', icon: Building2, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'procedures', name: 'Procedures', icon: FileText, color: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 'contacts', name: 'Contacts', icon: Phone, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { id: 'forms', name: 'Forms', icon: Download, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { id: 'faqs', name: 'FAQs', icon: HelpCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
    { id: 'guides', name: 'Guides', icon: BookOpen, color: 'text-indigo-600', bgColor: 'bg-indigo-50' }
  ];

  const infoItems: InfoItem[] = [
    // Services
    {
      id: '1',
      title: 'Barangay Clearance',
      category: 'services',
      content: 'A document certifying that you are a resident of the barangay and have no pending cases. Required for employment, business permits, and other legal purposes.',
      lastUpdated: '2024-03-15',
      isPopular: true
    },
    {
      id: '2',
      title: 'Certificate of Indigency',
      category: 'services',
      content: 'A document certifying that you belong to the indigent sector of the community. Used for scholarship applications, medical assistance, and other social services.',
      lastUpdated: '2024-03-15'
    },
    {
      id: '3',
      title: 'Business Permit Application',
      category: 'services',
      content: 'Required permit for operating any business within the barangay. Includes health permits, fire safety clearance, and environmental compliance.',
      lastUpdated: '2024-03-15'
    },
    
    // Procedures
    {
      id: '4',
      title: 'How to Request Documents Online',
      category: 'procedures',
      content: 'Step-by-step guide: 1) Login to your account 2) Go to Document Requests 3) Select document type 4) Fill out the form 5) Submit and wait for processing 6) Pay fees if applicable 7) Pick up or download your document.',
      lastUpdated: '2024-03-15',
      isPopular: true
    },
    {
      id: '5',
      title: 'Verification Process',
      category: 'procedures',
      content: 'Complete your profile → Submit required documents → Pin house location → Wait for barangay official verification → Receive QR code access.',
      lastUpdated: '2024-03-15'
    },
    
    // Contacts
    {
      id: '6',
      title: 'Emergency Contacts',
      category: 'contacts',
      content: 'Police: 911 or 117\nFire Department: 911 or 116\nMedical Emergency: 911\nBarangay Emergency: +63 2 8123 4567\nRed Cross: 143',
      lastUpdated: '2024-03-15',
      isPopular: true
    },
    {
      id: '7',
      title: 'Government Offices',
      category: 'contacts',
      content: 'Barangay Hall: +63 2 8123 4567\nHealth Center: +63 2 8123 4568\nDay Care Center: +63 2 8123 4569\nSK Office: +63 2 8123 4570',
      lastUpdated: '2024-03-15'
    },
    
    // Forms
    {
      id: '8',
      title: 'Barangay Clearance Application Form',
      category: 'forms',
      content: 'Downloadable form for barangay clearance application. Can also be filled online through the Document Requests section.',
      lastUpdated: '2024-03-15',
      downloadUrl: '/forms/barangay-clearance-form.pdf'
    },
    {
      id: '9',
      title: 'Business Permit Application Form',
      category: 'forms',
      content: 'Complete application form for new business permits including all required attachments and requirements list.',
      lastUpdated: '2024-03-15',
      downloadUrl: '/forms/business-permit-form.pdf'
    },
    
    // FAQs
    {
      id: '10',
      title: 'How long does document processing take?',
      category: 'faqs',
      content: 'Processing times vary: Barangay Clearance (1-2 days), Certificate of Indigency (2-3 days), Business Permits (5-7 days). Rush processing available for urgent needs.',
      lastUpdated: '2024-03-15',
      isPopular: true
    },
    {
      id: '11',
      title: 'What are the requirements for verification?',
      category: 'faqs',
      content: 'Complete profile information, valid government ID, proof of address, and accurate house location pinning. Physical verification by barangay officials is the final step.',
      lastUpdated: '2024-03-15',
      isPopular: true
    },
    
    // Guides
    {
      id: '12',
      title: 'New Resident Guide',
      category: 'guides',
      content: 'Welcome to Barangay San Miguel! This comprehensive guide covers registration, available services, community programs, and how to get involved in local activities.',
      lastUpdated: '2024-03-15',
      isPopular: true
    },
    {
      id: '13',
      title: 'Digital Services Tutorial',
      category: 'guides',
      content: 'Learn how to use our digital platform effectively. Covers account setup, document requests, QR code usage, and troubleshooting common issues.',
      lastUpdated: '2024-03-15'
    }
  ];

  const filteredItems = infoItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularItems = infoItems.filter(item => item.isPopular);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Information Center</h1>
          <p className="text-gray-600">Find helpful information, guides, and resources for barangay services</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for information, guides, or procedures..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
      </div>

      {/* Popular Items */}
      {!searchTerm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-600" />
            Popular Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="text-left p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-yellow-700 font-medium">Popular</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.name}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex-1">{item.title}</h3>
                  {item.isPopular && (
                    <Award className="h-4 w-4 text-yellow-500 ml-2" />
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.content}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    {item.downloadUrl && (
                      <button className="text-blue-600 hover:text-blue-800 p-1">
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                    {item.externalUrl && (
                      <button className="text-green-600 hover:text-green-800 p-1">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-gray-600 hover:text-gray-800 p-1"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{selectedItem.title}</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">{selectedItem.content}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Last updated: {new Date(selectedItem.lastUpdated).toLocaleDateString()}</span>
                <span className="capitalize">{selectedItem.category}</span>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedItem.downloadUrl && (
                  <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                )}
                {selectedItem.externalUrl && (
                  <button className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Link
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Contact */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Call Us</h4>
              <p className="text-sm text-gray-600">+63 2 8123 4567</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
            <div className="p-3 bg-green-100 rounded-lg">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Email Us</h4>
              <p className="text-sm text-gray-600">info@barangaysanmiguel.gov.ph</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
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