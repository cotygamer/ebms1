import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface Document {
  id: string;
  residentId?: string;
  residentName: string;
  residentEmail?: string;
  residentPhone?: string;
  documentType: string;
  status: 'pending' | 'processing' | 'ready' | 'released' | 'rejected';
  requestedDate: string;
  processedDate?: string;
  releasedDate?: string;
  fee: number;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
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
  updateResident: (id: string, updates: Partial<Resident>) => void;
  updateSystemSettings: (updates: Partial<SystemSettings>) => void;
  verifyResident: (id: string, status: 'semi-verified' | 'verified') => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
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
  // Initialize settings from localStorage
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

  const [residents, setResidents] = useState<Resident[]>([
    {
      id: '1',
      name: 'Juan Dela Cruz',
      email: 'juan@email.com',
      verificationStatus: 'verified',
      qrCode: 'QR123456789',
      familyTree: [
        { id: 1, name: 'Juan Dela Cruz', relation: 'self', age: 35, gender: 'male' },
        { id: 2, name: 'Maria Dela Cruz', relation: 'spouse', age: 32, gender: 'female' },
        { id: 3, name: 'Pedro Dela Cruz', relation: 'son', age: 10, gender: 'male' },
        { id: 4, name: 'Ana Dela Cruz', relation: 'daughter', age: 8, gender: 'female' }
      ],
      address: '123 Main St, Barangay Center',
      phoneNumber: '+63 912 345 6789',
      dateRegistered: '2024-01-15',
      documents: ['Birth Certificate', 'Valid ID', 'Proof of Address']
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      verificationStatus: 'semi-verified',
      familyTree: [
        { id: 1, name: 'Maria Santos', relation: 'self', age: 28, gender: 'female' }
      ],
      address: '456 Oak Ave, Barangay North',
      phoneNumber: '+63 917 654 3210',
      dateRegistered: '2024-02-20',
      documents: ['Valid ID']
    }
  ]);

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      residentId: '1',
      residentName: 'Juan Dela Cruz',
      residentEmail: 'juan@email.com',
      residentPhone: '+63 912 345 6789',
      documentType: 'Barangay Clearance',
      status: 'ready',
      requestedDate: '2024-03-10',
      processedDate: '2024-03-12',
      fee: 50,
      paymentStatus: 'paid',
      paymentMethod: 'GCash',
      notes: 'For employment purposes',
      createdAt: '2024-03-10T08:00:00Z',
      updatedAt: '2024-03-12T14:30:00Z'
    },
    {
      id: '2',
      residentName: 'Maria Santos',
      residentEmail: 'maria@email.com',
      residentPhone: '+63 917 654 3210',
      documentType: 'Certificate of Residency',
      status: 'processing',
      requestedDate: '2024-03-15',
      fee: 30,
      paymentStatus: 'unpaid',
      notes: 'For school enrollment',
      createdAt: '2024-03-15T10:15:00Z',
      updatedAt: '2024-03-15T10:15:00Z'
    },
    {
      id: '3',
      residentName: 'Pedro Martinez',
      residentEmail: 'pedro@email.com',
      documentType: 'Business Permit',
      status: 'pending',
      requestedDate: '2024-03-18',
      fee: 200,
      paymentStatus: 'unpaid',
      notes: 'Small sari-sari store',
      createdAt: '2024-03-18T09:30:00Z',
      updatedAt: '2024-03-18T09:30:00Z'
    }
  ]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Community Health Drive - Free Medical Checkup',
      content: 'Free medical checkup and vaccination for all residents. Bring your barangay ID and health records. Schedule: March 25-27, 2024 at the Barangay Health Center.',
      type: 'health',
      priority: 'high',
      status: 'published',
      author: 'Dr. Maria Santos',
      expiresAt: '2024-03-30T23:59:59Z',
      createdAt: '2024-03-20T08:00:00Z',
      updatedAt: '2024-03-20T08:00:00Z'
    },
    {
      id: '2',
      title: 'Road Maintenance Schedule',
      content: 'Main Street will undergo maintenance from March 25-27. Please use alternative routes during construction hours (8 AM - 5 PM).',
      type: 'notice',
      priority: 'medium',
      status: 'published',
      author: 'Public Works Department',
      expiresAt: '2024-03-28T23:59:59Z',
      createdAt: '2024-03-18T14:00:00Z',
      updatedAt: '2024-03-18T14:00:00Z'
    },
    {
      id: '3',
      title: 'Barangay Assembly Meeting',
      content: 'Monthly barangay assembly meeting on March 30, 2024 at 7:00 PM at the Barangay Hall. All residents are invited to participate.',
      type: 'event',
      priority: 'medium',
      status: 'published',
      author: 'Barangay Council',
      createdAt: '2024-03-15T16:00:00Z',
      updatedAt: '2024-03-15T16:00:00Z'
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'revenue',
      description: 'Barangay Clearance Fees',
      amount: 1500,
      category: 'Document Fees',
      paymentMethod: 'GCash',
      referenceNumber: 'GC20240315001',
      transactionDate: '2024-03-15',
      createdAt: '2024-03-15T10:00:00Z',
      updatedAt: '2024-03-15T10:00:00Z'
    },
    {
      id: '2',
      type: 'expense',
      description: 'Office Supplies Purchase',
      amount: 2500,
      category: 'Office Supplies',
      paymentMethod: 'Cash',
      transactionDate: '2024-03-14',
      createdAt: '2024-03-14T14:30:00Z',
      updatedAt: '2024-03-14T14:30:00Z'
    },
    {
      id: '3',
      type: 'revenue',
      description: 'Business Permit Fees',
      amount: 800,
      category: 'Permit Fees',
      paymentMethod: 'Maya',
      referenceNumber: 'MY20240313001',
      transactionDate: '2024-03-13',
      createdAt: '2024-03-13T11:15:00Z',
      updatedAt: '2024-03-13T11:15:00Z'
    },
    {
      id: '4',
      type: 'expense',
      description: 'Utility Bills Payment',
      amount: 3200,
      category: 'Utilities',
      paymentMethod: 'Bank Transfer',
      transactionDate: '2024-03-12',
      createdAt: '2024-03-12T16:45:00Z',
      updatedAt: '2024-03-12T16:45:00Z'
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Super Administrator',
      email: 'superadmin@barangay.gov',
      role: 'super-admin',
      status: 'active',
      dateCreated: '2024-01-01',
      lastLogin: '2024-03-15 10:30 AM',
      permissions: ['all']
    },
    {
      id: '2',
      name: 'Barangay Captain',
      email: 'captain@barangay.gov',
      role: 'barangay-official',
      status: 'active',
      dateCreated: '2024-01-02',
      lastLogin: '2024-03-15 09:15 AM',
      permissions: ['residents', 'documents', 'reports', 'medical', 'accounting', 'disaster']
    },
    {
      id: '3',
      name: 'Dr. Maria Santos',
      email: 'medical@barangay.gov',
      role: 'medical-portal',
      status: 'active',
      dateCreated: '2024-01-03',
      lastLogin: '2024-03-15 08:45 AM',
      permissions: ['health', 'medical-records', 'appointments']
    },
    {
      id: '4',
      name: 'Ana Cruz',
      email: 'accounting@barangay.gov',
      role: 'accounting-portal',
      status: 'active',
      dateCreated: '2024-01-04',
      lastLogin: '2024-03-15 08:30 AM',
      permissions: ['accounting', 'financial-reports', 'payments']
    },
    {
      id: '5',
      name: 'Pedro Martinez',
      email: 'disaster@barangay.gov',
      role: 'disaster-portal',
      status: 'active',
      dateCreated: '2024-01-05',
      lastLogin: '2024-03-15 08:15 AM',
      permissions: ['disaster-management', 'emergency-alerts', 'evacuation']
    }
  ]);

  const updateResident = (id: string, updates: Partial<Resident>) => {
    setResidents(prev => prev.map(resident => 
      resident.id === id ? { ...resident, ...updates } : resident
    ));
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

  const verifyResident = (id: string, status: 'semi-verified' | 'verified') => {
    setResidents(prev => prev.map(resident => {
      if (resident.id === id) {
        const qrCode = status === 'verified' ? `QR${Date.now()}${Math.random().toString(36).substr(2, 9)}` : undefined;
        return { ...resident, verificationStatus: status, qrCode };
      }
      return resident;
    }));
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      dateCreated: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  // Document Management Functions
  const addDocument = (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDocument = {
      ...documentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDocuments(prev => [newDocument, ...prev]);
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, ...updates, updatedAt: new Date().toISOString() } : doc
    ));
  };

  // Announcement Management Functions
  const addAnnouncement = (announcementData: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAnnouncement = {
      ...announcementData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(announcement => 
      announcement.id === id ? { ...announcement, ...updates, updatedAt: new Date().toISOString() } : announcement
    ));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
  };

  // Transaction Management Functions
  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction = {
      ...transactionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(transaction => 
      transaction.id === id ? { ...transaction, ...updates, updatedAt: new Date().toISOString() } : transaction
    ));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };
  return (
    <DataContext.Provider value={{
      residents,
      systemSettings,
      users,
      documents,
      announcements,
      transactions,
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
      deleteAnnouncement,
      addTransaction,
      updateTransaction,
      deleteTransaction
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