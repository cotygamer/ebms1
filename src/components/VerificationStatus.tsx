import React from 'react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Clock, XCircle, Upload, MapPin, Camera, FileText, Shield, AlertTriangle, User, Mail, Phone, Home, Edit } from 'lucide-react';

export default function VerificationStatus() {
  const { user } = useAuth();
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'semi-verified':
        return <Clock className="h-8 w-8 text-yellow-500" />;
      case 'details-updated':
        return <Edit className="h-8 w-8 text-blue-500" />;
      case 'non-verified':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Clock className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600';
      case 'semi-verified':
        return 'text-yellow-600';
      case 'non-verified':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Your account is fully verified by barangay officials. You have complete access to all services and can generate your QR code.';
      case 'semi-verified':
        return 'Your documents and location have been submitted. Awaiting physical verification by barangay officials.';
      case 'details-updated':
        return 'Your profile details are complete. Please submit required documents and pin your house location for semi-verification.';
      case 'non-verified':
        return 'Your account is newly registered. Please complete your profile details to begin the verification process.';
      default:
        return 'Verification status unknown.';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Verification</h1>
          <p className="text-gray-600">Track your verification progress and requirements</p>
        </div>
      </div>
      
      {/* Current Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {getStatusIcon(user?.verificationStatus || 'non-verified')}
            <h3 className={`text-2xl font-bold ml-4 capitalize ${getStatusColor(user?.verificationStatus || 'non-verified')}`}>
              {user?.verificationStatus?.replace('-', ' ') || 'Non Verified'}
            </h3>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 text-lg leading-relaxed">
              {getStatusDescription(user?.verificationStatus || 'non-verified')}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced KYC Verification Process */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-8 text-center">Verification Process</h3>
        
        <div className="space-y-8">
          {/* Step 1: Initial Registration */}
          <div className="flex items-start space-x-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
              user?.verificationStatus !== 'non-verified' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {user?.verificationStatus !== 'non-verified' ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <span className="text-lg font-bold">1</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <User className="h-5 w-5 text-gray-500" />
                <h4 className="text-lg font-semibold text-gray-900">Initial Registration</h4>
              </div>
              <p className="text-gray-600 mb-3">Account created with basic information</p>
              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                <strong>Status:</strong> Newly Registered (Unverified)
              </div>
            </div>
          </div>
          
          {/* Step 2: Details Updated */}
          <div className="flex items-start space-x-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
              ['details-updated', 'semi-verified', 'verified'].includes(user?.verificationStatus || '') ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {['details-updated', 'semi-verified', 'verified'].includes(user?.verificationStatus || '') ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <span className="text-lg font-bold">2</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <h4 className="text-lg font-semibold text-gray-900">Profile Completion</h4>
              </div>
              <p className="text-gray-600 mb-3">Complete email, contact information, and personal details</p>
              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg mb-3">
                <strong>Status:</strong> Details Updated (Non-verified to Semi-verified)
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>Contact information required</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Home className="h-4 w-4 mr-2" />
                  <span>Complete address required</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 3: Semi-Verified */}
          <div className="flex items-start space-x-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
              ['semi-verified', 'verified'].includes(user?.verificationStatus || '') ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {['semi-verified', 'verified'].includes(user?.verificationStatus || '') ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <span className="text-lg font-bold">3</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="h-5 w-5 text-gray-500" />
                <h4 className="text-lg font-semibold text-gray-900">Semi-Verified Status</h4>
              </div>
              <p className="text-gray-600 mb-3">Submit government ID and pin exact house location</p>
              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg mb-3">
                <strong>Status:</strong> Semi-verified (Pending Physical Verification)
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Government-issued ID required</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>House location mapping mandatory</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 4: Full Verification */}
          <div className="flex items-start space-x-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
              user?.verificationStatus === 'verified' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {user?.verificationStatus === 'verified' ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <span className="text-lg font-bold">4</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <CheckCircle className="h-5 w-5 text-gray-500" />
                <h4 className="text-lg font-semibold text-gray-900">Full Verification</h4>
              </div>
              <p className="text-gray-600 mb-3">Physical verification by barangay officials completed</p>
              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg mb-3">
                <strong>Status:</strong> Fully Verified (Complete Access)
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Home className="h-4 w-4 mr-2" />
                  <span>House location physically verified</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>QR code access enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Business Rules */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Important Guidelines</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Permanent QR Code</h4>
                <p className="text-sm text-gray-600">Your QR code ID is generated once and never changes. It's permanently linked to your account.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">House Location</h4>
                <p className="text-sm text-gray-600">Pinning your exact house location is mandatory for verification and serves as your official digital address.</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Profile Updates</h4>
                <p className="text-sm text-gray-600">Profile changes may affect your verification status but your QR code ID remains permanent.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Approval Authority</h4>
                <p className="text-sm text-gray-600">Only authorized barangay staff can approve final verification status.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {user?.verificationStatus !== 'verified' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Required Documents</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Valid Government ID</h4>
                <p className="text-sm text-gray-600">Upload a clear photo of your government-issued ID</p>
              </div>
              <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Upload className="h-5 w-5 mr-2" />
                Upload
              </button>
            </div>
            
            <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Proof of Address</h4>
                <p className="text-sm text-gray-600">Utility bill or document showing your current address</p>
              </div>
              <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Upload className="h-5 w-5 mr-2" />
                Upload
              </button>
            </div>
            
            <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">House Location Mapping</h4>
                <p className="text-sm text-gray-600">Pin your exact house location on the interactive map</p>
              </div>
              <button className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <MapPin className="h-5 w-5 mr-2" />
                Pin Location
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Verification Benefits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Verification Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-yellow-50 p-6 rounded-xl">
            <h4 className="font-semibold text-yellow-800 mb-4">Semi-Verified Access</h4>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-yellow-700">
                <CheckCircle className="h-4 w-4 mr-3 text-yellow-600" />
                <span>Basic document requests</span>
              </div>
              <div className="flex items-center text-sm text-yellow-700">
                <CheckCircle className="h-4 w-4 mr-3 text-yellow-600" />
                <span>Profile management</span>
              </div>
              <div className="flex items-center text-sm text-yellow-700">
                <CheckCircle className="h-4 w-4 mr-3 text-yellow-600" />
                <span>Community announcements</span>
              </div>
              <div className="flex items-center text-sm text-yellow-700">
                <CheckCircle className="h-4 w-4 mr-3 text-yellow-600" />
                <span>Contact support services</span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-xl">
            <h4 className="font-semibold text-green-800 mb-4">Fully Verified Access</h4>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-green-700">
                <CheckCircle className="h-4 w-4 mr-3 text-green-600" />
                <span>All document services</span>
              </div>
              <div className="flex items-center text-sm text-green-700">
                <CheckCircle className="h-4 w-4 mr-3 text-green-600" />
                <span>QR code generation</span>
              </div>
              <div className="flex items-center text-sm text-green-700">
                <CheckCircle className="h-4 w-4 mr-3 text-green-600" />
                <span>Online payment options</span>
              </div>
              <div className="flex items-center text-sm text-green-700">
                <CheckCircle className="h-4 w-4 mr-3 text-green-600" />
                <span>Priority support</span>
              </div>
              <div className="flex items-center text-sm text-green-700">
                <CheckCircle className="h-4 w-4 mr-3 text-green-600" />
                <span>Complete service access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Audit Trail Section */}
      {user?.auditTrail && user.auditTrail.length > 0 && (
        <div className="bg-white border rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Verification History</h3>
            <button
              onClick={() => setShowAuditTrail(!showAuditTrail)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showAuditTrail ? 'Hide' : 'Show'} History
            </button>
          </div>
          
          {showAuditTrail && (
            <div className="space-y-3">
              {user.auditTrail.map((entry, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{entry.action}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {entry.previousStatus && entry.newStatus && (
                    <p className="text-sm text-gray-600">
                      Status changed from <span className="font-medium capitalize">{entry.previousStatus.replace('-', ' ')}</span> to{' '}
                      <span className="font-medium capitalize">{entry.newStatus.replace('-', ' ')}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500">By: {entry.approvedBy}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}