import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super-admin' | 'barangay-official' | 'resident' | 'medical-portal' | 'accounting-portal' | 'disaster-portal';
  verificationStatus?: 'non-verified' | 'details-updated' | 'semi-verified' | 'verified';
  qrCode?: string;
  familyTree?: any[];
  // Enhanced profile data structure
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  civilStatus?: string;
  nationality?: string;
  occupation?: string;
  monthlyIncome?: string;
  houseNumber?: string;
  purok?: string;
  barangay?: string;
  city?: string;
  province?: string;
  zipCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  emergencyContactAddress?: string;
  houseLocation?: { lat: number; lng: number; address: string };
  governmentIds?: {
    sss?: { number: string; verified: boolean; uploadDate?: string };
    philhealth?: { number: string; verified: boolean; uploadDate?: string };
    pagibig?: { number: string; verified: boolean; uploadDate?: string };
    umid?: { number: string; verified: boolean; uploadDate?: string };
    driversLicense?: { number: string; verified: boolean; uploadDate?: string };
    passport?: { number: string; verified: boolean; uploadDate?: string };
  };
  auditTrail?: {
    timestamp: string;
    action: string;
    previousStatus?: string;
    newStatus?: string;
    approvedBy?: string;
  }[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulated authentication - in real app, this would call an API
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'superadmin@barangay.gov',
        name: 'Super Administrator',
        role: 'super-admin'
      },
      {
        id: '3',
        email: 'official@barangay.gov',
        name: 'Barangay Official',
        role: 'barangay-official'
      },
      {
        id: '4',
        email: 'medical@barangay.gov',
        name: 'Dr. Maria Santos',
        role: 'medical-portal'
      },
      {
        id: '5',
        email: 'accounting@barangay.gov',
        name: 'Ana Cruz',
        role: 'accounting-portal'
      },
      {
        id: '6',
        email: 'disaster@barangay.gov',
        name: 'Pedro Martinez',
        role: 'disaster-portal'
      },
      {
        id: '2',
        email: 'resident@email.com',
        name: 'Juan Dela Cruz',
        role: 'resident',
        verificationStatus: 'verified',
        qrCode: 'QR123456789',
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        phone: '+63 912 345 6789',
        birthDate: '1989-05-15',
        gender: 'male',
        civilStatus: 'married',
        nationality: 'Filipino',
        occupation: 'Teacher',
        houseNumber: '123 Main Street',
        barangay: 'San Miguel',
        city: 'Metro Manila',
        province: 'Metro Manila',
        dateRegistered: '2024-01-15',
        houseLocation: { lat: 14.5995, lng: 120.9842, address: '123 Main Street, San Miguel, Metro Manila' },
        familyTree: [
          { id: 1, name: 'Juan Dela Cruz', relation: 'self', age: 35, gender: 'male' },
          { id: 2, name: 'Maria Dela Cruz', relation: 'spouse', age: 32, gender: 'female' },
          { id: 3, name: 'Pedro Dela Cruz', relation: 'son', age: 10, gender: 'male' },
          { id: 4, name: 'Ana Dela Cruz', relation: 'daughter', age: 8, gender: 'female' }
        ],
        auditTrail: [
          {
            timestamp: '2024-01-15T10:00:00Z',
            action: 'Account Created',
            newStatus: 'non-verified',
            approvedBy: 'System'
          },
          {
            timestamp: '2024-01-16T14:30:00Z',
            action: 'Profile Completed',
            previousStatus: 'non-verified',
            newStatus: 'details-updated',
            approvedBy: 'Self (Resident)'
          },
          {
            timestamp: '2024-01-17T09:15:00Z',
            action: 'Documents Submitted',
            previousStatus: 'details-updated',
            newStatus: 'semi-verified',
            approvedBy: 'Self (Resident)'
          },
          {
            timestamp: '2024-01-20T11:45:00Z',
            action: 'Physical Verification Completed',
            previousStatus: 'semi-verified',
            newStatus: 'verified',
            approvedBy: 'Barangay Official - Maria Santos'
          }
        ]
      },
      // Additional test residents with same password
      {
        id: '7',
        email: 'test@resident.com',
        name: 'Test Resident',
        role: 'resident',
        verificationStatus: 'non-verified'
      },
      {
        id: '8', 
        email: 'maria@resident.com',
        name: 'Maria Santos',
        role: 'resident',
        verificationStatus: 'semi-verified'
      }
    ];

    const foundUser = mockUsers.find(u => u.email === email && password === 'password123');
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    try {
      // Clear all authentication-related data
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('sessionId');
      
      // Clear any session storage
      sessionStorage.clear();
      
      // Reset user state
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      // Force clear user state even if localStorage operations fail
      setUser(null);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}