import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { dataService } from '../services/dataService';
import { Building2, ArrowLeft, User, MapPin, Plane, Home, Eye, EyeOff, CheckCircle, AlertTriangle, Phone, Mail, Calendar, Users, Shield, Star, Sparkles } from 'lucide-react';

export default function Register() {
  const { addUser } = useData();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Contact & Address
    phoneNumber: '',
    address: '',
    purok: '',
    zipCode: '',
    
    // Personal Details
    birthDate: '',
    gender: '',
    civilStatus: '',
    nationality: 'Filipino',
    occupation: '',
    monthlyIncome: '',
    
    // Category & Purpose
    category: 'resident',
    stayDuration: '',
    purpose: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    emergencyContactAddress: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const navigate = useNavigate();

  const totalSteps = 4;

  const validateStep = (step: number): boolean => {
    const errors: {[key: string]: string} = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
        if (!formData.password) errors.password = 'Password is required';
        if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
        break;
      case 2:
        if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
        if (!formData.address.trim()) errors.address = 'Address is required';
        if (!formData.birthDate) errors.birthDate = 'Birth date is required';
        if (!formData.gender) errors.gender = 'Gender is required';
        if (!formData.civilStatus) errors.civilStatus = 'Civil status is required';
        break;
      case 3:
        if (formData.category === 'transient' && !formData.stayDuration) {
          errors.stayDuration = 'Stay duration is required for transients';
        }
        if (formData.category === 'transient' && !formData.purpose.trim()) {
          errors.purpose = 'Purpose of stay is required for transients';
        }
        if (formData.category === 'tourist' && !formData.stayDuration) {
          errors.stayDuration = 'Visit duration is required for tourists';
        }
        break;
      case 4:
        if (!formData.emergencyContactName.trim()) errors.emergencyContactName = 'Emergency contact name is required';
        if (!formData.emergencyContactPhone.trim()) errors.emergencyContactPhone = 'Emergency contact phone is required';
        if (!formData.emergencyContactRelation.trim()) errors.emergencyContactRelation = 'Emergency contact relation is required';
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setError('');
    setIsLoading(true);

    try {
      console.log('Starting registration process...');
      
      // Create resident profile first
      const fullName = `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}${formData.suffix ? ' ' + formData.suffix : ''}`;
      
      const residentData = {
        name: fullName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        address: formData.address,
        verification_status: 'non-verified',
        birth_date: formData.birthDate,
        gender: formData.gender,
        civil_status: formData.civilStatus,
        emergency_contact: `${formData.emergencyContactName} - ${formData.emergencyContactPhone} (${formData.emergencyContactRelation})`,
        date_registered: new Date().toISOString().split('T')[0]
      };

      console.log('Creating resident with data:', residentData);
      const newResident = await dataService.createResident(residentData);
      console.log('Resident created successfully:', newResident);
      
      // Create corresponding user account (optional - for login purposes)
      const userData = {
        name: fullName,
        email: formData.email,
        role: 'resident' as const,
        status: 'active' as const,
        phone_number: formData.phoneNumber,
        address: formData.address
      };

      console.log('Creating user account with data:', userData);
      await dataService.createUser(userData);
      console.log('User account created successfully');

      alert('Registration successful! You can now login and your profile will be visible to barangay officials for verification.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle specific error types
      if (err.message?.includes('Registration is temporarily unavailable')) {
        setError('Registration is temporarily unavailable. Please contact the barangay office directly.');
      } else if (err.message?.includes('row-level security policy')) {
        setError('Registration system is being updated. Please try again in a few minutes or contact the barangay office.');
      } else {
        setError(`Registration failed: ${err.message || 'Please check your information and try again.'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'resident':
        return <Home className="h-6 w-6" />;
      case 'tourist':
        return <Plane className="h-6 w-6" />;
      case 'transient':
        return <MapPin className="h-6 w-6" />;
      default:
        return <User className="h-6 w-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'resident':
        return 'border-blue-500 bg-blue-50 text-blue-700';
      case 'tourist':
        return 'border-green-500 bg-green-50 text-green-700';
      case 'transient':
        return 'border-purple-500 bg-purple-50 text-purple-700';
      default:
        return 'border-gray-300 bg-gray-50 text-gray-700';
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <React.Fragment key={step}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
            step <= currentStep 
              ? 'border-blue-500 bg-blue-500 text-white' 
              : 'border-gray-300 bg-white text-gray-400'
          }`}>
            {step < currentStep ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <span className="font-semibold">{step}</span>
            )}
          </div>
          {step < totalSteps && (
            <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
              step < currentStep ? 'bg-blue-500' : 'bg-gray-300'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
        <p className="text-gray-600">Let's start with your basic details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your first name"
          />
          {validationErrors.firstName && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your last name"
          />
          {validationErrors.lastName && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.lastName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Middle Name
          </label>
          <input
            type="text"
            value={formData.middleName}
            onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Enter your middle name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suffix
          </label>
          <select
            value={formData.suffix}
            onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">Select suffix</option>
            <option value="Jr.">Jr.</option>
            <option value="Sr.">Sr.</option>
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
        </div>
        {validationErrors.email && (
          <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.confirmPassword}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Contact & Address</h3>
        <p className="text-gray-600">How can we reach you?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                validationErrors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="+63 912 345 6789"
            />
          </div>
          {validationErrors.phoneNumber && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.phoneNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birth Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                validationErrors.birthDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
          </div>
          {validationErrors.birthDate && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.birthDate}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Complete Address *
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            validationErrors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="House number, street, subdivision, city, province"
        />
        {validationErrors.address && (
          <p className="text-red-600 text-sm mt-1">{validationErrors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.gender ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {validationErrors.gender && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.gender}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Civil Status *
          </label>
          <select
            value={formData.civilStatus}
            onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.civilStatus ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="widowed">Widowed</option>
            <option value="separated">Separated</option>
            <option value="divorced">Divorced</option>
          </select>
          {validationErrors.civilStatus && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.civilStatus}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nationality
          </label>
          <input
            type="text"
            value={formData.nationality}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Filipino"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occupation
          </label>
          <input
            type="text"
            value={formData.occupation}
            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Your occupation"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Income
          </label>
          <select
            value={formData.monthlyIncome}
            onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">Select income range</option>
            <option value="below-10000">Below ₱10,000</option>
            <option value="10000-25000">₱10,000 - ₱25,000</option>
            <option value="25000-50000">₱25,000 - ₱50,000</option>
            <option value="50000-100000">₱50,000 - ₱100,000</option>
            <option value="above-100000">Above ₱100,000</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Registration Category</h3>
        <p className="text-gray-600">Choose your registration type</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { 
            value: 'resident', 
            label: 'Permanent Resident', 
            desc: 'I am a permanent resident of this barangay',
            features: ['Full access to all services', 'Voting rights', 'Community programs', 'Priority support']
          },
          { 
            value: 'tourist', 
            label: 'Tourist/Visitor', 
            desc: 'I am visiting for tourism or short-term purposes',
            features: ['Basic services access', 'Emergency assistance', 'Tourist information', 'Temporary permits']
          },
          { 
            value: 'transient', 
            label: 'Transient Resident', 
            desc: 'I am staying temporarily for work, study, or family reasons',
            features: ['Extended services access', 'Temporary permits', 'Community notifications', 'Basic healthcare']
          }
        ].map((category) => (
          <label
            key={category.value}
            className={`relative flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
              formData.category === category.value
                ? getCategoryColor(category.value) + ' shadow-lg transform scale-[1.02]'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <input
              type="radio"
              name="category"
              value={category.value}
              checked={formData.category === category.value}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="sr-only"
            />
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${
                formData.category === category.value ? 'bg-white bg-opacity-50' : 'bg-gray-100'
              }`}>
                {getCategoryIcon(category.value)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-lg font-semibold">{category.label}</h4>
                  {formData.category === category.value && (
                    <CheckCircle className="h-5 w-5 text-current" />
                  )}
                </div>
                <p className="text-sm opacity-80 mb-3">{category.desc}</p>
                <div className="grid grid-cols-2 gap-2">
                  {category.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-xs opacity-75">
                      <Star className="h-3 w-3 mr-1" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Category-specific fields */}
      {(formData.category === 'transient' || formData.category === 'tourist') && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-4">Additional Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.category === 'tourist' ? 'Visit Duration *' : 'Expected Stay Duration *'}
              </label>
              <select
                value={formData.stayDuration}
                onChange={(e) => setFormData({ ...formData, stayDuration: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  validationErrors.stayDuration ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
              >
                <option value="">Select duration</option>
                {formData.category === 'tourist' ? (
                  <>
                    <option value="1-7 days">1-7 days</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="2-4 weeks">2-4 weeks</option>
                    <option value="1+ months">1+ months</option>
                  </>
                ) : (
                  <>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6-12 months">6-12 months</option>
                    <option value="1+ years">1+ years</option>
                  </>
                )}
              </select>
              {validationErrors.stayDuration && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.stayDuration}</p>
              )}
            </div>

            {formData.category === 'transient' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose of Stay *
                </label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    validationErrors.purpose ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Work, study, family, etc."
                />
                {validationErrors.purpose && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.purpose}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Emergency Contact</h3>
        <p className="text-gray-600">Someone we can contact in case of emergency</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Important</h4>
            <p className="text-sm text-yellow-700">
              Please provide accurate emergency contact information. This person should be easily reachable and willing to be contacted on your behalf.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Name *
          </label>
          <input
            type="text"
            value={formData.emergencyContactName}
            onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.emergencyContactName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Full name of emergency contact"
          />
          {validationErrors.emergencyContactName && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.emergencyContactName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Phone *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                validationErrors.emergencyContactPhone ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="+63 912 345 6789"
            />
          </div>
          {validationErrors.emergencyContactPhone && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.emergencyContactPhone}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Relationship *
        </label>
        <select
          value={formData.emergencyContactRelation}
          onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            validationErrors.emergencyContactRelation ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
        >
          <option value="">Select relationship</option>
          <option value="spouse">Spouse</option>
          <option value="parent">Parent</option>
          <option value="sibling">Sibling</option>
          <option value="child">Child</option>
          <option value="relative">Relative</option>
          <option value="friend">Friend</option>
          <option value="colleague">Colleague</option>
        </select>
        {validationErrors.emergencyContactRelation && (
          <p className="text-red-600 text-sm mt-1">{validationErrors.emergencyContactRelation}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Address
        </label>
        <textarea
          value={formData.emergencyContactAddress}
          onChange={(e) => setFormData({ ...formData, emergencyContactAddress: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Emergency contact's complete address"
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Personal Information';
      case 2:
        return 'Contact & Address';
      case 3:
        return 'Registration Category';
      case 4:
        return 'Emergency Contact';
      default:
        return 'Registration';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 rounded-full blur-lg opacity-20"></div>
            <Building2 className="relative mx-auto h-16 w-16 text-blue-600" />
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our digital barangay community • Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Progress Indicator */}
        {renderStepIndicator()}
        
        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              {getStepTitle()}
            </h3>
          </div>

          <form onSubmit={currentStep === totalSteps ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}
            
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="submit"
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Next Step
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Create Account
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Why Register with Us?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Secure & Verified</h4>
              <p className="text-sm text-blue-700">Your data is protected with bank-level security</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-green-900 mb-2">Fast Processing</h4>
              <p className="text-sm text-green-700">Get your documents processed in minutes</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-purple-900 mb-2">24/7 Access</h4>
              <p className="text-sm text-purple-700">Access services anytime, anywhere</p>
            </div>
          </div>
        </div>
        
        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}