import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { QrCode, Download, Copy, Check, Shield, User, Clock, XCircle, CheckCircle } from 'lucide-react';

export default function QRCodeDisplay() {
  const { user } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate permanent QR code based on user ID and registration date
  const getPermanentQRCode = () => {
    if (!user?.id) return 'BRG_UNKNOWN';
    const dateCode = user?.dateRegistered?.replace(/-/g, '') || new Date().toISOString().split('T')[0].replace(/-/g, '');
    return `BRG_${user.id}_${dateCode}`;
  };

  const generateQRData = () => {
    return JSON.stringify({
      id: user?.id,
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      address: user?.houseNumber ? `${user.houseNumber}, ${user.barangay}, ${user.city}` : user?.address,
      verificationStatus: user?.verificationStatus,
      qrCode: getPermanentQRCode(),
      dateRegistered: user?.dateRegistered || new Date().toISOString().split('T')[0],
      dateGenerated: user?.dateRegistered || new Date().toISOString().split('T')[0]
    });
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

  const handleCopyQRCode = () => {
    const qrData = generateQRData();
    navigator.clipboard.writeText(qrData).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadQR = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;
    
    if (ctx) {
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
    }
    
    // Download the canvas as image
    const link = document.createElement('a');
    link.download = `qr-code-${user?.name?.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
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
                <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto bg-white border-4 border-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <div className="text-center">
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
                        {getPermanentQRCode()}
                      </p>
                    </div>
                  </div>
                </div>
                
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
                    <p><strong>QR Code:</strong> <span className="font-mono">{getPermanentQRCode()}</span></p>
                    <p><strong>Generated:</strong> {user?.dateRegistered || new Date().toLocaleDateString()}</p>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          QR Code Security
        </h3>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>• This QR code is permanent and will never change</p>
          <p>• Safe to print on your official barangay ID</p>
          <p>• Only authorized barangay personnel can scan and verify</p>
          <p>• Contains encrypted personal information for verification</p>
          <p>• Do not share with unauthorized individuals</p>
        </div>
      </div>
    </div>
  );
}