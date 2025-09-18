import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Resident {
  id: string;
  name: string;
  email: string;
  verificationStatus: 'non-verified' | 'semi-verified' | 'verified';
  qrCode?: string;
  familyTree: any[];
  address: string;
  phoneNumber: string;
  dateRegistered: string;
  documents: string[];
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
  updateResident: (id: string, updates: Partial<Resident>) => void;
  updateSystemSettings: (updates: Partial<SystemSettings>) => void;
  verifyResident: (id: string, status: 'semi-verified' | 'verified') => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
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

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    googleMapsApiKey: 'AIzaSyBk1234567890abcdefghijklmnop',
    paymentGateway: {
      provider: 'PayPal',
      apiKey: 'pk_test_1234567890',
      secretKey: 'sk_test_0987654321',
      gcash: { enabled: true, merchantId: '', apiKey: '' },
      maya: { enabled: true, publicKey: '', secretKey: '' },
      dragonpay: { enabled: false, merchantId: '', password: '' },
      cashOnPickup: { enabled: true }
    },
    barangayName: 'Barangay San Miguel',
    barangayAddress: 'San Miguel, Metro Manila, Philippines',
    contactNumber: '+63 2 8123 4567'
  });

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
    return new Promise((resolve) => {
      setTimeout(() => {
        setSystemSettings(prev => ({ ...prev, ...updates }));
        localStorage.setItem('systemSettings', JSON.stringify({ ...systemSettings, ...updates }));
        
        // Trigger a custom event to notify other components about the update
        window.dispatchEvent(new CustomEvent('barangaySettingsUpdated', { 
          detail: { ...systemSettings, ...updates } 
        }));
        
        resolve(true);
      }, 1000); // Simulate API call delay
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

  return (
    <DataContext.Provider value={{
      residents,
      systemSettings,
      users,
      updateResident,
      updateSystemSettings,
      verifyResident,
      addUser,
      updateUser,
      deleteUser
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