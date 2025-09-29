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
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Verification Status</h2>
      
      <div className="bg-white border rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
          {getStatusIcon(user?.verificationStatus || 'non-verified')}
          <div>
            <h3 className={`text-lg sm:text-xl font-semibold capitalize ${getStatusColor(user?.verificationStatus || 'non-verified')}`}>
              {user?.verificationStatus?.replace('-', ' ') || 'Non Verified'}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {getStatusDescription(user?.verificationStatus || 'non-verified')}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced KYC Verification Process */}
      <div className="bg-white border rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Progress</h3>
        
        <div className="space-y-6">
          {/* Step 1: Initial Registration */}
          <div className="flex items-start space-x-4">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              user?.verificationStatus !== 'non-verified' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {user?.verificationStatus !== 'non-verified' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <span className="text-xs font-bold">1</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <User className="h-4 w-4 text-gray-500" />
                <p className="font-medium text-gray-900">Initial Registration</p>
              </div>
              <p className="text-sm text-gray-600 mb-2">Account created with basic information</p>
              <div className="text-xs text-gray-500">
                Status: <span className="font-medium">Newly Registered (Unverified)</span>
              </div>
            </div>
          </div>
          
          {/* Step 2: Details Updated */}
          <div className="flex items-start space-x-4">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              ['details-updated', 'semi-verified', 'verified'].includes(user?.verificationStatus || '') ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {['details-updated', 'semi-verified', 'verified'].includes(user?.verificationStatus || '') ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <span className="text-xs font-bold">2</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Mail className="h-4 w-4 text-gray-500" />
                <p className="font-medium text-gray-900">Profile Completion</p>
              </div>
              <p className="text-sm text-gray-600 mb-2">Complete email, contact information, and personal details</p>
              <div className="text-xs text-gray-500">
                Status: <span className="font-medium">Details Updated (Non-verified to Semi-verified)</span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-xs text-gray-600">
                  <Phone className="h-3 w-3 mr-1" />
                  Contact information required
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <Home className="h-3 w-3 mr-1" />
                  Complete address required
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 3: Semi-Verified */}
          <div className="flex items-start space-x-4">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              ['semi-verified', 'verified'].includes(user?.verificationStatus || '') ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {['semi-verified', 'verified'].includes(user?.verificationStatus || '') ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <span className="text-xs font-bold">3</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Shield className="h-4 w-4 text-gray-500" />
                <p className="font-medium text-gray-900">Semi-Verified Status</p>
              </div>
              <p className="text-sm text-gray-600 mb-2">Submit government ID and pin exact house location</p>
              <div className="text-xs text-gray-500 mb-2">
                Status: <span className="font-medium">Semi-verified (Pending Physical Verification)</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-xs text-gray-600">
                  <FileText className="h-3 w-3 mr-1" />
                  Government-issued ID required
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <MapPin className="h-3 w-3 mr-1" />
                  House location mapping mandatory
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 4: Full Verification */}
          <div className="flex items-start space-x-4">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              user?.verificationStatus === 'verified' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {user?.verificationStatus === 'verified' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <span className="text-xs font-bold">4</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="h-4 w-4 text-gray-500" />
                <p className="font-medium text-gray-900">Full Verification</p>
              </div>
              <p className="text-sm text-gray-600 mb-2">Physical verification by barangay officials completed</p>
              <div className="text-xs text-gray-500 mb-2">
                Status: <span className="font-medium">Fully Verified (Complete Access)</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-xs text-gray-600">
                  <Home className="h-3 w-3 mr-1" />
                  House location physically verified
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  QR code access enabled
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Business Rules */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Important QR Code & Verification Rules
        </h3>
        <div className="space-y-3 text-sm text-yellow-700">
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p><strong>Permanent QR Code:</strong> Your QR code ID is generated once and never changes. It's permanently linked to your account for life.</p>
          </div>
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p><strong>Profile Changes:</strong> Profile updates may affect your verification status but your QR code ID remains the same.</p>
          </div>
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p><strong>House Location:</strong> Pinning your exact house location is mandatory as this serves as your official digital address for all barangay services.</p>
          </div>
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p><strong>Approval Authority:</strong> Only authorized barangay staff and system administrators can approve final verification status.</p>
          </div>
        </div>
      </div>

      {user?.verificationStatus !== 'verified' && (
        <div className="bg-white border rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg space-y-3 sm:space-y-0">
              <div>
                <h4 className="font-medium text-gray-900">Valid Government ID</h4>
                <p className="text-sm text-gray-600">Upload a clear photo of your government-issued ID</p>
              </div>
              <button className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg space-y-3 sm:space-y-0">
              <div>
                <h4 className="font-medium text-gray-900">Proof of Address</h4>
                <p className="text-sm text-gray-600">Utility bill or any document showing your current address</p>
              </div>
              <button className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg space-y-3 sm:space-y-0">
              <div>
                <h4 className="font-medium text-gray-900">House Location Mapping</h4>
                <p className="text-sm text-gray-600">Pin your exact house location on the interactive map</p>
              </div>
              <button className="flex items-center px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                Pin Location
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Verification Benefits */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-4">Verification Benefits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-green-800">Semi-Verified Access:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Basic document requests</li>
              <li>• Profile management</li>
              <li>• Community announcements</li>
              <li>• Contact support services</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-green-800">Fully Verified Access:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• All document services</li>
              <li>• QR code generation</li>
              <li>• Online payment options</li>
              <li>• Priority support</li>
              <li>• Complete service access</li>
            </ul>
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