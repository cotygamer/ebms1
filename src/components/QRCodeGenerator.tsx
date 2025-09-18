import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { QrCode, Download, Share2 } from 'lucide-react';

export default function QRCodeGenerator() {
  const { user } = useAuth();
  const [showQR, setShowQR] = useState(false);

  const generateQRData = () => {
    return JSON.stringify({
      id: user?.id,
      name: user?.name,
      verificationStatus: user?.verificationStatus,
      qrCode: user?.qrCode,
      timestamp: new Date().toISOString()
    });
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
      
      <div className="bg-white border rounded-lg p-6">
        <div className="text-center space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <QrCode className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">QR Code Available</h3>
            <p className="text-green-700 mb-4">
              Your unique QR code for barangay services and identification.
            </p>
            
            <div className="bg-white rounded-lg p-6 mb-4 border-2 border-dashed border-gray-300">
              {showQR ? (
                <div className="space-y-4">
                  {/* QR Code Placeholder */}
                  <div className="w-48 h-48 mx-auto bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="h-24 w-24 text-gray-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">QR Code: {user.qrCode}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Status:</strong> Verified</p>
                    <p><strong>Code:</strong> {user.qrCode}</p>
                  </div>
                </div>
              ) : (
                <div className="py-12">
                  <QrCode className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Click below to display your QR code</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowQR(!showQR)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                {showQR ? 'Hide QR Code' : 'Show QR Code'}
              </button>
              
              {showQR && (
                <>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                  <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">How to Use Your QR Code</h4>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• Present this QR code when visiting barangay offices</li>
              <li>• Use for quick identification and verification</li>
              <li>• Required for certain barangay services and transactions</li>
              <li>• Keep your QR code secure and do not share with unauthorized persons</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}