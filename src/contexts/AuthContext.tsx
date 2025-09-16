import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { dataService } from '../services/dataService';

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
    try {
      console.log('Attempting login with email:', email);
      
      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        
        // Provide specific error messages
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (authError.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before logging in.');
        } else if (authError.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a few minutes and try again.');
        } else {
          throw new Error(authError.message || 'Login failed. Please try again.');
        }
      }

      if (!authData.user) {
        throw new Error('Authentication failed. Please try again.');
      }

      console.log('Auth successful, loading user profile...');
      
      // Try to load user from users table first (for admin/staff accounts)
      let userProfile = null;
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();
          
        if (!userError && userData) {
          userProfile = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            phone: userData.phone_number,
            address: userData.address
          };
          console.log('Loaded user profile from users table:', userProfile);
        }
      } catch (error) {
        console.log('User not found in users table, checking residents table...');
      }
      
      // If not found in users table, try residents table
      if (!userProfile) {
        try {
          const { data: residentData, error: residentError } = await supabase
            .from('residents')
            .select('*')
            .eq('email', email)
            .single();
            
          if (!residentError && residentData) {
            userProfile = {
              id: residentData.id,
              email: residentData.email,
              name: residentData.name,
              role: 'resident',
              verificationStatus: residentData.verification_status,
              qrCode: residentData.qr_code,
              phone: residentData.phone_number,
              address: residentData.address,
              birthDate: residentData.birth_date,
              gender: residentData.gender,
              civilStatus: residentData.civil_status,
              nationality: residentData.nationality,
              religion: residentData.religion,
              occupation: residentData.occupation,
              monthlyIncome: residentData.monthly_income,
              emergencyContact: residentData.emergency_contact,
              dateRegistered: residentData.date_registered
            };
            console.log('Loaded user profile from residents table:', userProfile);
          }
        } catch (error) {
          console.error('Error loading resident profile:', error);
        }
      }
      
      if (!userProfile) {
        throw new Error('User profile not found. Please contact support.');
      }

      // Update last login time
      try {
        if (userProfile.role !== 'resident') {
          await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
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