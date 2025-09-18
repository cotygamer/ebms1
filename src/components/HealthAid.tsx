import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Heart, 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MapPin,
  Stethoscope,
  Pill,
  Activity,
  FileText,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  X,
  Save
} from 'lucide-react';

interface HealthRecord {
  id: string;
  type: 'checkup' | 'vaccination' | 'consultation' | 'emergency';
  date: string;
  provider: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  followUp?: string;
}

interface HealthProgram {
  id: string;
  name: string;
  description: string;
  type: 'vaccination' | 'screening' | 'wellness' | 'maternal' | 'senior';
  schedule: string;
  location: string;
  eligibility: string;
  isActive: boolean;
}

export default function HealthAid() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'programs' | 'records' | 'assistance'>('programs');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<HealthProgram | null>(null);
  
  const [healthRecords] = useState<HealthRecord[]>([
    {
      id: '1',
      type: 'vaccination',
      date: '2024-03-10',
      provider: 'Barangay Health Center',
      diagnosis: 'COVID-19 Booster',
      treatment: 'Pfizer Vaccine',
      notes: 'No adverse reactions observed'
    },
    {
      id: '2',
      type: 'checkup',
      date: '2024-02-15',
      provider: 'Dr. Maria Santos',
      diagnosis: 'General Health Checkup',
      treatment: 'Routine examination',
      notes: 'Blood pressure normal, weight stable',
      followUp: '2024-08-15'
    }
  ]);

  const [healthPrograms] = useState<HealthProgram[]>([
    {
      id: '1',
      name: 'COVID-19 Vaccination Drive',
      description: 'Free COVID-19 vaccination for all eligible residents',
      type: 'vaccination',
      schedule: 'Every Monday & Wednesday, 8:00 AM - 4:00 PM',
      location: 'Barangay Health Center',
      eligibility: 'All residents 12 years and above',
      isActive: true
    },
    {
      id: '2',
      name: 'Senior Citizen Health Screening',
      description: 'Comprehensive health screening for senior citizens',
      type: 'screening',
      schedule: 'First Friday of every month, 9:00 AM - 12:00 PM',
      location: 'Community Center',
      eligibility: 'Residents 60 years and above',
      isActive: true
    },
    {
      id: '3',
      name: 'Maternal Health Program',
      description: 'Prenatal and postnatal care for expecting and new mothers',
      type: 'maternal',
      schedule: 'Every Tuesday & Thursday, 9:00 AM - 3:00 PM',
      location: 'Barangay Health Center',
      eligibility: 'Pregnant women and new mothers',
      isActive: true
    },
    {
      id: '4',
      name: 'Child Nutrition Program',
      description: 'Nutrition monitoring and supplementation for children',
      type: 'wellness',
      schedule: 'Every Saturday, 8:00 AM - 12:00 PM',
      location: 'Day Care Center',
      eligibility: 'Children 0-5 years old',
      isActive: true
    }
  ]);

  const [assistanceRequest, setAssistanceRequest] = useState({
    type: '',
    description: '',
    urgency: 'normal' as 'normal' | 'urgent' | 'emergency',
    contactNumber: user?.phone || '',
    preferredDate: '',
    notes: ''
  });

  const assistanceTypes = [
    'Medical Consultation',
    'Medicine Assistance',
    'Health Certificate',
    'Vaccination Record',
    'Medical Referral',
    'Emergency Medical Aid',
    'Health Insurance Assistance',
    'Other'
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccination':
        return <Pill className="h-5 w-5" />;
      case 'screening':
        return <Activity className="h-5 w-5" />;
      case 'maternal':
        return <Heart className="h-5 w-5" />;
      case 'wellness':
        return <Stethoscope className="h-5 w-5" />;
      default:
        return <Heart className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vaccination':
        return 'text-blue-600 bg-blue-50';
      case 'screening':
        return 'text-green-600 bg-green-50';
      case 'maternal':
        return 'text-pink-600 bg-pink-50';
      case 'wellness':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleSubmitAssistance = () => {
    if (assistanceRequest.type && assistanceRequest.description) {
      // In a real app, this would submit to the backend
      alert('Health assistance request submitted successfully!');
      setAssistanceRequest({
        type: '',
        description: '',
        urgency: 'normal',
        contactNumber: user?.phone || '',
        preferredDate: '',
        notes: ''
      });
      setShowRequestForm(false);
    }
  };

  const renderPrograms = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {healthPrograms.filter(p => p.isActive).map((program) => (
          <div key={program.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${getTypeColor(program.type)}`}>
                  {getTypeIcon(program.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(program.type)}`}>
                    {program.type.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{program.description}</p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-700">{program.schedule}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-700">{program.location}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-700">{program.eligibility}</span>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedProgram(program)}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Learn More
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecords = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {healthRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Follow-up
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {healthRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        record.type === 'vaccination' ? 'bg-blue-100 text-blue-800' :
                        record.type === 'checkup' ? 'bg-green-100 text-green-800' :
                        record.type === 'consultation' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {record.provider}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{record.diagnosis}</div>
                      <div className="text-sm text-gray-600">{record.treatment}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {record.followUp ? new Date(record.followUp).toLocaleDateString() : 'None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Health Records</h3>
            <p className="text-gray-600">Your health records will appear here after your first visit to our health center.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAssistance = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Request Health Assistance</h3>
          <button
            onClick={() => setShowRequestForm(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {assistanceTypes.slice(0, 4).map((type, index) => (
            <button
              key={index}
              onClick={() => {
                setAssistanceRequest({ ...assistanceRequest, type });
                setShowRequestForm(true);
              }}
              className="flex flex-col items-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
            >
              <Heart className="h-8 w-8 text-green-600 mb-3" />
              <span className="text-sm font-medium text-gray-900 text-center">{type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Health Contacts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Emergency Health Contacts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h4 className="font-medium text-gray-900">Emergency Hotline</h4>
                <p className="text-sm text-gray-600">911 or 117</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
              <Heart className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Barangay Health Center</h4>
                <p className="text-sm text-gray-600">+63 2 8123 4567</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <Stethoscope className="h-6 w-6 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Municipal Health Office</h4>
                <p className="text-sm text-gray-600">+63 2 8765 4321</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
              <div>
                <h4 className="font-medium text-gray-900">Red Cross</h4>
                <p className="text-sm text-gray-600">143</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Health & Aid Services</h1>
          <p className="text-gray-600">Access health programs, view medical records, and request assistance</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('programs')}
              className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'programs'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Activity className="h-4 w-4 mr-2" />
              Health Programs
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'records'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              My Health Records
            </button>
            <button
              onClick={() => setActiveTab('assistance')}
              className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'assistance'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Request Assistance
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'programs' && renderPrograms()}
          {activeTab === 'records' && renderRecords()}
          {activeTab === 'assistance' && renderAssistance()}
        </div>
      </div>

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Program Details</h3>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-lg ${getTypeColor(selectedProgram.type)}`}>
                  {getTypeIcon(selectedProgram.type)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedProgram.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedProgram.type)}`}>
                    {selectedProgram.type.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800">{selectedProgram.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Schedule</h4>
                  <p className="text-sm text-gray-700">{selectedProgram.schedule}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Location</h4>
                  <p className="text-sm text-gray-700">{selectedProgram.location}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-gray-900 mb-3">Eligibility</h4>
                  <p className="text-sm text-gray-700">{selectedProgram.eligibility}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Register for Program
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assistance Request Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Request Health Assistance</h3>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Type of Assistance *
                </label>
                <select
                  value={assistanceRequest.type}
                  onChange={(e) => setAssistanceRequest({ ...assistanceRequest, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select assistance type</option>
                  {assistanceTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Description *
                </label>
                <textarea
                  value={assistanceRequest.description}
                  onChange={(e) => setAssistanceRequest({ ...assistanceRequest, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe your health assistance needs..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Urgency Level
                  </label>
                  <select
                    value={assistanceRequest.urgency}
                    onChange={(e) => setAssistanceRequest({ ...assistanceRequest, urgency: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={assistanceRequest.contactNumber}
                    onChange={(e) => setAssistanceRequest({ ...assistanceRequest, contactNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="+63 912 345 6789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={assistanceRequest.preferredDate}
                  onChange={(e) => setAssistanceRequest({ ...assistanceRequest, preferredDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Additional Notes
                </label>
                <textarea
                  value={assistanceRequest.notes}
                  onChange={(e) => setAssistanceRequest({ ...assistanceRequest, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Any additional information..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAssistance}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}