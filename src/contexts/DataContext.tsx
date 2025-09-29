import React, { createContext, useContext, useState, ReactNode } from 'react';
import { dataService } from '../services/dataService';
import { 
  useUsers, 
  useResidents, 
  useDocuments, 
  useIncidents, 
  useAnnouncements, 
  useTransactions,
  useAppointments,
  usePatients,
  useMedicalRecords,
  useInventoryItems,
  useProjects,
  useBusinessPermits,
  useMessages
} from '../hooks/useRealTimeData';

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
  birthDate?: string;
  gender?: string;
  civilStatus?: string;
  nationality?: string;
  religion?: string;
  occupation?: string;
  monthlyIncome?: string;
  emergencyContact?: string;
  houseLocation?: { lat: number; lng: number; address: string };
  governmentIds?: any;
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
  appointments: Appointment[];
  patients: Patient[];
  medicalRecords: MedicalRecord[];
  inventoryItems: InventoryItem[];
  projects: Project[];
  businessPermits: BusinessPermit[];
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
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addBusinessPermit: (permit: Omit<BusinessPermit, 'id'>) => void;
  updateBusinessPermit: (id: string, updates: Partial<BusinessPermit>) => void;
  messages: Message[];
  addMessage: (message: Omit<Message, 'id'>) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
}

interface Appointment {
  id: string;
  residentId?: string;
  residentName: string;
  residentEmail?: string;
  residentPhone?: string;
  service: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes?: string;
  assignedStaff?: string;
  createdAt: string;
  updatedAt: string;
}

interface Patient {
  id: string;
  residentId?: string;
  name: string;
  age: number;
  gender: string;
  contactNumber: string;
  address: string;
  medicalHistory?: string;
  allergies?: string;
  emergencyContact: string;
  bloodType?: string;
  heightCm?: number;
  weightKg?: number;
  createdAt: string;
  updatedAt: string;
}

interface MedicalRecord {
  id: string;
  patientId: string;
  visitDate: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  doctorNotes?: string;
  vitalSigns?: any;
  followUpDate?: string;
  attendingPhysician?: string;
  createdAt: string;
  updatedAt: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  costPerUnit: number;
  supplier?: string;
  expiryDate?: string;
  batchNumber?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  startDate: string;
  endDate?: string;
  budget: number;
  location: string;
  beneficiaries: number;
  imageUrl?: string;
  projectManager?: string;
  completionPercentage?: number;
  achievements?: any[];
  createdAt: string;
  updatedAt: string;
}

