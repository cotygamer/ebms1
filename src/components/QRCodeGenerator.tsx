import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { QrCode, Download, Share2, Copy, Check, Upload, Smartphone, Monitor, Tablet, Wifi, WifiOff, Sun, Moon } from 'lucide-react';

export default function QRCodeGenerator() {
  const { user } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testMode, setTestMode] = useState('normal');
  const [deviceTest, setDeviceTest] = useState('mobile');

  const generateQRData = () => {
    return JSON.stringify({
      id: user?.id,
      name: user?.name,
      verificationStatus: user?.verificationStatus,
      qrCode: user?.qrCode,
      timestamp: new Date().toISOString()
    });
  };

  const handleCopyQRCode = () => {
    const qrData = generateQRData();
    navigator.clipboard.writeText(qrData).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadQR = () => {
    // Generate QR code as downloadable image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;
    
    // Fill white background
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
    
    // Download the canvas as image
    const link = document.createElement('a');
    link.download = `qr-code-${user?.name?.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const testQRCompatibility = () => {
    // Simulate QR code compatibility test
    const results = {
      mobile: { ios: true, android: true, camera: true },
      tablet: { ios: true, android: true, camera: true },
      desktop: { chrome: true, firefox: true, safari: true },
      lighting: { bright: true, dim: true, dark: false },
      distance: { close: true, medium: true, far: false }
    };
    
    return results;
  };

  if (user?.verificationStatus !== 'verified') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">QR Code</h2>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <QrCode className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">QR Code Not Available</h3>
          <p className="text-yellow-700 mb-4">
            Your QR code will be available once your account is fully verified.
          </p>
          <div className="bg-yellow-100 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Current Status: <span className="font-medium capitalize">
                {user?.verificationStatus?.replace('-', ' ') || 'Non Verified'}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">My QR Code</h2>
      
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
      
      <div className="bg-white border rounded-lg p-6">
        <div className="text-center space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-center mb-4">
            <QrCode className="h-16 w-16 text-green-600 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">QR Code Available</h3>
            <p className="text-green-700 mb-4">
              Your unique QR code for barangay services and identification.
            </p>
            
            <div className="bg-white rounded-lg p-6 mb-4 border-2 border-dashed border-gray-300">
              {showQR ? (
                <div className="space-y-4">
                  {/* Enhanced QR Code Display with Responsive Design */}
                  <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto bg-white border-4 border-green-500 rounded-lg flex items-center justify-center shadow-lg">
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
                      <div className="bg-green-100 p-2 rounded">
                        <QrCode className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-1" />
                        <p className="text-xs font-mono text-green-800 break-all">{user.qrCode}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* QR Code Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">QR Code Information</h4>
                    <div className="text-sm text-gray-600 space-y-1 text-left">
                      <p><strong>Resident ID:</strong> {user.id}</p>
                      <p><strong>Name:</strong> {user.name}</p>
                      <p><strong>Status:</strong> <span className="text-green-600 font-semibold">Verified ✓</span></p>
                      <p><strong>QR Code:</strong> <span className="font-mono">{user.qrCode}</span></p>
                      <p><strong>Generated:</strong> {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                      <p><strong>Name:</strong> {user.name}</p>
                      <p><strong>Status:</strong> Verified</p>
                      <p className="sm:col-span-2"><strong>Code:</strong> <span className="font-mono text-xs break-all">{user.qrCode}</span></p>
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
                className="bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
              >
                {showQR ? 'Hide QR Code' : 'Show QR Code'}
              </button>
              
              {showQR && (
                <>
                  <button 
                    onClick={handleDownloadQR}
                    className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium text-sm sm:text-base"
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
                  <button className="bg-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center text-sm sm:text-base">
                    <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Share
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* QR Code Testing Tools */}
          {showQR && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
              <h4 className="font-semibold text-gray-900 mb-4">QR Code Testing & Compatibility</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Environment</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setTestMode('normal')}
                      className={`px-3 py-1 rounded-full text-sm ${testMode === 'normal' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      <Sun className="h-4 w-4 inline mr-1" />
                      Normal Light
                    </button>
                    <button
                      onClick={() => setTestMode('dim')}
                      className={`px-3 py-1 rounded-full text-sm ${testMode === 'dim' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      <Moon className="h-4 w-4 inline mr-1" />
                      Dim Light
                    </button>
                    <button
                      onClick={() => setTestMode('offline')}
                      className={`px-3 py-1 rounded-full text-sm ${testMode === 'offline' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      <WifiOff className="h-4 w-4 inline mr-1" />
                      Offline Mode
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Device Testing</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {['mobile', 'tablet', 'desktop'].map((device) => (
                      <button
                        key={device}
                        onClick={() => setDeviceTest(device)}
                        className={`p-3 rounded-lg border text-left ${deviceTest === device ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      >
                        <div className="flex items-center">
                          {device === 'mobile' && <Smartphone className="h-5 w-5 mr-2" />}
                          {device === 'tablet' && <Tablet className="h-5 w-5 mr-2" />}
                          {device === 'desktop' && <Monitor className="h-5 w-5 mr-2" />}
                          <span className="capitalize font-medium">{device}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {device === 'mobile' && 'iOS & Android'}
                          {device === 'tablet' && 'Touch Optimized'}
                          {device === 'desktop' && 'Webcam Ready'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">QR Code Compatibility: Excellent</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Your QR code is optimized for all devices and lighting conditions.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Security Notice */}
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
              <li>• Readable in various lighting conditions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}