// Validation utilities for the Barangay Management System

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Philippine phone number validation
  const phoneRegex = /^(\+63|0)?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
};

export const validatePassword = (password: string, policy: string = 'strong'): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  switch (policy) {
    case 'basic':
      if (password.length < 6) errors.push('Password must be at least 6 characters long');
      break;
    case 'medium':
      if (password.length < 8) errors.push('Password must be at least 8 characters long');
      if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letters');
      if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letters');
      break;
    case 'strong':
      if (password.length < 8) errors.push('Password must be at least 8 characters long');
      if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letters');
      if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letters');
      if (!/[0-9]/.test(password)) errors.push('Password must contain numbers');
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Password must contain special characters');
      break;
  }
  
  return { isValid: errors.length === 0, errors };
};

export const validateGovernmentId = (type: string, idNumber: string): boolean => {
  switch (type) {
    case 'national-id':
      // PhilID format: 1234-5678-9012-3456
      return /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(idNumber);
    case 'drivers-license':
      // Format: A12-34-567890
      return /^[A-Z]\d{2}-\d{2}-\d{6}$/.test(idNumber);
    case 'passport':
      // Format: P123456A or EB1234567
      return /^[A-Z]{1,2}\d{6,7}[A-Z]?$/.test(idNumber);
    case 'sss':
      // Format: 12-3456789-0
      return /^\d{2}-\d{7}-\d{1}$/.test(idNumber);
    case 'tin':
      // Format: 123-456-789-000
      return /^\d{3}-\d{3}-\d{3}-\d{3}$/.test(idNumber);
    case 'philhealth':
      // Format: 12-345678901-2
      return /^\d{2}-\d{9}-\d{1}$/.test(idNumber);
    case 'pagibig':
      // Format: 1234-5678-9012
      return /^\d{4}-\d{4}-\d{4}$/.test(idNumber);
    case 'voters-id':
      // Format varies by region
      return /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(idNumber);
    default:
      return idNumber.length >= 5; // Basic validation for other IDs
  }
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateFileUpload = (file: File, allowedTypes: string[], maxSizeMB: number): { isValid: boolean; error?: string } => {
  // Check file type
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !allowedTypes.includes(fileExtension)) {
    return { isValid: false, error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` };
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }
  
  return { isValid: true };
};

export const generateTrackingNumber = (prefix: string = 'TRK'): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `${prefix}-${timestamp.slice(-6)}-${random}`;
};

export const formatCurrency = (amount: number, currency: string = 'PHP'): string => {
  const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: currency === 'PHP' ? 'PHP' : 'USD',
    minimumFractionDigits: 2
  });
  return formatter.format(amount);
};

export const formatDate = (date: string | Date, format: string = 'MM/DD/YYYY'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'MM/DD/YYYY':
      return dateObj.toLocaleDateString('en-US');
    case 'DD/MM/YYYY':
      return dateObj.toLocaleDateString('en-GB');
    case 'YYYY-MM-DD':
      return dateObj.toISOString().split('T')[0];
    default:
      return dateObj.toLocaleDateString();
  }
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const validateBusinessPermit = (permit: Partial<BusinessPermit>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!permit.businessName?.trim()) errors.push('Business name is required');
  if (!permit.ownerName?.trim()) errors.push('Owner name is required');
  if (!permit.ownerEmail || !validateEmail(permit.ownerEmail)) errors.push('Valid email is required');
  if (!permit.businessType) errors.push('Business type is required');
  if (!permit.address?.trim()) errors.push('Business address is required');
  if (!permit.contactNumber || !validatePhoneNumber(permit.contactNumber)) errors.push('Valid contact number is required');
  if (!permit.description?.trim()) errors.push('Business description is required');
  
  return { isValid: errors.length === 0, errors };
};

export const validateIncidentReport = (incident: Partial<SecurityIncident>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!incident.type?.trim()) errors.push('Incident type is required');
  if (!incident.description?.trim()) errors.push('Incident description is required');
  if (!incident.location?.trim()) errors.push('Incident location is required');
  if (!incident.dateTime) errors.push('Date and time are required');
  if (!incident.reporter?.trim()) errors.push('Reporter name is required');
  if (!incident.reporterContact || !validatePhoneNumber(incident.reporterContact)) errors.push('Valid reporter contact is required');
  
  return { isValid: errors.length === 0, errors };
};

export const validateBlotterEntry = (blotter: Partial<BlotterEntry>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!blotter.complainant?.name?.trim()) errors.push('Complainant name is required');
  if (!blotter.complainant?.address?.trim()) errors.push('Complainant address is required');
  if (!blotter.complainant?.contact || !validatePhoneNumber(blotter.complainant.contact)) errors.push('Valid complainant contact is required');
  
  if (!blotter.respondent?.name?.trim()) errors.push('Respondent name is required');
  if (!blotter.respondent?.address?.trim()) errors.push('Respondent address is required');
  
  if (!blotter.incidentDetails?.trim()) errors.push('Incident details are required');
  if (!blotter.incidentDate) errors.push('Incident date is required');
  if (!blotter.location?.trim()) errors.push('Incident location is required');
  if (!blotter.officerOnDuty?.trim()) errors.push('Officer on duty is required');
  
  return { isValid: errors.length === 0, errors };
};

// Import missing types
interface BusinessPermit {
  id: string;
  businessName: string;
  ownerName: string;
  ownerEmail: string;
  businessType: string;
  permitType: 'new' | 'renewal' | 'amendment';
  status: 'pending' | 'under-review' | 'approved' | 'rejected';
  applicationDate: string;
  approvalDate?: string;
  expiryDate?: string;
  fee: number;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  documents: string[];
  address: string;
  contactNumber: string;
  description: string;
  expectedEmployees?: number;
  operatingHours?: string;
  businessArea?: number;
}