/*
  # Enhanced Barangay Management System - Complete Database Schema

  1. New Tables
    - `users` - System users with role-based access
    - `residents` - Resident profiles and verification status
    - `family_members` - Family member information
    - `projects` - Barangay projects and initiatives
    - `project_achievements` - Project milestones and achievements
    - `announcements` - Public announcements and notices
    - `appointments` - Service appointments
    - `documents` - Document requests and processing
    - `system_settings` - System configuration
    - `transactions` - Financial transactions
    - `inventory_items` - Medical inventory management
    - `patients` - Patient records
    - `medical_records` - Medical consultation records
    - `business_permits` - Business permit applications
    - `business_documents` - Business permit supporting documents
    - `incidents` - Incident reports and blotter entries
    - `audit_logs` - System audit trail

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each user role
    - Implement data access controls

  3. Performance
    - Add indexes for frequently queried columns
    - Optimize for real-time subscriptions
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('super-admin', 'barangay-official', 'resident', 'medical-portal', 'accounting-portal', 'disaster-portal')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  permissions jsonb DEFAULT '[]',
  phone_number text,
  address text,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create residents table
CREATE TABLE IF NOT EXISTS residents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone_number text NOT NULL,
  address text NOT NULL,
  verification_status text DEFAULT 'non-verified' CHECK (verification_status IN ('non-verified', 'semi-verified', 'verified')),
  qr_code text UNIQUE,
  date_registered date DEFAULT CURRENT_DATE,
  emergency_contact text,
  birth_date date,
  gender text CHECK (gender IN ('male', 'female')),
  civil_status text CHECK (civil_status IN ('single', 'married', 'widowed', 'separated', 'divorced')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create family_members table
CREATE TABLE IF NOT EXISTS family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  name text NOT NULL,
  relation text NOT NULL,
  age integer NOT NULL CHECK (age >= 0),
  gender text NOT NULL CHECK (gender IN ('male', 'female')),
  birth_date date,
  created_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('infrastructure', 'health', 'education', 'environment', 'social', 'technology')),
  status text DEFAULT 'planning' CHECK (status IN ('planning', 'ongoing', 'completed', 'on-hold')),
  start_date date NOT NULL,
  end_date date,
  budget numeric(12,2) NOT NULL CHECK (budget >= 0),
  location text NOT NULL,
  beneficiaries integer NOT NULL CHECK (beneficiaries >= 0),
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_achievements table
CREATE TABLE IF NOT EXISTS project_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  achievement text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  type text DEFAULT 'notice' CHECK (type IN ('important', 'event', 'notice', 'emergency', 'health', 'weather', 'evacuation', 'update')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  author text NOT NULL,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_name text NOT NULL,
  resident_email text,
  resident_phone text,
  service text NOT NULL,
  service_type text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid REFERENCES residents(id) ON DELETE SET NULL,
  document_type text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'released', 'rejected')),
  requested_date date DEFAULT CURRENT_DATE,
  processed_date date,
  released_date date,
  fee numeric(8,2) DEFAULT 0 CHECK (fee >= 0),
  payment_status text DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_method text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('revenue', 'expense')),
  description text NOT NULL,
  amount numeric(12,2) NOT NULL,
  category text NOT NULL,
  payment_method text NOT NULL,
  reference_number text,
  transaction_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('medicine', 'equipment', 'supply')),
  current_stock integer DEFAULT 0 CHECK (current_stock >= 0),
  minimum_stock integer DEFAULT 0 CHECK (minimum_stock >= 0),
  unit text NOT NULL,
  cost_per_unit numeric(8,2) DEFAULT 0 CHECK (cost_per_unit >= 0),
  supplier text,
  expiry_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid REFERENCES residents(id) ON DELETE SET NULL,
  name text NOT NULL,
  age integer NOT NULL CHECK (age >= 0),
  gender text NOT NULL CHECK (gender IN ('male', 'female')),
  contact_number text NOT NULL,
  address text NOT NULL,
  medical_history text,
  allergies text,
  emergency_contact text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create medical_records table
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  visit_date date DEFAULT CURRENT_DATE,
  diagnosis text NOT NULL,
  treatment text NOT NULL,
  prescription text,
  doctor_notes text,
  vital_signs jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create business_permits table
CREATE TABLE IF NOT EXISTS business_permits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  owner_name text NOT NULL,
  owner_email text NOT NULL,
  business_type text NOT NULL,
  address text NOT NULL,
  contact_info jsonb DEFAULT '{}',
  permit_type text DEFAULT 'new' CHECK (permit_type IN ('new', 'renewal', 'amendment')),
  application_status text DEFAULT 'pending' CHECK (application_status IN ('pending', 'under-review', 'approved', 'rejected', 'expired')),
  documents jsonb DEFAULT '[]',
  fees jsonb DEFAULT '{}',
  payment_status text DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  approval_date date,
  expiry_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create business_documents table
CREATE TABLE IF NOT EXISTS business_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  permit_id uuid NOT NULL REFERENCES business_permits(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size integer DEFAULT 0,
  upload_date timestamptz DEFAULT now(),
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_by text,
  verified_at timestamptz,
  notes text
);

-- Create incidents table (MISSING TABLE)
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_type text NOT NULL CHECK (incident_type IN ('complaint', 'dispute', 'crime', 'accident', 'noise', 'public-safety', 'other')),
  title text NOT NULL,
  description text NOT NULL,
  reporter_name text NOT NULL,
  reporter_email text NOT NULL,
  reporter_phone text,
  location text NOT NULL,
  incident_date date NOT NULL,
  incident_time time,
  status text DEFAULT 'reported' CHECK (status IN ('reported', 'investigating', 'resolved', 'closed', 'dismissed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to text,
  resolution text,
  evidence jsonb DEFAULT '[]',
  witnesses jsonb DEFAULT '[]',
  date_submitted date DEFAULT CURRENT_DATE,
  date_resolved date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action_type text NOT NULL,
  resource_type text NOT NULL,
  resource_id text NOT NULL,
  old_value jsonb,
  new_value jsonb,
  timestamp timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_residents_email ON residents(email);
CREATE INDEX IF NOT EXISTS idx_residents_qr_code ON residents(qr_code);
CREATE INDEX IF NOT EXISTS idx_residents_verification_status ON residents(verification_status);
CREATE INDEX IF NOT EXISTS idx_family_members_resident_id ON family_members(resident_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_achievements_project_id ON project_achievements(project_id);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON announcements(type);
CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_documents_resident_id ON documents(resident_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_patients_resident_id ON patients(resident_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_business_permits_status ON business_permits(application_status);
CREATE INDEX IF NOT EXISTS idx_business_permits_payment ON business_permits(payment_status);
CREATE INDEX IF NOT EXISTS idx_business_permits_owner_email ON business_permits(owner_email);
CREATE INDEX IF NOT EXISTS idx_business_documents_permit_id ON business_documents(permit_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_type ON incidents(incident_type);
CREATE INDEX IF NOT EXISTS idx_incidents_reporter_email ON incidents(reporter_email);
CREATE INDEX IF NOT EXISTS idx_incidents_date ON incidents(incident_date);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users FOR SELECT TO authenticated USING (auth.uid()::text = id::text);
CREATE POLICY "Super admins can manage all users" ON users FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role = 'super-admin'
  )
);
CREATE POLICY "Barangay officials can read non-admin users" ON users FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role = 'barangay-official'
  ) AND role != 'super-admin'
);

-- Residents policies
CREATE POLICY "Residents can read own data" ON residents FOR SELECT TO authenticated USING (auth.uid()::text = user_id::text);
CREATE POLICY "Admins and officials can manage residents" ON residents FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('super-admin', 'barangay-official')
  )
);

-- Family members policies
CREATE POLICY "Residents can manage own family" ON family_members FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM residents 
    WHERE residents.id = family_members.resident_id 
    AND residents.user_id::text = auth.uid()::text
  )
);
CREATE POLICY "Admins and officials can read family data" ON family_members FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('super-admin', 'barangay-official')
  )
);

-- Projects policies
CREATE POLICY "Everyone can read projects" ON projects FOR SELECT TO authenticated;
CREATE POLICY "Admins and officials can manage projects" ON projects FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('super-admin', 'barangay-official')
  )
);

-- Project achievements policies
CREATE POLICY "Everyone can read achievements" ON project_achievements FOR SELECT TO authenticated;
CREATE POLICY "Admins and officials can manage achievements" ON project_achievements FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('super-admin', 'barangay-official')
  )
);

-- Announcements policies
CREATE POLICY "Everyone can read published announcements" ON announcements FOR SELECT TO authenticated USING (status = 'published');
CREATE POLICY "Admins and officials can manage announcements" ON announcements FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('super-admin', 'barangay-official', 'medical-portal', 'accounting-portal', 'disaster-portal')
  )
);

-- Appointments policies
CREATE POLICY "Everyone can read appointments" ON appointments FOR SELECT TO authenticated;
CREATE POLICY "Admins and officials can manage appointments" ON appointments FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('super-admin', 'barangay-official')
  )
);

-- Documents policies
CREATE POLICY "Residents can read own documents" ON documents FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM residents 
    WHERE residents.id = documents.resident_id 
    AND residents.user_id::text = auth.uid()::text
  )
);
CREATE POLICY "Admins and officials can manage documents" ON documents FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('super-admin', 'barangay-official')
  )
);

-- System settings policies
CREATE POLICY "Officials can read settings" ON system_settings FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('super-admin', 'barangay-official')
  )
);
CREATE POLICY "Admins can manage settings" ON system_settings FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role = 'super-admin'
  )
);

-- Transactions policies
CREATE POLICY "Accounting staff can manage transactions" ON transactions FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('super-admin', 'barangay-official', 'accounting-portal')
  )
);

-- Inventory policies
CREATE POLICY "Medical staff can manage inventory" ON inventory_items FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('super-admin', 'barangay-official', 'medical-portal')
  )
);

-- Patients policies
CREATE POLICY "Medical staff can manage patients" ON patients FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('super-admin', 'barangay-official', 'medical-portal')
  )
);

-- Medical records policies
CREATE POLICY "Medical staff can manage records" ON medical_records FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('super-admin', 'barangay-official', 'medical-portal')
  )
);

-- Business permits policies
CREATE POLICY "Officials can manage all permits" ON business_permits FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('super-admin', 'barangay-official')
  )
);
CREATE POLICY "Business owners can create permits" ON business_permits FOR INSERT TO authenticated WITH CHECK (owner_email = auth.email());
CREATE POLICY "Business owners can read own permits" ON business_permits FOR SELECT TO authenticated USING (owner_email = auth.email());
CREATE POLICY "Business owners can update own permits" ON business_permits FOR UPDATE TO authenticated USING (owner_email = auth.email());

-- Business documents policies
CREATE POLICY "Officials can manage all documents" ON business_documents FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('super-admin', 'barangay-official')
  )
);
CREATE POLICY "Business owners can manage own documents" ON business_documents FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM business_permits 
    WHERE business_permits.id = business_documents.permit_id 
    AND business_permits.owner_email = auth.email()
  )
);

-- Incidents policies (MISSING POLICIES)
CREATE POLICY "Everyone can create incidents" ON incidents FOR INSERT TO authenticated;
CREATE POLICY "Residents can read own incidents" ON incidents FOR SELECT TO authenticated USING (reporter_email = auth.email());
CREATE POLICY "Officials can manage all incidents" ON incidents FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('super-admin', 'barangay-official')
  )
);
CREATE POLICY "Medical and disaster staff can read incidents" ON incidents FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('medical-portal', 'disaster-portal')
  )
);

-- Audit logs policies
CREATE POLICY "Admins can read audit logs" ON audit_logs FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role = 'super-admin'
  )
);