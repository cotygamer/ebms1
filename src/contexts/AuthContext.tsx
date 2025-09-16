import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { dataService } from '../services/dataService';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super-admin' | 'barangay-official' | 'resident' | 'medical-portal' | 'accounting-portal' | 'disaster-portal';
  status?: 'active' | 'inactive' | 'suspended';
  permissions?: string[];
  phone_number?: string;
  address?: string;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
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
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          await loadUserProfile(session.user.email!);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user.email!);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (email: string) => {
    try {
      console.log('Loading user profile for email:', email);
      
      // Get user from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError) {
        console.error('Error fetching user profile:', userError);
        
        // If user not found in users table, check if they're a resident
        const { data: residentData, error: residentError } = await supabase
          .from('residents')
          .select('*')
          .eq('email', email)
          .single();

        if (residentError) {
          console.error('User not found in users or residents table:', residentError);
          throw new Error('User profile not found. Please contact the barangay office to activate your account.');
        }

        // Create user profile from resident data
        const userProfile: User = {
          id: residentData.id,
          email: residentData.email,
          name: residentData.name,
          role: 'resident',
          status: 'active',
          phone_number: residentData.phone_number,
          address: residentData.address,
          verificationStatus: residentData.verification_status || 'non-verified',
          qrCode: residentData.qr_code,
          created_at: residentData.created_at,
          updated_at: residentData.updated_at,
          // Map resident fields to user profile
          phone: residentData.phone_number,
          birthDate: residentData.birth_date,
          gender: residentData.gender,
          civilStatus: residentData.civil_status,
          nationality: residentData.nationality,
          occupation: residentData.occupation,
          monthlyIncome: residentData.monthly_income,
          emergencyContactName: residentData.emergency_contact?.split(' - ')[0],
          emergencyContactPhone: residentData.emergency_contact?.split(' - ')[1],
          emergencyContactRelation: residentData.emergency_contact?.split(' - ')[2]?.replace(/[()]/g, ''),
          houseLocation: residentData.house_location,
          governmentIds: residentData.government_ids,
          familyTree: [
            { id: 1, name: residentData.name, relation: 'self', age: calculateAge(residentData.birth_date), gender: residentData.gender }
          ]
        };

        setUser(userProfile);
        localStorage.setItem('user', JSON.stringify(userProfile));
        return;
      }

      // Update last login timestamp (ignore errors)
      try {
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', userData.id);
      } catch (updateError) {
        console.warn('Failed to update last login:', updateError);
      }

      // Create user profile from users table data
      const userProfile: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        status: userData.status,
        permissions: userData.permissions || [],
        phone_number: userData.phone_number,
        address: userData.address,
        last_login: userData.last_login,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      };

      // If user is a resident, also load resident-specific data
      if (userData.role === 'resident') {
        try {
          const { data: residentData } = await supabase
            .from('residents')
            .select('*')
            .eq('email', email)
            .single();

          if (residentData) {
            userProfile.verificationStatus = residentData.verification_status || 'non-verified';
            userProfile.qrCode = residentData.qr_code;
            userProfile.phone = residentData.phone_number;
            userProfile.birthDate = residentData.birth_date;
            userProfile.gender = residentData.gender;
            userProfile.civilStatus = residentData.civil_status;
            userProfile.nationality = residentData.nationality;
            userProfile.occupation = residentData.occupation;
            userProfile.monthlyIncome = residentData.monthly_income;
            userProfile.houseLocation = residentData.house_location;
            userProfile.governmentIds = residentData.government_ids;
            
            // Parse emergency contact
            if (residentData.emergency_contact) {
              const parts = residentData.emergency_contact.split(' - ');
              userProfile.emergencyContactName = parts[0];
              userProfile.emergencyContactPhone = parts[1];
              userProfile.emergencyContactRelation = parts[2]?.replace(/[()]/g, '');
              userProfile.emergencyContactAddress = parts[3];
            }

            // Create basic family tree
            userProfile.familyTree = [
              { 
                id: 1, 
                name: residentData.name, 
                relation: 'self', 
                age: calculateAge(residentData.birth_date), 
                gender: residentData.gender 
              }
            ];
          }
        } catch (residentError) {
          console.warn('Failed to load resident data:', residentError);
          // Continue with basic user profile
        }
      }

      console.log('User profile loaded:', userProfile);
      setUser(userProfile);
      localStorage.setItem('user', JSON.stringify(userProfile));
    } catch (error) {
      console.error('Error loading user profile:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Supabase auth error:', error);
        
        // Provide more specific error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        } else if (error.message.includes('captcha')) {
          throw new Error('CAPTCHA verification failed. Please contact support if this persists.');
        } else {
          throw new Error(`Login failed: ${error.message}`);
        }
      }

      if (data.user) {
        console.log('Supabase auth successful, loading user profile...');
        await loadUserProfile(email);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw to be handled by the login component
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
      }

      // Clear local storage and state
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('sessionId');
      sessionStorage.clear();
      
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      // Force clear user state even if logout fails
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
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

// Helper function to calculate age from birth date
function calculateAge(birthDate?: string): number {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}