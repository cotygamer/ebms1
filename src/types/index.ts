// Core type definitions for the Barangay Management System

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super-admin' | 'barangay-official' | 'resident' | 'medical-portal' | 'accounting-portal' | 'disaster-portal' | 'business-owner' | 'security-personnel';
  status: 'active' | 'inactive' | 'suspended';
  verificationStatus?: 'non-verified' | 'semi-verified' | 'verified';
  qrCode?: string;
  familyTree?: FamilyMember[];
  personalInfo?: PersonalInfo;
  emergencyContacts?: EmergencyContact[];
  governmentIds?: GovernmentId[];
  dateCreated: string;
  lastLogin: string;
  permissions: string[];
}

export interface PersonalInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  birthDate: string;
  birthPlace: string;
  gender: 'male' | 'female';
  civilStatus: 'single' | 'married' | 'widowed' | 'separated' | 'divorced';
  nationality: string;
  religion?: string;
  bloodType?: string;
  occupation?: string;
  employer?: string;
  monthlyIncome?: number;
  educationLevel?: string;
  medicalConditions?: string;
  allergies?: string;
  medications?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  primaryPhone: string;
  alternatePhone?: string;
  address: string;
  isPrimary: boolean;
}

export interface GovernmentId {
  id: string;
  type: 'national-id' | 'drivers-license' | 'passport' | 'sss' | 'tin' | 'philhealth' | 'pagibig' | 'voters-id' | 'senior-citizen' | 'pwd';
  idNumber: string;
  issuedDate?: string;
  expiryDate?: string;
  issuingAuthority?: string;
  verified: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: 'male' | 'female';
  birthDate?: string;
  occupation?: string;
  educationLevel?: string;
}

export interface Resident {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  verificationStatus: 'non-verified' | 'semi-verified' | 'verified';
  qrCode?: string;
  dateRegistered: string;
  emergencyContact?: string;
  birthDate?: string;
  gender?: 'male' | 'female';
  civilStatus?: 'single' | 'married' | 'widowed' | 'separated' | 'divorced';
  createdAt?: string;
  updatedAt?: string;
}

export interface Document {
  id: string;
  residentId?: string;
  documentType: string;
  status: 'pending' | 'processing' | 'ready' | 'released' | 'rejected';
  requestedDate: string;
  processedDate?: string;
  releasedDate?: string;
  fee: number;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentMethod?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessPermit {
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

export interface SecurityIncident {
  id: string;
  type: string;
  description: string;
  location: string;
  dateTime: string;
  reporter: string;
  reporterContact: string;
  status: 'reported' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedOfficer?: string;
  evidence: string[];
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlotterEntry {
  id: string;
  caseNumber: string;
  complainant: {
    name: string;
    address: string;
    contact: string;
    age?: string;
    civilStatus?: string;
  };
  respondent: {
    name: string;
    address: string;
    contact: string;
    age?: string;
    civilStatus?: string;
  };
  incidentDetails: string;
  incidentDate: string;
  incidentTime?: string;
  location: string;
  status: 'active' | 'resolved' | 'dismissed' | 'referred';
  officerOnDuty: string;
  caseType: 'civil' | 'criminal' | 'administrative' | 'domestic' | 'noise' | 'property' | 'other';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  witnesses: Array<{ name: string; contact: string; }>;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'important' | 'event' | 'notice' | 'emergency' | 'health' | 'weather' | 'evacuation' | 'update';
  priority: 'low' | 'medium' | 'high';
  status: 'published' | 'draft';
  author: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'infrastructure' | 'health' | 'education' | 'environment' | 'social' | 'technology';
  status: 'planning' | 'ongoing' | 'completed' | 'on-hold';
  startDate: string;
  endDate?: string;
  budget: number;
  location: string;
  beneficiaries: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  type: 'revenue' | 'expense';
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
  referenceNumber?: string;
  transactionDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SystemSettings {
  googleMapsApiKey?: string;
  paymentGateway?: {
    provider: string;
    apiKey: string;
    secretKey: string;
    gcash: { enabled: boolean; merchantId: string; apiKey: string };
    maya: { enabled: boolean; publicKey: string; secretKey: string };
    dragonpay: { enabled: boolean; merchantId: string; password: string };
    cashOnPickup: { enabled: boolean };
  };
  barangayName: string;
  barangayAddress: string;
  contactNumber: string;
  emailAddress?: string;
  website?: string;
  facebookPage?: string;
  operatingHours?: string;
  timezone?: string;
  language?: string;
  currency?: string;
  dateFormat?: string;
  timeFormat?: string;
  maxFileSize?: string;
  allowedFileTypes?: string;
  sessionTimeout?: string;
  passwordPolicy?: string;
  twoFactorAuth?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  pushNotifications?: boolean;
  maintenanceMode?: boolean;
  debugMode?: boolean;
  backupFrequency?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export interface FOIRequest {
  id: string;
  requesterName: string;
  requesterEmail: string;
  requesterContact: string;
  requestType: 'document' | 'information' | 'data' | 'record';
  subject: string;
  description: string;
  purpose: string;
  status: 'submitted' | 'under-review' | 'approved' | 'denied' | 'fulfilled';
  submissionDate: string;
  responseDate?: string;
  responseDetails?: string;
  attachments?: string[];
  trackingNumber: string;
}

export interface CitizenCharter {
  id: string;
  serviceName: string;
  description: string;
  requirements: string[];
  processingTime: string;
  fee: number;
  responsibleOffice: string;
  steps: Array<{
    stepNumber: number;
    description: string;
    timeframe: string;
    responsiblePerson: string;
  }>;
  lastUpdated: string;
}