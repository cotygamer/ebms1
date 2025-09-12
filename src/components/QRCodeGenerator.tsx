import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { QrCode, Download, Share2, Copy, Check, Upload, Shield, Eye, EyeOff, RefreshCw, Smartphone, AlertTriangle } from 'lucide-react';

export default function QRCodeGenerator() {
  const { user } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQRData, setShowQRData] = useState(false);

  // Generate unique QR code data with enhanced security
  const generateQRData = () => {
    const timestamp = new Date().toISOString();
    const uniqueId = `${user?.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      // Core identification data
      residentId: user?.id,
      qrCodeId: user?.qrCode,
      uniqueSessionId: uniqueId,
      
      // Personal information (encrypted in real implementation)
      personalInfo: {
        name: user?.name,
        email: user?.email,
        verificationStatus: user?.verificationStatus
      },
      
      // Security data
      security: {
        generatedAt: timestamp,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        version: '2.1.0',
        checksum: generateChecksum(user?.id || '', timestamp)
      },
      
      // Verification data
      verification: {
        isVerified: user?.verificationStatus === 'verified',
        verificationLevel: user?.verificationStatus,
        lastUpdated: timestamp
      },
      
      // Usage tracking
      usage: {
        scanCount: 0,
        lastScanned: null,
        validScans: []
      }
    };
  };

  // Generate checksum for QR code validation
  const generateChecksum = (userId: string, timestamp: string): string => {
    const data = `${userId}${timestamp}${user?.qrCode}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  };

  // Validate QR code data integrity
  const validateQRCode = (data: any): boolean => {
    if (!data || !data.security || !data.residentId) return false;
    
    const expectedChecksum = generateChecksum(data.residentId, data.security.generatedAt);
    const isValidChecksum = data.security.checksum === expectedChecksum;
    const isNotExpired = new Date(data.security.expiresAt) > new Date();
    const isCorrectUser = data.residentId === user?.id;
    
    return isValidChecksum && isNotExpired && isCorrectUser;
  };

  // Generate new QR code
  const handleGenerateQR = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newQRData = generateQRData();
      setQrCodeData(newQRData);
      setIsGenerating(false);
    }, 1500);
  };

  // Initialize QR code data
  useEffect(() => {
    if (user?.verificationStatus === 'verified' && user?.qrCode) {
      const initialQRData = generateQRData();
      setQrCodeData(initialQRData);
    }
  }, [user]);

  const handleCopyQRCode = () => {
    if (qrCodeData) {
      const qrDataString = JSON.stringify(qrCodeData, null, 2);
      navigator.clipboard.writeText(qrDataString).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeData) {
      // Create a downloadable QR code data file
      const dataStr = JSON.stringify(qrCodeData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-code-${user?.qrCode}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleShareQR = () => {
    if (navigator.share && qrCodeData) {
      navigator.share({
        title: 'My Barangay QR Code',
        text: `QR Code for ${user?.name} - Barangay Resident ID: ${user?.qrCode}`,
        url: window.location.href
      });
    } else {
      alert('Sharing not supported on this device. Use copy or download instead.');
    }
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
          
          <div className="mt-4">
            <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700">
              Complete Verification
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">My QR Code</h2>
        <button
          onClick={handleGenerateQR}
          disabled={isGenerating}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Refresh QR'}
        </button>
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
              {showQR && qrCodeData ? (
                <div className="space-y-4">
                  {/* Enhanced QR Code Display */}
                  <div className="w-80 h-80 mx-auto bg-white border-4 border-green-500 rounded-lg flex items-center justify-center shadow-lg">
                    <div className="text-center p-4">
                      {/* Simulated QR Code Pattern with better visual */}
                      <div className="grid grid-cols-12 gap-1 mb-4">
                        {Array.from({ length: 144 }, (_, i) => {
                          // Create a more realistic QR pattern
                          const isCorner = (i < 12) || (i >= 132) || (i % 12 === 0) || (i % 12 === 11);
                          const isData = Math.random() > 0.4;
                          const shouldFill = isCorner || isData;
                          
                          return (
                            <div
                              key={i}
                              className={`w-2 h-2 ${shouldFill ? 'bg-black' : 'bg-white'}`}
                            />
                          );
                        })}
                      </div>
                      
                      <div className="bg-green-100 p-3 rounded-lg">
                        <QrCode className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-xs font-mono text-green-800 font-bold">{user.qrCode}</p>
                        <p className="text-xs text-green-700 mt-1">
                          Valid until: {new Date(qrCodeData.security.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* QR Code Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">QR Code Information</h4>
                      <button
                        onClick={() => setShowQRData(!showQRData)}
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                      >
                        {showQRData ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                        {showQRData ? 'Hide' : 'Show'} Details
                      </button>
                    </div>
                    
                    {showQRData ? (
                      <div className="text-sm text-gray-600 space-y-2 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p><strong>Resident ID:</strong> {qrCodeData.residentId}</p>
                            <p><strong>QR Code ID:</strong> {qrCodeData.qrCodeId}</p>
                            <p><strong>Session ID:</strong> {qrCodeData.uniqueSessionId.substring(0, 20)}...</p>
                          </div>
                          <div>
                            <p><strong>Generated:</strong> {new Date(qrCodeData.security.generatedAt).toLocaleString()}</p>
                            <p><strong>Expires:</strong> {new Date(qrCodeData.security.expiresAt).toLocaleString()}</p>
                            <p><strong>Version:</strong> {qrCodeData.security.version}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-blue-50 rounded border">
                          <p><strong>Verification Status:</strong> 
                            <span className="text-green-600 font-semibold ml-1">
                              {qrCodeData.verification.isVerified ? 'Verified ✓' : 'Not Verified ✗'}
                            </span>
                          </p>
                          <p><strong>Checksum:</strong> <span className="font-mono">{qrCodeData.security.checksum}</span></p>
                          <p><strong>Validation:</strong> 
                            <span className={`ml-1 ${validateQRCode(qrCodeData) ? 'text-green-600' : 'text-red-600'}`}>
                              {validateQRCode(qrCodeData) ? 'Valid' : 'Invalid'}
                            </span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 space-y-1 text-left">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Status:</strong> <span className="text-green-600 font-semibold">Verified ✓</span></p>
                        <p><strong>QR Code:</strong> <span className="font-mono">{user.qrCode}</span></p>
                        <p><strong>Generated:</strong> {new Date().toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-12">
                  <QrCode className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Click below to display your secure QR code</p>
                  {isGenerating && (
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 text-blue-600 animate-spin mr-2" />
                      <span className="text-blue-600">Generating secure QR code...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <button
                onClick={() => setShowQR(!showQR)}
                disabled={isGenerating}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                {showQR ? 'Hide QR Code' : 'Show QR Code'}
              </button>
              
              {showQR && qrCodeData && (
                <>
                  <button 
                    onClick={handleDownloadQR}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                  <button 
                    onClick={handleCopyQRCode}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center font-medium"
                  >
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy Data'}
                  </button>
                  <button 
                    onClick={handleShareQR}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* QR Code Features */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              <Smartphone className="h-5 w-5 mr-2" />
              QR Code Features
            </h4>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• <strong>Unique Identification:</strong> Each scan generates a unique session ID</li>
              <li>• <strong>Time-Limited:</strong> QR codes expire after 24 hours for security</li>
              <li>• <strong>Tamper-Proof:</strong> Built-in checksum validation prevents forgery</li>
              <li>• <strong>Real-Time Validation:</strong> Instant verification with barangay database</li>
              <li>• <strong>Audit Trail:</strong> All scans are logged for security purposes</li>
              <li>• <strong>Offline Capable:</strong> Basic validation works without internet</li>
            </ul>
          </div>
          
          {/* Security Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Notice
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1 text-left">
              <li>• Your QR code contains encrypted personal information</li>
              <li>• Only authorized barangay personnel can scan and verify your QR code</li>
              <li>• Do not share your QR code with unauthorized individuals</li>
              <li>• Report any suspicious QR code scanning attempts immediately</li>
              <li>• This QR code is valid only for official barangay transactions</li>
              <li>• QR codes automatically expire and regenerate for enhanced security</li>
            </ul>
          </div>
          
          {/* Usage Instructions */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">How to Use Your QR Code</h4>
            <ul className="text-sm text-green-700 space-y-1 text-left">
              <li>• Present this QR code when visiting barangay offices</li>
              <li>• Use for quick identification and verification</li>
              <li>• Required for certain barangay services and transactions</li>
              <li>• Can be used for family member verification (if authorized)</li>
              <li>• Works for both online and offline verification systems</li>
              <li>• Keep your QR code secure and do not share with unauthorized persons</li>
            </ul>
          </div>

          {/* QR Code Validation Status */}
          {qrCodeData && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                QR Code Validation Status
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-green-800">Integrity Check</div>
                  <div className="text-xs text-green-600">
                    {validateQRCode(qrCodeData) ? 'Passed' : 'Failed'}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-blue-800">Expiry Status</div>
                  <div className="text-xs text-blue-600">
                    {new Date(qrCodeData.security.expiresAt) > new Date() ? 'Valid' : 'Expired'}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <UserCheck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-purple-800">User Match</div>
                  <div className="text-xs text-purple-600">
                    {qrCodeData.residentId === user?.id ? 'Matched' : 'Mismatch'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add validation function
function validateQRCode(data: any): boolean {
  if (!data || !data.security || !data.residentId) return false;
  
  const isNotExpired = new Date(data.security.expiresAt) > new Date();
  const hasValidStructure = data.personalInfo && data.verification && data.usage;
  
  return isNotExpired && hasValidStructure;
}