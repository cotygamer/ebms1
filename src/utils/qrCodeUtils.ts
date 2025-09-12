// QR Code utilities for secure generation and validation

import { User } from '../types';

export interface QRCodeData {
  residentId: string;
  qrCodeId: string;
  uniqueSessionId: string;
  personalInfo: {
    name: string;
    email: string;
    verificationStatus: string;
  };
  security: {
    generatedAt: string;
    expiresAt: string;
    version: string;
    checksum: string;
  };
  verification: {
    isVerified: boolean;
    verificationLevel: string;
    lastUpdated: string;
  };
  usage: {
    scanCount: number;
    lastScanned: string | null;
    validScans: string[];
  };
}

/**
 * Generate secure QR code data for a user
 * @param user - The user object
 * @returns QRCodeData object with encrypted information
 */
export const generateQRCodeData = (user: User): QRCodeData => {
  const timestamp = new Date().toISOString();
  const uniqueId = `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    residentId: user.id,
    qrCodeId: user.qrCode || generateQRCodeId(),
    uniqueSessionId: uniqueId,
    
    personalInfo: {
      name: user.name,
      email: user.email,
      verificationStatus: user.verificationStatus || 'non-verified'
    },
    
    security: {
      generatedAt: timestamp,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      version: '2.1.0',
      checksum: generateChecksum(user.id, timestamp, user.qrCode || '')
    },
    
    verification: {
      isVerified: user.verificationStatus === 'verified',
      verificationLevel: user.verificationStatus || 'non-verified',
      lastUpdated: timestamp
    },
    
    usage: {
      scanCount: 0,
      lastScanned: null,
      validScans: []
    }
  };
};

/**
 * Generate a unique QR code ID
 * @returns Unique QR code identifier
 */
export const generateQRCodeId = (): string => {
  const prefix = 'QR';
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `${prefix}${timestamp.slice(-6)}${random}`;
};

/**
 * Generate checksum for QR code validation
 * @param userId - User ID
 * @param timestamp - Generation timestamp
 * @param qrCode - QR code ID
 * @returns Checksum string
 */
export const generateChecksum = (userId: string, timestamp: string, qrCode: string): string => {
  const data = `${userId}${timestamp}${qrCode}`;
  let hash = 0;
  
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
};

/**
 * Validate QR code data integrity
 * @param data - QR code data object
 * @param userId - Expected user ID
 * @returns Validation result
 */
export const validateQRCodeData = (data: QRCodeData, userId?: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check required fields
  if (!data || typeof data !== 'object') {
    errors.push('Invalid QR code data structure');
    return { isValid: false, errors };
  }
  
  if (!data.residentId) errors.push('Missing resident ID');
  if (!data.security) errors.push('Missing security data');
  if (!data.personalInfo) errors.push('Missing personal information');
  
  // Check expiration
  if (data.security?.expiresAt) {
    const expiryDate = new Date(data.security.expiresAt);
    if (expiryDate <= new Date()) {
      errors.push('QR code has expired');
    }
  }
  
  // Check user match if provided
  if (userId && data.residentId !== userId) {
    errors.push('QR code does not match expected user');
  }
  
  // Validate checksum
  if (data.security?.checksum && data.security?.generatedAt) {
    const expectedChecksum = generateChecksum(
      data.residentId, 
      data.security.generatedAt, 
      data.qrCodeId
    );
    if (data.security.checksum !== expectedChecksum) {
      errors.push('QR code integrity check failed');
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

/**
 * Record QR code scan event
 * @param qrData - QR code data
 * @param scanLocation - Where the scan occurred
 * @param scannedBy - Who scanned the code
 * @returns Updated QR code data
 */
export const recordQRCodeScan = (
  qrData: QRCodeData, 
  scanLocation: string, 
  scannedBy: string
): QRCodeData => {
  const scanEvent = {
    timestamp: new Date().toISOString(),
    location: scanLocation,
    scannedBy: scannedBy,
    sessionId: qrData.uniqueSessionId
  };
  
  return {
    ...qrData,
    usage: {
      scanCount: qrData.usage.scanCount + 1,
      lastScanned: scanEvent.timestamp,
      validScans: [...qrData.usage.validScans, JSON.stringify(scanEvent)]
    }
  };
};

/**
 * Check if QR code needs refresh
 * @param qrData - QR code data
 * @returns Boolean indicating if refresh is needed
 */
export const needsQRCodeRefresh = (qrData: QRCodeData): boolean => {
  if (!qrData.security?.expiresAt) return true;
  
  const expiryDate = new Date(qrData.security.expiresAt);
  const now = new Date();
  const hoursUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  // Refresh if less than 2 hours until expiry
  return hoursUntilExpiry < 2;
};

/**
 * Generate QR code display string for visual representation
 * @param qrData - QR code data
 * @returns String representation for QR code display
 */
export const generateQRCodeDisplayString = (qrData: QRCodeData): string => {
  return JSON.stringify({
    id: qrData.residentId,
    qr: qrData.qrCodeId,
    exp: qrData.security.expiresAt,
    chk: qrData.security.checksum
  });
};

/**
 * Parse QR code from scanned string
 * @param qrString - Scanned QR code string
 * @returns Parsed QR code data or null if invalid
 */
export const parseQRCodeString = (qrString: string): QRCodeData | null => {
  try {
    const parsed = JSON.parse(qrString);
    
    // Validate basic structure
    if (!parsed.id || !parsed.qr || !parsed.exp || !parsed.chk) {
      return null;
    }
    
    // Reconstruct full QR data structure
    return {
      residentId: parsed.id,
      qrCodeId: parsed.qr,
      uniqueSessionId: `scan-${Date.now()}`,
      personalInfo: {
        name: 'Scanned User',
        email: 'scanned@user.com',
        verificationStatus: 'verified'
      },
      security: {
        generatedAt: new Date().toISOString(),
        expiresAt: parsed.exp,
        version: '2.1.0',
        checksum: parsed.chk
      },
      verification: {
        isVerified: true,
        verificationLevel: 'verified',
        lastUpdated: new Date().toISOString()
      },
      usage: {
        scanCount: 0,
        lastScanned: null,
        validScans: []
      }
    };
  } catch (error) {
    console.error('Error parsing QR code:', error);
    return null;
  }
};