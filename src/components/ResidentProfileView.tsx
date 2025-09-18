import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Shield, 
  Home,
  Users,
  Heart,
  Briefcase,
  Globe,
  CheckCircle,
  AlertTriangle,
  Camera,
  Upload
} from 'lucide-react';

export default function ResidentProfileView() {
  const { user, updateUser } = useAuth();
  const { updateResident } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthDate: user?.birthDate || '',
    gender: user?.gender || '',
    civilStatus: user?.civilStatus || '',
    nationality: user?.nationality || 'Filipino',
    religion: user?.religion || '',
    occupation: user?.occupation || '',
    monthlyIncome: user?.monthlyIncome || '',
    emergencyContact: user?.emergencyContact || ''
  });

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // Update user context
      updateUser(formData);
      
      // Update resident in database
      if (user?.id) {
        await updateResident(user.id, {
          name: formData.name,
          email: formData.email,
          phone_number: formData.phone,
          address: formData.address,
          birth_date: formData.birthDate,
          gender: formData.gender,
          civil_status: formData.civilStatus,
          nationality: formData.nationality,
          religion: formData.religion,
          occupation: formData.occupation,
          monthly_income: formData.monthlyIncome,
          emergency_contact: formData.emergencyContact
        });
      }
      
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(`Failed to update profile: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      birthDate: user?.birthDate || '',
      gender: user?.gender || '',
      civilStatus: user?.civilStatus || '',
      nationality: user?.nationality || 'Filipino',
      religion: user?.religion || '',
      occupation: user?.occupation || '',
      monthlyIncome: user?.monthlyIncome || '',
      emergencyContact: user?.emergencyContact || ''
    });
    setIsEditing(false);
  };

  const profileSections = [
    {
      title: 'Personal Information',
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      fields: [
        { key: 'name', label: 'Full Name', icon: User, type: 'text', required: true },
        { key: 'email', label: 'Email Address', icon: Mail, type: 'email', required: true },
        { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel' },
        { key: 'birthDate', label: 'Birth Date', icon: Calendar, type: 'date' },
        { key: 'gender', label: 'Gender', icon: User, type: 'select', options: ['', 'male', 'female'] },
        { key: 'civilStatus', label: 'Civil Status', icon: Heart, type: 'select', options: ['', 'single', 'married', 'widowed', 'separated', 'divorced'] }
      ]
    },
    {
      title: 'Address & Location',
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      fields: [
        { key: 'address', label: 'Complete Address', icon: Home, type: 'textarea' },
        { key: 'nationality', label: 'Nationality', icon: Globe, type: 'text' }
      ]
    },
    {
      title: 'Additional Information',
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      fields: [
        { key: 'religion', label: 'Religion', icon: Heart, type: 'text' },
        { key: 'occupation', label: 'Occupation', icon: Briefcase, type: 'text' },
        { key: 'monthlyIncome', label: 'Monthly Income', icon: Briefcase, type: 'select', options: ['', 'below-10000', '10000-25000', '25000-50000', '50000-100000', 'above-100000'] }
      ]
    },
    {
      title: 'Emergency Contact',
      icon: Phone,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      fields: [
        { key: 'emergencyContact', label: 'Emergency Contact Details', icon: Phone, type: 'textarea' }
      ]
    }
  ];

  const getIncomeLabel = (value: string) => {
    switch (value) {
      case 'below-10000': return 'Below ₱10,000';
      case '10000-25000': return '₱10,000 - ₱25,000';
      case '25000-50000': return '₱25,000 - ₱50,000';
      case '50000-100000': return '₱50,000 - ₱100,000';
      case 'above-100000': return 'Above ₱100,000';
      default: return 'Not specified';
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <button className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex items-center mt-2 space-x-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user?.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                  user?.verificationStatus === 'semi-verified' ? 'bg-yellow-100 text-yellow-800' :
                  user?.verificationStatus === 'details-updated' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {user?.verificationStatus?.replace('-', ' ') || 'Non Verified'}
                </div>
                <span className="text-sm text-gray-500">
                  Member since {user?.dateRegistered ? new Date(user.dateRegistered).getFullYear() : 'Recently'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('successfully') 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <div className="flex items-center">
              {message.includes('successfully') ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 mr-2" />
              )}
              {message}
            </div>
          </div>
        )}
      </div>

      {/* Profile Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {profileSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className={`p-3 rounded-lg ${section.bgColor} mr-4`}>
                <section.icon className={`h-6 w-6 ${section.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
            </div>

            <div className="space-y-4">
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {isEditing ? (
                    field.type === 'select' ? (
                      <select
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {field.key === 'monthlyIncome' && option ? getIncomeLabel(option) : 
                             option ? option.charAt(0).toUpperCase() + option.slice(1) : 'Select...'}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    ) : (
                      <div className="relative">
                        <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type={field.type}
                          value={formData[field.key as keyof typeof formData]}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      </div>
                    )
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <field.icon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">
                        {field.key === 'monthlyIncome' 
                          ? getIncomeLabel(formData[field.key as keyof typeof formData])
                          : formData[field.key as keyof typeof formData] || 'Not provided'
                        }
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Account Security */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <div className="p-3 rounded-lg bg-red-50 mr-4">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Password</h4>
            <p className="text-sm text-gray-600 mb-4">Last changed 30 days ago</p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Change Password
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600 mb-4">Add an extra layer of security</p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
          <span className="text-sm text-gray-500">
            {Math.round((Object.values(formData).filter(value => value && value.trim()).length / Object.keys(formData).length) * 100)}% Complete
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.round((Object.values(formData).filter(value => value && value.trim()).length / Object.keys(formData).length) * 100)}%` 
            }}
          ></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className={`h-5 w-5 ${formData.name && formData.email ? 'text-green-500' : 'text-gray-300'}`} />
            <span className="text-sm text-gray-700">Basic Information</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className={`h-5 w-5 ${formData.address && formData.phone ? 'text-green-500' : 'text-gray-300'}`} />
            <span className="text-sm text-gray-700">Contact Details</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className={`h-5 w-5 ${formData.occupation && formData.birthDate ? 'text-green-500' : 'text-gray-300'}`} />
            <span className="text-sm text-gray-700">Personal Details</span>
          </div>
        </div>

        {Object.values(formData).filter(value => value && value.trim()).length < Object.keys(formData).length && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <h4 className="font-medium text-yellow-800">Complete Your Profile</h4>
                <p className="text-sm text-yellow-700">
                  Complete your profile to improve your verification status and access more services.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}