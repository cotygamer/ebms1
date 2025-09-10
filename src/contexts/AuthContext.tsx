import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super-admin' | 'barangay-official' | 'resident' | 'medical-portal' | 'accounting-portal' | 'disaster-portal';
  verificationStatus?: 'non-verified' | 'semi-verified' | 'verified';
  qrCode?: string;
  familyTree?: any[];
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
        familyTree: [
          { id: 1, name: 'Juan Dela Cruz', relation: 'self', age: 35, gender: 'male' },
          { id: 2, name: 'Maria Dela Cruz', relation: 'spouse', age: 32, gender: 'female' },
          { id: 3, name: 'Pedro Dela Cruz', relation: 'son', age: 10, gender: 'male' },
          { id: 4, name: 'Ana Dela Cruz', relation: 'daughter', age: 8, gender: 'female' }
        ]
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