import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { dataService } from '../services/dataService';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super-admin' | 'barangay-official' | 'resident' | 'medical-portal' | 'accounting-portal' | 'disaster-portal' | 'peace-order-portal';
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
    try {
      console.log('Attempting login with email:', email);
      
      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }

      if (!authData.user) {
        throw new Error('Authentication failed. Please try again.');
      }

      console.log('Auth successful, loading user profile...');
      
      // Determine if this is a resident or staff login based on email domain
      const isResidentLogin = !email.includes('@barangay.gov');
      
      let userProfile = null;
      
      if (isResidentLogin) {
        // For residents, check residents table
        try {
          const { data: residentData, error: residentError } = await supabase
            .from('residents')
            .select('*')
            .or(`email.eq.${email},user_id.eq.${authData.user.id}`)
            .limit(1);
            
          if (!residentError && residentData && residentData.length > 0) {
            const resident = residentData[0];
            userProfile = {
              id: resident.id,
              email: resident.email,
              name: resident.name,
              role: 'resident',
              verificationStatus: resident.verification_status || 'non-verified',
              qrCode: resident.qr_code,
              phone: resident.phone_number,
              address: resident.address,
              birthDate: resident.birth_date,
              gender: resident.gender,
              civilStatus: resident.civil_status,
              nationality: resident.nationality,
              religion: resident.religion,
              occupation: resident.occupation,
              monthlyIncome: resident.monthly_income,
              emergencyContact: resident.emergency_contact,
              dateRegistered: resident.date_registered,
              houseLocation: resident.house_location
            };
            console.log('Loaded resident profile:', userProfile);
          }
        } catch (error) {
          console.error('Error loading resident profile:', error);
        }
      } else {
        // For staff/admin, check users table
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .limit(1);
            
          if (!userError && userData && userData.length > 0) {
            const user = userData[0];
            userProfile = {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              phone: user.phone_number,
              address: user.address
            };
            console.log('Loaded user profile from users table:', userProfile);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
      
      if (!userProfile) {
        if (isResidentLogin) {
          throw new Error('Account not found. Please check your email or register if you haven\'t already.');
        } else {
          throw new Error('Staff profile not found. Please contact the system administrator.');
        }
      }

      // Update last login time
      try {
        if (userProfile.role !== 'resident') {
          await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('email', email);
        } else {
          await supabase
            .from('residents')
            .update({ updated_at: new Date().toISOString() })
            .eq('email', email);
        }
      } catch (error) {
        console.warn('Failed to update last login time:', error);
      }

      setUser(userProfile);
      localStorage.setItem('user', JSON.stringify(userProfile));
      console.log('Login successful for user:', userProfile.name);
      return true;
      
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
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