interface BusinessPermit {
  id: string;
  businessName: string;
  ownerName: string;
  ownerEmail: string;
  businessType: string;
  address: string;
  contactInfo?: any;
  permitType: string;
  applicationStatus: string;
  documents?: any[];
  fees?: any;
  paymentStatus: string;
  approvalDate?: string;
  expiryDate?: string;
  permitNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  subject: string;
  message: string;
  category: string;
  priority: string;
  status: string;
  source: string;
  replied_at?: string;
  replied_by?: string;
  reply?: string;
  created_at: string;
  updated_at: string;
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
  trackingNumber?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'important' | 'event' | 'notice' | 'emergency' | 'health' | 'weather' | 'evacuation' | 'update';
  priority: 'low' | 'medium' | 'high';
  status: 'published' | 'draft';
  author: string;
  targetAudience?: string;
  expiresAt?: string;
  imageUrl?: string;
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
  documentId?: string;
  processedBy?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface Complaint {
  id: string;
  residentName?: string;
  residentEmail?: string;
  reporter_name: string;
  reporter_email: string;
  reporter_phone?: string;
  type?: string;
  incident_type: string;
  subject: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high';
  dateSubmitted?: string;
  date_submitted: string;
  assignedTo?: string;
  assigned_to?: string;
  resolution?: string;
  location?: string;
  dateOccurred?: string;
  date_occurred?: string;
  timeOccurred?: string;
  time_occurred?: string;
  witnessName?: string;
  witness_name?: string;
  witnessContact?: string;
  witness_contact?: string;
  evidenceFiles?: any[];
  evidence_files?: any[];
  createdAt: string;
  created_at: string;
  updatedAt: string;
  updated_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'barangay-official' | 'resident' | 'medical-portal' | 'accounting-portal' | 'disaster-portal' | 'peace-order-portal';
  status: 'active' | 'inactive' | 'suspended';
  phone_number?: string;
  address?: string;
  password_hash?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
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
  const { data: appointments, refresh: refreshAppointments } = useAppointments();
  const { data: patients, refresh: refreshPatients } = usePatients();
  const { data: medicalRecords, refresh: refreshMedicalRecords } = useMedicalRecords();
  const { data: inventoryItems, refresh: refreshInventoryItems } = useInventoryItems();
  const { data: projects, refresh: refreshProjects } = useProjects();
  const { data: businessPermits, refresh: refreshBusinessPermits } = useBusinessPermits();
  const { data: messages, refresh: refreshMessages } = useMessages();

  // Debug logging to check data loading
  React.useEffect(() => {
    console.log('DataProvider - Users loaded:', users.length);
    console.log('DataProvider - Residents loaded:', residents.length);
    console.log('DataProvider - Documents loaded:', documents.length);
    console.log('DataProvider - Incidents loaded:', incidents.length);
    console.log('DataProvider - Appointments loaded:', appointments.length);
    console.log('DataProvider - Patients loaded:', patients.length);
  }, [users, residents, documents, incidents]);

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

  // Load system settings from database
  React.useEffect(() => {
    const loadSystemSettings = async () => {
      try {
        const dbSettings = await dataService.getSystemSettings();
        if (dbSettings && Object.keys(dbSettings).length > 0) {
          const formattedSettings = {
            googleMapsApiKey: dbSettings.google_maps_api_key || '',
            paymentGateway: dbSettings.payment_gateway || {
              provider: 'PayPal',
              apiKey: '',
              secretKey: '',
              gcash: { enabled: true, merchantId: '', apiKey: '' },
              maya: { enabled: true, publicKey: '', secretKey: '' },
              dragonpay: { enabled: false, merchantId: '', password: '' },
              cashOnPickup: { enabled: true }
            },
            barangayName: dbSettings.barangay_name || 'Barangay San Miguel',
            barangayAddress: dbSettings.barangay_address || 'San Miguel, Metro Manila, Philippines',
            contactNumber: dbSettings.contact_number || '+63 2 8123 4567',
            emailAddress: dbSettings.email_address || '',
            website: dbSettings.website || '',
            facebookPage: dbSettings.facebook_page || '',
            operatingHours: dbSettings.operating_hours || '8:00 AM - 5:00 PM',
            timezone: dbSettings.timezone || 'Asia/Manila',
            language: dbSettings.language || 'English',
            currency: dbSettings.currency || 'PHP',
            dateFormat: dbSettings.date_format || 'MM/DD/YYYY',
            timeFormat: dbSettings.time_format || '12-hour',
            maxFileSize: dbSettings.max_file_size || '10',
            allowedFileTypes: dbSettings.allowed_file_types || 'PDF, JPG, PNG, DOCX',
            sessionTimeout: dbSettings.session_timeout || '30',
            passwordPolicy: dbSettings.password_policy || 'strong',
            twoFactorAuth: dbSettings.two_factor_auth || false,
            emailNotifications: dbSettings.email_notifications || true,
            smsNotifications: dbSettings.sms_notifications || false,
            pushNotifications: dbSettings.push_notifications || true,
            maintenanceMode: dbSettings.maintenance_mode || false,
            debugMode: dbSettings.debug_mode || false,
            backupFrequency: dbSettings.backup_frequency || 'daily',
            primaryColor: dbSettings.primary_color || '#2563eb',
            secondaryColor: dbSettings.secondary_color || '#059669',
            accentColor: dbSettings.accent_color || '#dc2626'
          };
          setSystemSettings(formattedSettings);
        }
      } catch (error) {
        console.error('Failed to load system settings:', error);
      }
    };

    loadSystemSettings();
  }, []);
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

  const updateSystemSettings = async (updates: Partial<SystemSettings>) => {
    try {
      const newSettings = { ...systemSettings, ...updates };
      
      // Convert to database format
      const dbUpdates: Record<string, any> = {};
      if (updates.googleMapsApiKey !== undefined) dbUpdates.google_maps_api_key = updates.googleMapsApiKey;
      if (updates.paymentGateway !== undefined) dbUpdates.payment_gateway = updates.paymentGateway;
      if (updates.barangayName !== undefined) dbUpdates.barangay_name = updates.barangayName;
      if (updates.barangayAddress !== undefined) dbUpdates.barangay_address = updates.barangayAddress;
      if (updates.contactNumber !== undefined) dbUpdates.contact_number = updates.contactNumber;
      if (updates.emailAddress !== undefined) dbUpdates.email_address = updates.emailAddress;
      if (updates.website !== undefined) dbUpdates.website = updates.website;
      if (updates.facebookPage !== undefined) dbUpdates.facebook_page = updates.facebookPage;
      if (updates.operatingHours !== undefined) dbUpdates.operating_hours = updates.operatingHours;
      if (updates.timezone !== undefined) dbUpdates.timezone = updates.timezone;
      if (updates.language !== undefined) dbUpdates.language = updates.language;
      if (updates.currency !== undefined) dbUpdates.currency = updates.currency;
      if (updates.dateFormat !== undefined) dbUpdates.date_format = updates.dateFormat;
      if (updates.timeFormat !== undefined) dbUpdates.time_format = updates.timeFormat;
      if (updates.maxFileSize !== undefined) dbUpdates.max_file_size = updates.maxFileSize;
      if (updates.allowedFileTypes !== undefined) dbUpdates.allowed_file_types = updates.allowedFileTypes;
      if (updates.sessionTimeout !== undefined) dbUpdates.session_timeout = updates.sessionTimeout;
      if (updates.passwordPolicy !== undefined) dbUpdates.password_policy = updates.passwordPolicy;
      if (updates.twoFactorAuth !== undefined) dbUpdates.two_factor_auth = updates.twoFactorAuth;
      if (updates.emailNotifications !== undefined) dbUpdates.email_notifications = updates.emailNotifications;
      if (updates.smsNotifications !== undefined) dbUpdates.sms_notifications = updates.smsNotifications;
      if (updates.pushNotifications !== undefined) dbUpdates.push_notifications = updates.pushNotifications;
      if (updates.maintenanceMode !== undefined) dbUpdates.maintenance_mode = updates.maintenanceMode;
      if (updates.debugMode !== undefined) dbUpdates.debug_mode = updates.debugMode;
      if (updates.backupFrequency !== undefined) dbUpdates.backup_frequency = updates.backupFrequency;
      if (updates.primaryColor !== undefined) dbUpdates.primary_color = updates.primaryColor;
      if (updates.secondaryColor !== undefined) dbUpdates.secondary_color = updates.secondaryColor;
      if (updates.accentColor !== undefined) dbUpdates.accent_color = updates.accentColor;
      
      // Update database
      await dataService.updateMultipleSystemSettings(dbUpdates);
      
      // Update local state
      setSystemSettings(newSettings);
      localStorage.setItem('systemSettings', JSON.stringify(newSettings));
      
      // Trigger a custom event to notify other components about the update
      window.dispatchEvent(new CustomEvent('barangaySettingsUpdated', { 
        detail: newSettings 
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
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
      console.log('DataContext - Adding user:', userData);
      await dataService.createUser({
        ...userData,
        permissions: getDefaultPermissions(userData.role),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      console.log('DataContext - User created, refreshing users...');
      refreshUsers();
      console.log('DataContext - Users refreshed');
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
        reporter_name: complaintData.residentName || complaintData.reporter_name,
        reporter_email: complaintData.residentEmail || complaintData.reporter_email,
        reporter_phone: complaintData.reporter_phone,
        incident_type: complaintData.type || complaintData.incident_type,
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
        resolution: complaintData.resolution,
        evidence_files: complaintData.evidenceFiles || [],
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
      await dataService.updateIncident(id, updates);
      refreshIncidents();
    } catch (error) {
      console.error('Failed to update complaint:', error);
      throw error;
    }
  };

  // New module functions
  const addAppointment = async (appointmentData: Omit<Appointment, 'id'>) => {
    try {
      await dataService.createAppointment({
        resident_id: appointmentData.residentId,
        resident_name: appointmentData.residentName,
        resident_email: appointmentData.residentEmail,
        resident_phone: appointmentData.residentPhone,
        service: appointmentData.service,
        service_type: appointmentData.serviceType,
        appointment_date: appointmentData.appointmentDate,
        appointment_time: appointmentData.appointmentTime,
        status: appointmentData.status || 'scheduled',
        notes: appointmentData.notes,
        assigned_staff: appointmentData.assignedStaff
      });
      refreshAppointments();
    } catch (error) {
      console.error('Failed to add appointment:', error);
      throw error;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      await dataService.updateAppointment(id, updates);
      refreshAppointments();
    } catch (error) {
      console.error('Failed to update appointment:', error);
      throw error;
    }
  };

  const addPatient = async (patientData: Omit<Patient, 'id'>) => {
    try {
      await dataService.createPatient({
        resident_id: patientData.residentId,
        name: patientData.name,
        age: patientData.age,
        gender: patientData.gender,
        contact_number: patientData.contactNumber,
        address: patientData.address,
        medical_history: patientData.medicalHistory,
        allergies: patientData.allergies,
        emergency_contact: patientData.emergencyContact,
        blood_type: patientData.bloodType,
        height_cm: patientData.heightCm,
        weight_kg: patientData.weightKg
      });
      refreshPatients();
    } catch (error) {
      console.error('Failed to add patient:', error);
      throw error;
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      await dataService.updatePatient(id, updates);
      refreshPatients();
    } catch (error) {
      console.error('Failed to update patient:', error);
      throw error;
    }
  };

  const addMedicalRecord = async (recordData: Omit<MedicalRecord, 'id'>) => {
    try {
      await dataService.createMedicalRecord({
        patient_id: recordData.patientId,
        visit_date: recordData.visitDate,
        diagnosis: recordData.diagnosis,
        treatment: recordData.treatment,
        prescription: recordData.prescription,
        doctor_notes: recordData.doctorNotes,
        vital_signs: recordData.vitalSigns,
        follow_up_date: recordData.followUpDate,
        attending_physician: recordData.attendingPhysician
      });
      refreshMedicalRecords();
    } catch (error) {
      console.error('Failed to add medical record:', error);
      throw error;
    }
  };

  const addInventoryItem = async (itemData: Omit<InventoryItem, 'id'>) => {
    try {
      await dataService.createInventoryItem({
        name: itemData.name,
        category: itemData.category,
        current_stock: itemData.currentStock,
        minimum_stock: itemData.minimumStock,
        unit: itemData.unit,
        cost_per_unit: itemData.costPerUnit,
        supplier: itemData.supplier,
        expiry_date: itemData.expiryDate,
        batch_number: itemData.batchNumber,
        location: itemData.location
      });
      refreshInventoryItems();
    } catch (error) {
      console.error('Failed to add inventory item:', error);
      throw error;
    }
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      await dataService.updateInventoryItem(id, updates);
      refreshInventoryItems();
    } catch (error) {
      console.error('Failed to update inventory item:', error);
      throw error;
    }
  };

  const addProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      await dataService.createProject({
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        status: projectData.status || 'planning',
        start_date: projectData.startDate,
        end_date: projectData.endDate,
        budget: projectData.budget,
        location: projectData.location,
        beneficiaries: projectData.beneficiaries,
        image_url: projectData.imageUrl,
        project_manager: projectData.projectManager,
        completion_percentage: projectData.completionPercentage || 0
      });
      refreshProjects();
    } catch (error) {
      console.error('Failed to add project:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      await dataService.updateProject(id, updates);
      refreshProjects();
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  };

  const addBusinessPermit = async (permitData: Omit<BusinessPermit, 'id'>) => {
    try {
      await dataService.createBusinessPermit({
        business_name: permitData.businessName,
        owner_name: permitData.ownerName,
        owner_email: permitData.ownerEmail,
        business_type: permitData.businessType,
        address: permitData.address,
        contact_info: permitData.contactInfo || {},
        permit_type: permitData.permitType || 'new',
        application_status: permitData.applicationStatus || 'pending',
        documents: permitData.documents || [],
        fees: permitData.fees || {},
        payment_status: permitData.paymentStatus || 'unpaid',
        notes: permitData.notes
      });
      refreshBusinessPermits();
    } catch (error) {
      console.error('Failed to add business permit:', error);
      throw error;
    }
  };

  const updateBusinessPermit = async (id: string, updates: Partial<BusinessPermit>) => {
    try {
      await dataService.updateBusinessPermit(id, updates);
      refreshBusinessPermits();
    } catch (error) {
      console.error('Failed to update business permit:', error);
      throw error;
    }
  };

  const addMessage = async (messageData: Omit<Message, 'id'>) => {
    try {
      await dataService.createMessage({
        sender_name: messageData.sender_name,
        sender_email: messageData.sender_email,
        sender_phone: messageData.sender_phone,
        subject: messageData.subject,
        message: messageData.message,
        category: messageData.category || 'general',
        priority: messageData.priority || 'medium',
        status: messageData.status || 'unread',
        source: messageData.source || 'website'
      });
      refreshMessages();
    } catch (error) {
      console.error('Failed to add message:', error);
      throw error;
    }
  };

  const updateMessage = async (id: string, updates: Partial<Message>) => {
    try {
      await dataService.updateMessage(id, updates);
      refreshMessages();
    } catch (error) {
      console.error('Failed to update message:', error);
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
      appointments,
      patients,
      medicalRecords,
      inventoryItems,
      projects,
      businessPermits,
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
      updateComplaint,
      addAppointment,
      updateAppointment,
      addPatient,
      updatePatient,
      addMedicalRecord,
      addInventoryItem,
      updateInventoryItem,
      addProject,
      updateProject,
      addBusinessPermit,
      updateBusinessPermit,
      messages,
      addMessage,
      updateMessage,
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
    case 'peace-order-portal':
      return ['peace-order', 'incident-management', 'crime-prevention', 'patrol-management'];
    default:
      return ['basic'];
  }
}