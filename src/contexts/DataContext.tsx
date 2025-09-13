import React, { createContext, useContext, useState, ReactNode } from 'react';
import { dataService } from '../services/dataService';
import { useUsers, useResidents, useDocuments, useIncidents, useAnnouncements, useTransactions } from '../hooks/useRealTimeData';

interface Resident {
  id: string;
  name: string;
  email: string;
  verificationStatus: 'non-verified' | 'details-updated' | 'semi-verified' | 'verified';
  qrCode?: string;
  familyTree: any[];
  address: string;
  phoneNumber: string;
  dateRegistered: string;
  documents: string[];
  profileData?: {
    phone?: string;
    address?: string;
    birthDate?: string;
    gender?: string;
    civilStatus?: string;
    occupation?: string;
    emergencyContact?: string;
    houseLocation?: { lat: number; lng: number; address: string };
  };
  auditTrail?: {
    timestamp: string;
    action: string;
    previousStatus?: string;
    newStatus?: string;
    approvedBy?: string;
  }[];
}

interface SystemSettings {
  googleMapsApiKey: string;
  paymentGateway: {
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

interface DataContextType {
  residents: Resident[];
  systemSettings: SystemSettings;
  users: User[];
  documents: Document[];
  announcements: Announcement[];
  transactions: Transaction[];
  complaints: Complaint[];
  updateResident: (id: string, updates: Partial<Resident>) => void;
  updateSystemSettings: (updates: Partial<SystemSettings>) => void;
  verifyResident: (id: string, status: 'semi-verified' | 'verified') => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addDocument: (document: Omit<Document, 'id'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addComplaint: (complaint: Omit<Complaint, 'id'>) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
}

interface Document {
  id: string;
  residentId: string;
  documentType: string;
  status: 'pending' | 'processing' | 'ready' | 'released' | 'rejected';
  requestedDate: string;
  processedDate?: string;
  releasedDate?: string;
  fee: number;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentMethod?: string;
  notes?: string;
  purpose?: string;
}

interface Announcement {
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

interface Transaction {
  id: string;
  type: 'revenue' | 'expense';
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
  referenceNumber?: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Complaint {
  id: string;
  residentName: string;
  residentEmail: string;
  type: string;
  subject: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high';
  dateSubmitted: string;
  assignedTo?: string;
  resolution?: string;
  location?: string;
  dateOccurred?: string;
  timeOccurred?: string;
  witnessName?: string;
  witnessContact?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'barangay-official' | 'resident' | 'medical-portal' | 'accounting-portal' | 'disaster-portal';
  status: 'active' | 'inactive' | 'suspended';
  dateCreated: string;
  lastLogin: string;
  permissions: string[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // Use real-time data hooks
  const { data: users, refresh: refreshUsers } = useUsers();
  const { data: residents, refresh: refreshResidents } = useResidents();
  const { data: documents, refresh: refreshDocuments } = useDocuments();
  const { data: incidents, refresh: refreshIncidents } = useIncidents();
  const { data: announcements, refresh: refreshAnnouncements } = useAnnouncements();
  const { data: transactions, refresh: refreshTransactions } = useTransactions();

  // Initialize settings from localStorage with Supabase sync
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
    return {
      googleMapsApiKey: '',
      paymentGateway: {
        provider: 'PayPal',
        apiKey: '',
        secretKey: '',
        gcash: { enabled: true, merchantId: '', apiKey: '' },
        maya: { enabled: true, publicKey: '', secretKey: '' },
        dragonpay: { enabled: false, merchantId: '', password: '' },
        cashOnPickup: { enabled: true }
      },
      barangayName: 'Barangay San Miguel',
      barangayAddress: 'San Miguel, Metro Manila, Philippines',
      contactNumber: '+63 2 8123 4567'
    };
  });

  // Updated functions to use centralized data service
  const updateResident = async (id: string, updates: Partial<Resident>) => {
    try {
      await dataService.updateResident(id, updates);
      refreshResidents();
    } catch (error) {
      console.error('Failed to update resident:', error);
      throw error;
    }
  };

  const updateSystemSettings = (updates: Partial<SystemSettings>) => {
    return new Promise((resolve, reject) => {
      try {
        const newSettings = { ...systemSettings, ...updates };
        setSystemSettings(newSettings);
        localStorage.setItem('systemSettings', JSON.stringify(newSettings));
        
        // Trigger a custom event to notify other components about the update
        window.dispatchEvent(new CustomEvent('barangaySettingsUpdated', { 
          detail: newSettings 
        }));
        
        setTimeout(() => {
          resolve(true);
        }, 500); // Reduced delay for better UX
      } catch (error) {
        console.error('Error updating settings:', error);
        reject(error);
      }
    });
  };

  const verifyResident = async (id: string, status: 'semi-verified' | 'verified') => {
    try {
      await dataService.verifyResident(id, status);
      refreshResidents();
    } catch (error) {
      console.error('Failed to verify resident:', error);
      throw error;
    }
  };

  const addUser = async (userData: Omit<User, 'id'>) => {
    try {
      await dataService.createUser({
        ...userData,
        permissions: getDefaultPermissions(userData.role),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      refreshUsers();
    } catch (error) {
      console.error('Failed to add user:', error);
      throw error;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      await dataService.updateUser(id, updates);
      refreshUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await dataService.deleteUser(id);
      refreshUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  };

  const addDocument = async (documentData: Omit<Document, 'id'>) => {
    try {
      await dataService.createDocument(documentData);
      refreshDocuments();
    } catch (error) {
      console.error('Failed to add document:', error);
      throw error;
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      await dataService.updateDocument(id, updates);
      refreshDocuments();
    } catch (error) {
      console.error('Failed to update document:', error);
      throw error;
    }
  };

  const addAnnouncement = async (announcementData: Omit<Announcement, 'id'>) => {
    try {
      await dataService.createAnnouncement({
        ...announcementData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      refreshAnnouncements();
    } catch (error) {
      console.error('Failed to add announcement:', error);
      throw error;
    }
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    try {
      await dataService.updateAnnouncement(id, {
        ...updates,
        updated_at: new Date().toISOString()
      });
      refreshAnnouncements();
    } catch (error) {
      console.error('Failed to update announcement:', error);
      throw error;
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      await dataService.createTransaction({
        ...transactionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      refreshTransactions();
    } catch (error) {
      console.error('Failed to add transaction:', error);
      throw error;
    }
  };

  const addComplaint = async (complaintData: Omit<Complaint, 'id'>) => {
    try {
      await dataService.createIncident({
        reporter_name: complaintData.residentName,
        reporter_email: complaintData.residentEmail,
        incident_type: complaintData.type,
        subject: complaintData.subject,
        description: complaintData.description,
        status: complaintData.status,
        priority: complaintData.priority,
        location: complaintData.location,
        date_occurred: complaintData.dateOccurred,
        time_occurred: complaintData.timeOccurred,
        witness_name: complaintData.witnessName,
        witness_contact: complaintData.witnessContact,
        assigned_to: complaintData.assignedTo,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      refreshIncidents();
    } catch (error) {
      console.error('Failed to add complaint:', error);
      throw error;
    }
  };

  const updateComplaint = async (id: string, updates: Partial<Complaint>) => {
    try {
      await dataService.updateIncident(id, {
        status: updates.status,
        assigned_to: updates.assignedTo,
        resolution: updates.resolution,
        updated_at: new Date().toISOString()
      });
      refreshIncidents();
    } catch (error) {
      console.error('Failed to update complaint:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{
      residents,
      systemSettings,
      users,
      documents,
      announcements,
      transactions,
      complaints: incidents, // Map incidents to complaints for backward compatibility
      updateResident,
      updateSystemSettings,
      verifyResident,
      addUser,
      updateUser,
      deleteUser,
      addDocument,
      updateDocument,
      addAnnouncement,
      updateAnnouncement,
      addTransaction,
      addComplaint,
      updateComplaint
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

function getDefaultPermissions(role: string): string[] {
  switch (role) {
    case 'super-admin':
      return ['all'];
    case 'barangay-official':
      return ['residents', 'documents', 'reports', 'announcements'];
    case 'medical-portal':
      return ['health', 'medical-records', 'appointments'];
    case 'accounting-portal':
      return ['accounting', 'financial-reports', 'payments'];
    case 'disaster-portal':
      return ['disaster-management', 'emergency-alerts', 'evacuation'];
    default:
      return ['basic'];
  }
}