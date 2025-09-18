import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Clock, XCircle, Upload } from 'lucide-react';

export default function VerificationStatus() {
  const { user } = useAuth();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'semi-verified':
        return <Clock className="h-8 w-8 text-yellow-500" />;
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
        return 'Your account is fully verified. You have access to all services and can generate your QR code.';
      case 'semi-verified':
        return 'Your account is partially verified. Please submit additional documents to complete verification.';
      case 'non-verified':
        return 'Your account is not yet verified. Please submit the required documents to begin the verification process.';
      default:
        return 'Verification status unknown.';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Verification Status</h2>
      
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          {getStatusIcon(user?.verificationStatus || 'non-verified')}
          <div>
            <h3 className={`text-xl font-semibold capitalize ${getStatusColor(user?.verificationStatus || 'non-verified')}`}>
              {user?.verificationStatus?.replace('-', ' ') || 'Non Verified'}
            </h3>
            <p className="text-gray-600">
              {getStatusDescription(user?.verificationStatus || 'non-verified')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Progress</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              user?.verificationStatus !== 'non-verified' ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              {user?.verificationStatus !== 'non-verified' && (
                <CheckCircle className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Initial Registration</p>
              <p className="text-sm text-gray-600">Basic information submitted</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              user?.verificationStatus === 'semi-verified' || user?.verificationStatus === 'verified' ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              {(user?.verificationStatus === 'semi-verified' || user?.verificationStatus === 'verified') && (
                <CheckCircle className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Document Verification</p>
              <p className="text-sm text-gray-600">Required documents uploaded and reviewed</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              user?.verificationStatus === 'verified' ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              {user?.verificationStatus === 'verified' && (
                <CheckCircle className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Full Verification</p>
              <p className="text-sm text-gray-600">Account fully verified with QR code access</p>
            </div>
          </div>
        </div>
      </div>

      {user?.verificationStatus !== 'verified' && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Valid Government ID</h4>
                <p className="text-sm text-gray-600">Upload a clear photo of your government-issued ID</p>
              </div>
              <button className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Proof of Address</h4>
                <p className="text-sm text-gray-600">Utility bill or any document showing your current address</p>
              </div>
              <button className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Birth Certificate</h4>
                <p className="text-sm text-gray-600">Official copy of your birth certificate</p>
              </div>
              <button className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}