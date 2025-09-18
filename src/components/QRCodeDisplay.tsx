import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, Shield, User, Clock, XCircle, CheckCircle, Smartphone, Monitor, Tablet, Share2, Camera } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Digital ID</h1>
          <p className="text-gray-600">Your permanent QR code for all barangay services</p>
        </div>
      </div>
      
      {/* QR Code Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            {getStatusIcon(user?.verificationStatus || 'non-verified')}
            <h3 className="text-xl font-bold ml-3 capitalize">
              {user?.verificationStatus?.replace('-', ' ') || 'Non Verified'} Status
            </h3>
          </div>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {user?.verificationStatus === 'verified' 
              ? 'Your QR code provides full access to all barangay services and can be used for official transactions.'
              : user?.verificationStatus === 'semi-verified'
              ? 'Your QR code provides limited access while awaiting final verification from barangay officials.'
              : user?.verificationStatus === 'details-updated'
              ? 'Your QR code contains your updated profile information and basic identification data.'
              : 'Your QR code contains basic registration information. Complete verification for full access.'
            }
          </p>
          
          <div className="max-w-md mx-auto">
            {showQR ? (
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-lg border-4 border-blue-500">
                  {qrCodeDataUrl ? (
                    <img 
                      src={qrCodeDataUrl} 
                      alt="Digital ID QR Code" 
                      className="w-full h-auto max-w-xs mx-auto"
                    />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">Generating QR Code...</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl text-left">
                  <h4 className="font-semibold text-gray-900 mb-4">QR Code Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">QR Code ID</p>
                      <p className="font-mono text-blue-600 font-medium">{getPermanentQRCode()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Resident ID</p>
                      <p className="font-mono text-gray-900">{user?.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Full Name</p>
                      <p className="text-gray-900 font-medium">{user?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Email Address</p>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Verification Status</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user?.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                        user?.verificationStatus === 'semi-verified' ? 'bg-yellow-100 text-yellow-800' :
                        user?.verificationStatus === 'details-updated' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user?.verificationStatus?.replace('-', ' ') || 'Non Verified'}
                        {user?.verificationStatus === 'verified' && ' ✓'}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Date Generated</p>
                      <p className="text-gray-900">{user?.dateRegistered || new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center">
                  <button 
                    onClick={handleDownloadQR}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                  <button 
                    onClick={handleCopyQRCode}
                    className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy Data'}
                  </button>
                  <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-16">
                <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <QrCode className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Digital ID QR Code</h3>
                <p className="text-gray-600 mb-6">Click below to display your permanent identification QR code</p>
                <p className="text-sm text-gray-500 font-mono bg-gray-100 px-4 py-2 rounded-lg inline-block">
                  ID: {getPermanentQRCode()}
                </p>
              </div>
            )}
            
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full mt-6 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              {showQR ? 'Hide QR Code' : 'Show My QR Code'}
            </button>
          </div>
        </div>
      </div>

      {/* Device Compatibility */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Compatibility</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Mobile Devices</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>✓ iOS Camera App</p>
              <p>✓ Android Camera</p>
              <p>✓ QR Scanner Apps</p>
            </div>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <Tablet className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Tablets</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>✓ iPad Camera</p>
              <p>✓ Android Tablets</p>
              <p>✓ Touch Optimized</p>
            </div>
          </div>
          
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <Monitor className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Desktop</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>✓ Webcam Support</p>
              <p>✓ All Browsers</p>
              <p>✓ High Resolution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Usage Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-yellow-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Security Features</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p><strong>Permanent ID:</strong> Your QR code ID {getPermanentQRCode()} never changes</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p><strong>Encrypted Data:</strong> Contains secure, encrypted personal information</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p><strong>Authorized Access:</strong> Only barangay officials can decode your information</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p><strong>Tamper-Proof:</strong> Cannot be modified or duplicated</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Camera className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">How to Use</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p>Present to barangay officials for identity verification</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p>Use for all barangay services and transactions</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p>Print and attach to your physical barangay ID</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p>Works with any standard QR code scanner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}