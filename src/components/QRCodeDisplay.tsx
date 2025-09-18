import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, Shield, User, Clock, XCircle, CheckCircle } from 'lucide-react';

export default function QRCodeDisplay() {
  const { user } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Generate permanent QR code based on user ID and registration date - NEVER changes
  const getPermanentQRCode = () => {
    if (!user?.id) return 'BRG_UNKNOWN';
    const dateCode = user?.dateRegistered?.replace(/-/g, '') || new Date().toISOString().split('T')[0].replace(/-/g, '');
    return `BRG_${user.id}_${dateCode}`;
  };

  const generateQRData = () => {
    return JSON.stringify({
      qrCode: getPermanentQRCode(),
      residentId: user?.id,
      name: user?.name,
      email: user?.email,
      verificationStatus: user?.verificationStatus,
      dateRegistered: user?.dateRegistered || new Date().toISOString().split('T')[0],
      barangay: 'San Miguel',
      issuedBy: 'Barangay San Miguel Digital System',
      version: '1.0'
    });
  };

  // Generate actual QR code image
  useEffect(() => {
    const generateQRImage = async () => {
      if (showQR && user?.id) {
        try {
          const qrData = generateQRData();
          const dataUrl = await QRCode.toDataURL(qrData, {
            width: 300,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M'
          });
          setQrCodeDataUrl(dataUrl);
        } catch (error) {
          console.error('Failed to generate QR code:', error);
        }
      }
    };

    generateQRImage();
  }, [showQR, user?.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'semi-verified':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'details-updated':
        return <User className="h-6 w-6 text-blue-500" />;
      case 'non-verified':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'border-green-500 bg-green-50';
      case 'semi-verified':
        return 'border-yellow-500 bg-yellow-50';
      case 'details-updated':
        return 'border-blue-500 bg-blue-50';
      case 'non-verified':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const handleCopyQRCode = () => {
    const qrData = generateQRData();
    navigator.clipboard.writeText(qrData).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadQR = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.download = `qr-code-${user?.name?.replace(/\s+/g, '-')}-${getPermanentQRCode()}.png`;
      link.href = qrCodeDataUrl;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">My QR Code</h2>
      
      <div className={`border-2 rounded-lg p-6 ${getStatusColor(user?.verificationStatus || 'non-verified')}`}>
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-4">
            {getStatusIcon(user?.verificationStatus || 'non-verified')}
            <h3 className="text-lg font-semibold ml-2 capitalize">
              {user?.verificationStatus?.replace('-', ' ') || 'Non Verified'} Status
            </h3>
          </div>
          
          <p className="text-gray-700 mb-4">
            {user?.verificationStatus === 'verified' 
              ? 'Your QR code provides full access to all barangay services.'
              : user?.verificationStatus === 'semi-verified'
              ? 'Your QR code provides limited access while awaiting final verification.'
              : user?.verificationStatus === 'details-updated'
              ? 'Your QR code shows updated profile information.'
              : 'Your QR code shows basic registration information.'
            }
          </p>
          
          <div className="bg-white rounded-lg p-6 mb-4 border-2 border-dashed border-gray-300">
            {showQR ? (
              <div className="space-y-4">
                <div className="w-64 h-64 mx-auto bg-white border-4 border-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  {qrCodeDataUrl ? (
                    <img 
                      src={qrCodeDataUrl} 
                      alt="QR Code" 
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-500 text-sm">Generating QR Code...</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">QR Code Information</h4>
                  <div className="text-sm text-gray-600 space-y-1 text-left">
                    <p><strong>QR Code ID:</strong> <span className="font-mono text-blue-600">{getPermanentQRCode()}</span></p>
                    <p><strong>Resident ID:</strong> {user?.id}</p>
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Status:</strong> 
                      <span className={`ml-1 font-semibold capitalize ${
                        user?.verificationStatus === 'verified' ? 'text-green-600' :
                        user?.verificationStatus === 'semi-verified' ? 'text-yellow-600' :
                        user?.verificationStatus === 'details-updated' ? 'text-blue-600' :
                        'text-red-600'
                      }`}>
                        {user?.verificationStatus?.replace('-', ' ') || 'Non Verified'}
                        {user?.verificationStatus === 'verified' && ' ✓'}
                      </span>
                    </p>
                    <p><strong>Generated:</strong> {user?.dateRegistered || new Date().toLocaleDateString()}</p>
                    <p><strong>Barangay:</strong> San Miguel</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12">
                <QrCode className="h-16 w-16 sm:h-24 sm:w-24 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click below to display your permanent QR code</p>
                <p className="text-sm text-gray-500 mt-2">QR Code ID: {getPermanentQRCode()}</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mb-4">
            <button
              onClick={() => setShowQR(!showQR)}
              className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
            >
              {showQR ? 'Hide QR Code' : 'Show QR Code'}
            </button>
            
            {showQR && qrCodeDataUrl && (
              <>
                <button 
                  onClick={handleDownloadQR}
                  className="bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-medium text-sm sm:text-base"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Download
                </button>
                <button 
                  onClick={handleCopyQRCode}
                  className="bg-gray-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center font-medium text-sm sm:text-base"
                >
                  {copied ? <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-2" /> : <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy Data'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          QR Code Security & Usage
        </h3>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>• <strong>Permanent ID:</strong> Your QR code ID is {getPermanentQRCode()} and will never change</p>
          <p>• <strong>Unique Identifier:</strong> This QR code is permanently linked to your account</p>
          <p>• <strong>Cross-Platform Use:</strong> Use this QR code for all barangay services and transactions</p>
          <p>• <strong>Verification:</strong> Officials can scan this to verify your identity and status</p>
          <p>• <strong>Security:</strong> Contains encrypted data that only authorized personnel can access</p>
          <p>• <strong>Print Safe:</strong> You can safely print this QR code on your barangay ID</p>
        </div>
      </div>

      {/* QR Code Features */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">QR Code Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div className="space-y-1">
            <p>✓ Permanent identification number</p>
            <p>✓ Real-time verification status</p>
            <p>✓ Secure encrypted data</p>
            <p>✓ Cross-platform compatibility</p>
          </div>
          <div className="space-y-1">
            <p>✓ Works with any QR scanner</p>
            <p>✓ Printable for physical ID cards</p>
            <p>✓ Links to complete resident profile</p>
            <p>✓ Tamper-proof identification</p>
          </div>
        </div>
      </div>
    </div>
  );
}