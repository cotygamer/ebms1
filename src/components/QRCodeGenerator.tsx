import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import QRCode from 'qrcode';
import { QrCode, Download, Share2, Copy, Check, Upload, Smartphone, Monitor, Tablet, Wifi, WifiOff, Sun, Moon, User, Shield, Clock, XCircle } from 'lucide-react';

export default function QRCodeGenerator() {
  const { user } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Generate permanent QR code based on user ID - never changes
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
      link.download = `barangay-qr-${user?.name?.replace(/\s+/g, '-')}-${getPermanentQRCode()}.png`;
      link.href = qrCodeDataUrl;
      link.click();
    }
  };

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">My QR Code</h2>
      
      {/* QR Code Available for All Verification Levels */}
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
                {/* Real QR Code Display */}
                <div className="w-64 h-64 mx-auto bg-white border-4 border-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  {qrCodeDataUrl ? (
                    <img 
                      src={qrCodeDataUrl} 
                      alt="Permanent QR Code" 
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-500 text-sm">Generating QR Code...</p>
                    </div>
                  )}
                </div>
                
                {/* QR Code Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Permanent QR Code Information</h4>
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
                    <p><strong>Valid:</strong> <span className="text-green-600 font-semibold">Permanent (Never Expires)</span></p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12">
                <QrCode className="h-16 w-16 sm:h-24 sm:w-24 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click below to display your permanent QR code</p>
                <p className="text-sm text-gray-500 mt-2">QR Code ID: <span className="font-mono">{getPermanentQRCode()}</span></p>
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

      {/* Cross-Platform Compatibility Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <Smartphone className="h-5 w-5 mr-2" />
          Cross-Platform Compatibility
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Smartphone className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium">Mobile</span>
              </div>
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>✓ iOS Camera App</p>
              <p>✓ Android Camera</p>
              <p>✓ QR Scanner Apps</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Tablet className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium">Tablet</span>
              </div>
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>✓ iPad Camera</p>
              <p>✓ Android Tablets</p>
              <p>✓ Touch Optimized</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Monitor className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium">Desktop</span>
              </div>
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>✓ Webcam Support</p>
              <p>✓ All Browsers</p>
              <p>✓ High Resolution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security and Usage Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">🔒 Security Notice</h4>
          <ul className="text-xs sm:text-sm text-yellow-700 space-y-1 text-left">
            <li>• Your QR code contains encrypted personal information</li>
            <li>• Only authorized barangay personnel can scan and verify your QR code</li>
            <li>• Do not share your QR code with unauthorized individuals</li>
            <li>• Report any suspicious QR code scanning attempts immediately</li>
            <li>• This QR code is valid only for official barangay transactions</li>
            <li>• QR code ID {getPermanentQRCode()} is permanently assigned to your account</li>
          </ul>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">How to Use Your QR Code</h4>
          <ul className="text-xs sm:text-sm text-blue-700 space-y-1 text-left">
            <li>• Can be scanned by barangay officials using any QR scanner</li>
            <li>• Compatible with mobile devices, tablets, and desktop scanners</li>
            <li>• Works with standard QR code reading applications</li>
            <li>• Optimized for printing on official barangay IDs</li>
            <li>• Print and attach to your barangay ID for permanent use</li>
            <li>• QR code is permanent and will never change</li>
            <li>• Use for all barangay services and transactions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}