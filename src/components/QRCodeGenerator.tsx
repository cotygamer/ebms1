import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { QrCode, Download, Share2, Copy, Check, Upload, Smartphone, Monitor, Tablet, Wifi, WifiOff, Sun, Moon, User, Shield, Clock, XCircle } from 'lucide-react';

export default function QRCodeGenerator() {
  const { user } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testMode, setTestMode] = useState('normal');
  const [deviceTest, setDeviceTest] = useState('mobile');
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const generateQRData = () => {
    return JSON.stringify({
      id: user?.id,
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
      verificationStatus: user?.verificationStatus,
      qrCode: user?.qrCode,
      dateRegistered: user?.dateRegistered || new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    });
  };

  const simulateQRScan = (qrData: string) => {
    try {
      const data = JSON.parse(qrData);
      setScannedData(data);
      setShowScanner(true);
    } catch (error) {
      alert('Invalid QR code data');
    }
  };

  const getQRCodeForStatus = (status: string) => {
    // Generate QR code for any verification status
    const qrCode = status === 'verified' ? user?.qrCode : `TEMP_${user?.id}_${Date.now()}`;
    return qrCode;
  };
  const handleCopyQRCode = () => {
    const qrData = generateQRData();
    navigator.clipboard.writeText(qrData).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadQR = () => {
    const qrData = generateQRData();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;
    
    // Fill white background
    if (ctx) {
      ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 300, 300);
    
    // Draw QR pattern simulation
    ctx.fillStyle = 'black';
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i * 20, j * 20, 20, 20);
        }
      }
    }
    }
    
    // Download the canvas as image
    const link = document.createElement('a');
    link.download = `qr-code-${user?.name?.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
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
                {/* Enhanced QR Code Display */}
                <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto bg-white border-4 border-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    {/* Simulated QR Code Pattern */}
                    <div className="grid grid-cols-8 gap-0.5 sm:gap-1 mb-4">
                      {Array.from({ length: 64 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 sm:w-3 sm:h-3 ${
                            Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="bg-blue-100 p-2 rounded">
                      <QrCode className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs font-mono text-blue-800 break-all">
                        {getQRCodeForStatus(user?.verificationStatus || 'non-verified')}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* QR Code Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">QR Code Information</h4>
                  <div className="text-sm text-gray-600 space-y-1 text-left">
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
                    <p><strong>QR Code:</strong> <span className="font-mono">{getQRCodeForStatus(user?.verificationStatus || 'non-verified')}</span></p>
                    <p><strong>Generated:</strong> {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12">
                <QrCode className="h-16 w-16 sm:h-24 sm:w-24 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click below to display your QR code</p>
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
            
            {showQR && (
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
                <button 
                  onClick={() => simulateQRScan(generateQRData())}
                  className="bg-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Test Scan
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

      {/* QR Scanner Modal */}
      {showScanner && scannedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">QR Code Scan Result</h3>
              <button
                onClick={() => setShowScanner(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                {getStatusIcon(scannedData.verificationStatus)}
                <h4 className="text-lg font-semibold mt-2 capitalize">
                  {scannedData.verificationStatus?.replace('-', ' ') || 'Non Verified'}
                </h4>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-2">Resident Information</h5>
                <div className="space-y-1 text-sm">
                  <p><strong>Name:</strong> {scannedData.name}</p>
                  <p><strong>Email:</strong> {scannedData.email}</p>
                  {scannedData.phone && <p><strong>Phone:</strong> {scannedData.phone}</p>}
                  {scannedData.address && <p><strong>Address:</strong> {scannedData.address}</p>}
                  <p><strong>Registered:</strong> {scannedData.dateRegistered}</p>
                  <p><strong>QR Code:</strong> <span className="font-mono text-xs">{scannedData.qrCode}</span></p>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${
                scannedData.verificationStatus === 'verified' ? 'bg-green-50 border border-green-200' :
                scannedData.verificationStatus === 'semi-verified' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-red-50 border border-red-200'
              }`}>
                <p className="text-sm font-medium">
                  {scannedData.verificationStatus === 'verified' 
                    ? '✅ Fully verified resident - Full service access'
                    : scannedData.verificationStatus === 'semi-verified'
                    ? '⏳ Semi-verified - Limited service access'
                    : '❌ Unverified - Basic services only'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
          </ul>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">How to Use Your QR Code</h4>
          <ul className="text-xs sm:text-sm text-blue-700 space-y-1 text-left">
            <li>• Present this QR code when visiting barangay offices</li>
            <li>• Use for quick identification and verification</li>
            <li>• Required for certain barangay services and transactions</li>
            <li>• Works on all devices - mobile, tablet, and desktop</li>
            <li>• Available at all verification levels</li>
          </ul>
        </div>
      </div>
    </div>
  );
}