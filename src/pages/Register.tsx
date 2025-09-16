import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { 
  Building2, 
  ArrowLeft, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Calendar, 
  Shield, 
  Star, 
  Sparkles, 
  Home, 
  Users,
  UserPlus,
  FileText,
  MapPin,
  Heart,
  Award,
  Globe,
  Zap,
  Lock,
  Check,
  X
} from 'lucide-react';

export default function Register() {
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
    
    // Contact Information
    phoneNumber: '',
    alternatePhone: '',
    
    // Address Information
    houseNumber: '',
    street: '',
    purok: '',
    barangay: 'San Miguel',
    city: 'Metro Manila',
    province: 'Metro Manila',
    zipCode: '',
    
    // Personal Details
    birthDate: '',
    birthPlace: '',
    gender: '',
    civilStatus: '',
    nationality: 'Filipino',
    religion: '',
    occupation: '',
    monthlyIncome: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    emergencyContactAddress: '',
    
    // Additional Information
    voterStatus: '',
    pwdStatus: false,
    seniorCitizenStatus: false,
    indigentStatus: false
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
        if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
        if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
        break;
      case 2:
        if (!formData.houseNumber.trim()) errors.houseNumber = 'House number is required';
        if (!formData.street.trim()) errors.street = 'Street is required';
        if (!formData.purok.trim()) errors.purok = 'Purok/Sitio is required';
        if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required';
        break;
      case 3:
        if (!formData.birthDate) errors.birthDate = 'Birth date is required';
        if (!formData.birthPlace.trim()) errors.birthPlace = 'Birth place is required';
        if (!formData.gender) errors.gender = 'Gender is required';
        if (!formData.civilStatus) errors.civilStatus = 'Civil status is required';
        if (!formData.occupation.trim()) errors.occupation = 'Occupation is required';
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
      
      // Create complete name
      const fullName = [
        formData.firstName,
        formData.middleName,
        formData.lastName,
        formData.suffix
      ].filter(Boolean).join(' ');
      
      // Create complete address
      const completeAddress = [
        formData.houseNumber,
        formData.street,
        `Purok ${formData.purok}`,
        formData.barangay,
        formData.city,
        formData.province,
        formData.zipCode
      ].filter(Boolean).join(', ');
      
      // Create emergency contact string
      const emergencyContact = `${formData.emergencyContactName} - ${formData.emergencyContactPhone} (${formData.emergencyContactRelation}) - ${formData.emergencyContactAddress}`;
      
      const residentData = {
        name: fullName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        address: completeAddress,
        verification_status: 'non-verified',
        birth_date: formData.birthDate,
        gender: formData.gender,
        civil_status: formData.civilStatus,
        emergency_contact: emergencyContact,
        date_registered: new Date().toISOString().split('T')[0]
      };

      console.log('Creating resident with data:', residentData);
      await dataService.createResident(residentData);
      console.log('Resident created successfully');

      // Show success message
      alert('🎉 Registration successful! Welcome to our digital barangay community. You can now login with your email and password.');
      navigate('/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(`Registration failed: ${err.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <React.Fragment key={step}>
          <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
            step <= currentStep 
              ? 'border-blue-500 bg-blue-500 text-white shadow-lg' 
              : 'border-gray-300 bg-white text-gray-400'
          }`}>
            {step < currentStep ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <span className="font-bold">{step}</span>
            )}
          </div>
          {step < totalSteps && (
            <div className={`w-20 h-1 mx-3 transition-all duration-300 ${
              step < currentStep ? 'bg-blue-500' : 'bg-gray-300'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <User className="h-10 w-10 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
        <p className="text-gray-600 mt-2">Let's start with your basic details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your first name"
          />
          {validationErrors.firstName && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {validationErrors.firstName}
            </p>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Enter your middle name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your last name"
          />
          {validationErrors.lastName && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {validationErrors.lastName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suffix
          </label>
          <select
            value={formData.suffix}
            onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
            className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
        </div>
        {validationErrors.email && (
          <p className="text-red-600 text-sm mt-1 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {validationErrors.email}
          </p>
        )}
      </div>

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
            className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="+63 912 345 6789"
          />
        </div>
        {validationErrors.phoneNumber && (
          <p className="text-red-600 text-sm mt-1 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {validationErrors.phoneNumber}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
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
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {validationErrors.password}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
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
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Home className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Address Information</h3>
        <p className="text-gray-600 mt-2">Tell us where you live</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            House Number *
          </label>
          <input
            type="text"
            value={formData.houseNumber}
            onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.houseNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="e.g., 123, Blk 5 Lot 10"
          />
          {validationErrors.houseNumber && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {validationErrors.houseNumber}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street *
          </label>
          <input
            type="text"
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.street ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="e.g., Main Street, Rizal Avenue"
          />
          {validationErrors.street && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {validationErrors.street}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purok/Sitio *
          </label>
          <input
            type="text"
            value={formData.purok}
            onChange={(e) => setFormData({ ...formData, purok: e.target.value })}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.purok ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="e.g., 1, 2A, Centro"
          />
          {validationErrors.purok && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {validationErrors.purok}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Code *
          </label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.zipCode ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="e.g., 1000"
          />
          {validationErrors.zipCode && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {validationErrors.zipCode}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Barangay
          </label>
          <input
            type="text"
            value={formData.barangay}
            onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City/Municipality
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Enter city/municipality"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Calendar className="h-10 w-10 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Personal Details</h3>
        <p className="text-gray-600 mt-2">Additional information about yourself</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                validationErrors.birthDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
          </div>
          {validationErrors.birthDate && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {validationErrors.birthDate}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birth Place *
          </label>
          <input
            type="text"
            value={formData.birthPlace}
            onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.birthPlace ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="City, Province"
          />
          {validationErrors.birthPlace && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {validationErrors.birthPlace}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.gender ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {validationErrors.gender && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {validationErrors.gender}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Civil Status *
          </label>
          <select
            value={formData.civilStatus}
            onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
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
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {validationErrors.civilStatus}
            </p>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Filipino"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Religion
          </label>
          <input
            type="text"
            value={formData.religion}
            onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="e.g., Roman Catholic"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occupation *
          </label>
          <input
            type="text"
            value={formData.occupation}
            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.occupation ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="e.g., Teacher, Engineer, Student"
          />
          {validationErrors.occupation && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {validationErrors.occupation}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Income
          </label>
          <select
            value={formData.monthlyIncome}
            onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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

      {/* Special Status */}
      <div className="bg-blue-50 p-6 rounded-xl">
        <h4 className="font-semibold text-blue-900 mb-4">Special Status (if applicable)</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.pwdStatus}
              onChange={(e) => setFormData({ ...formData, pwdStatus: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-blue-800">Person with Disability (PWD)</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.seniorCitizenStatus}
              onChange={(e) => setFormData({ ...formData, seniorCitizenStatus: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-blue-800">Senior Citizen (60 years old and above)</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.indigentStatus}
              onChange={(e) => setFormData({ ...formData, indigentStatus: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-blue-800">Indigent Family</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-br from-red-100 to-red-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Shield className="h-10 w-10 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Emergency Contact</h3>
        <p className="text-gray-600 mt-2">Someone we can contact in case of emergency</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Important</h4>
            <p className="text-sm text-yellow-700">
              Please provide accurate emergency contact information. This person should be easily reachable 
              and willing to be contacted on your behalf in case of emergencies.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Name *
          </label>
          <input
            type="text"
            value={formData.emergencyContactName}
            onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              validationErrors.emergencyContactName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Full name of emergency contact"
          />
          {validationErrors.emergencyContactName && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {validationErrors.emergencyContactName}
            </p>
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
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                validationErrors.emergencyContactPhone ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="+63 912 345 6789"
            />
          </div>
          {validationErrors.emergencyContactPhone && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {validationErrors.emergencyContactPhone}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relationship *
          </label>
          <select
            value={formData.emergencyContactRelation}
            onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
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
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {validationErrors.emergencyContactRelation}
            </p>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Complete address of emergency contact"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Voter Status
        </label>
        <select
          value={formData.voterStatus}
          onChange={(e) => setFormData({ ...formData, voterStatus: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="">Select voter status</option>
          <option value="registered">Registered Voter</option>
          <option value="not-registered">Not Registered</option>
          <option value="not-eligible">Not Eligible (Under 18)</option>
        </select>
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
        return 'Address Information';
      case 3:
        return 'Personal Details';
      case 4:
        return 'Emergency Contact';
      default:
        return 'Registration';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Barangay San Miguel</h1>
                <p className="text-sm text-gray-600">Resident Registration</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 rounded-full blur-lg opacity-20"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <UserPlus className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Join Our Digital Community
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Register as a resident and access all barangay services online
            </p>
            <p className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps} • Secure & Confidential
            </p>
          </div>

          {/* Progress Indicator */}
          {renderStepIndicator()}
          
          {/* Main Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Sparkles className="h-6 w-6 mr-3" />
                {getStepTitle()}
              </h2>
              <p className="text-blue-100 mt-2">
                {currentStep === 1 && "Let's start with your basic information"}
                {currentStep === 2 && "Where do you live in our barangay?"}
                {currentStep === 3 && "Tell us more about yourself"}
                {currentStep === 4 && "Who should we contact in emergencies?"}
              </p>
            </div>

            <form onSubmit={currentStep === totalSteps ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="p-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-3" />
                  <div>
                    <h4 className="font-semibold">Registration Error</h4>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}
              
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center px-8 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="submit"
                    className="flex items-center px-10 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                  >
                    Continue
                    <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center px-10 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-3" />
                        Complete Registration
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Benefits Section */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Register with Us?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-blue-900 mb-3 text-lg">Secure & Verified</h4>
                <p className="text-blue-700">Your data is protected with bank-level security and encryption</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-green-900 mb-3 text-lg">Fast Processing</h4>
                <p className="text-green-700">Get your documents processed in minutes, not hours</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-purple-900 mb-3 text-lg">24/7 Access</h4>
                <p className="text-purple-700">Access services anytime, anywhere from any device</p>
              </div>
            </div>
          </div>
          
          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}