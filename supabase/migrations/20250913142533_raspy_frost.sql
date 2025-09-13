/*
  # Comprehensive Database Update - All Modules

  1. New Tables
    - Enhanced all existing tables with proper structure
    - Added missing columns and relationships
    - Fixed data types and constraints
    - Added proper indexes for performance

  2. Security
    - Disabled RLS for development (as requested)
    - Removed all existing policies
    - Added proper foreign key constraints

  3. Data Integrity
    - Added proper default values
    - Fixed column types and constraints
    - Added validation checks
    - Ensured referential integrity

  4. Performance
    - Added indexes on frequently queried columns
    - Optimized table structure
    - Added proper primary keys and foreign keys
*/

-- Drop existing tables to recreate with proper structure
DROP TABLE IF EXISTS business_documents CASCADE;
DROP TABLE IF EXISTS project_achievements CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS family_members CASCADE;
DROP TABLE IF EXISTS business_permits CASCADE;
DROP TABLE IF EXISTS inventory_items CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS incidents CASCADE;
DROP TABLE IF EXISTS residents CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('super-admin', 'barangay-official', 'resident', 'medical-portal', 'accounting-portal', 'disaster-portal')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  permissions jsonb DEFAULT '[]'::jsonb,
  phone_number text,
  address text,
  password_hash text,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create residents table
CREATE TABLE residents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone_number text NOT NULL,
  address text NOT NULL,
  verification_status text NOT NULL DEFAULT 'non-verified' CHECK (verification_status IN ('non-verified', 'details-updated', 'semi-verified', 'verified')),
  qr_code text UNIQUE,
  date_registered date DEFAULT CURRENT_DATE,
  emergency_contact text,
  birth_date date,
  gender text CHECK (gender IN ('male', 'female')),
  civil_status text CHECK (civil_status IN ('single', 'married', 'widowed', 'separated', 'divorced')),
  nationality text DEFAULT 'Filipino',
  religion text,
  occupation text,
  monthly_income text,
  house_location jsonb,
  government_ids jsonb DEFAULT '{}'::jsonb,
  profile_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid REFERENCES residents(id) ON DELETE SET NULL,
  document_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'released', 'rejected')),
  requested_date date DEFAULT CURRENT_DATE,
  processed_date date,
  released_date date,
  fee numeric(8,2) DEFAULT 0 CHECK (fee >= 0),
  payment_status text NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_method text,
  purpose text,
  notes text,
  tracking_number text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create incidents table
CREATE TABLE incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_name text NOT NULL,
  reporter_email text NOT NULL,
  reporter_phone text,
  incident_type text NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  location text,
  date_occurred date,
  time_occurred time,
  witness_name text,
  witness_contact text,
  assigned_to text,
  resolution text,
  date_submitted date DEFAULT CURRENT_DATE,
  evidence_files jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create announcements table
CREATE TABLE announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL DEFAULT 'notice' CHECK (type IN ('important', 'event', 'notice', 'emergency', 'health', 'weather', 'evacuation', 'update')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  author text NOT NULL,
  target_audience text DEFAULT 'all',
  expires_at timestamptz,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid REFERENCES residents(id) ON DELETE SET NULL,
  resident_name text NOT NULL,
  resident_email text,
  resident_phone text,
  service text NOT NULL,
  service_type text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')),
  notes text,
  assigned_staff text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create patients table
CREATE TABLE patients (
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
  blood_type text,
  height_cm numeric(5,2),
  weight_kg numeric(5,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create medical_records table
CREATE TABLE medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  visit_date date DEFAULT CURRENT_DATE,
  diagnosis text NOT NULL,
  treatment text NOT NULL,
  prescription text,
  doctor_notes text,
  vital_signs jsonb,
  follow_up_date date,
  attending_physician text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create inventory_items table
CREATE TABLE inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('medicine', 'equipment', 'supply')),
  current_stock integer NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
  minimum_stock integer NOT NULL DEFAULT 0 CHECK (minimum_stock >= 0),
  unit text NOT NULL,
  cost_per_unit numeric(8,2) NOT NULL DEFAULT 0 CHECK (cost_per_unit >= 0),
  supplier text,
  expiry_date date,
  batch_number text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('infrastructure', 'health', 'education', 'environment', 'social', 'technology')),
  status text NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'ongoing', 'completed', 'on-hold')),
  start_date date NOT NULL,
  end_date date,
  budget numeric(12,2) NOT NULL CHECK (budget >= 0),
  location text NOT NULL,
  beneficiaries integer NOT NULL CHECK (beneficiaries >= 0),
  image_url text,
  project_manager text,
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_achievements table
CREATE TABLE project_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  achievement text NOT NULL,
  date_achieved date DEFAULT CURRENT_DATE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('revenue', 'expense')),
  description text NOT NULL,
  amount numeric(12,2) NOT NULL,
  category text NOT NULL,
  payment_method text NOT NULL,
  reference_number text,
  transaction_date date DEFAULT CURRENT_DATE,
  document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  processed_by text,
  approved_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create business_permits table
CREATE TABLE business_permits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  owner_name text NOT NULL,
  owner_email text NOT NULL,
  business_type text NOT NULL,
  address text NOT NULL,
  contact_info jsonb DEFAULT '{}'::jsonb,
  permit_type text NOT NULL DEFAULT 'new' CHECK (permit_type IN ('new', 'renewal', 'amendment')),
  application_status text NOT NULL DEFAULT 'pending' CHECK (application_status IN ('pending', 'under-review', 'approved', 'rejected', 'expired')),
  documents jsonb DEFAULT '[]'::jsonb,
  fees jsonb DEFAULT '{}'::jsonb,
  payment_status text NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  approval_date date,
  expiry_date date,
  permit_number text UNIQUE,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create business_documents table
CREATE TABLE business_documents (
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

-- Create family_members table
CREATE TABLE family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  name text NOT NULL,
  relation text NOT NULL,
  age integer NOT NULL CHECK (age >= 0),
  gender text NOT NULL CHECK (gender IN ('male', 'female')),
  birth_date date,
  occupation text,
  education_level text,
  created_at timestamptz DEFAULT now()
);

-- Create system_settings table
CREATE TABLE system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action_type text NOT NULL,
  resource_type text NOT NULL,
  resource_id text NOT NULL,
  old_value jsonb,
  new_value jsonb,
  ip_address text,
  user_agent text,
  timestamp timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

CREATE INDEX IF NOT EXISTS idx_residents_email ON residents(email);
CREATE INDEX IF NOT EXISTS idx_residents_verification_status ON residents(verification_status);
CREATE INDEX IF NOT EXISTS idx_residents_qr_code ON residents(qr_code);
CREATE INDEX IF NOT EXISTS idx_residents_user_id ON residents(user_id);

CREATE INDEX IF NOT EXISTS idx_documents_resident_id ON documents(resident_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_tracking_number ON documents(tracking_number);

CREATE INDEX IF NOT EXISTS idx_incidents_reporter_email ON incidents(reporter_email);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_priority ON incidents(priority);
CREATE INDEX IF NOT EXISTS idx_incidents_date_submitted ON incidents(date_submitted);

CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON announcements(type);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_resident_id ON appointments(resident_id);

CREATE INDEX IF NOT EXISTS idx_patients_resident_id ON patients(resident_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON medical_records(patient_id);

CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

CREATE INDEX IF NOT EXISTS idx_business_permits_owner_email ON business_permits(owner_email);
CREATE INDEX IF NOT EXISTS idx_business_permits_status ON business_permits(application_status);
CREATE INDEX IF NOT EXISTS idx_business_permits_payment ON business_permits(payment_status);

CREATE INDEX IF NOT EXISTS idx_business_documents_permit_id ON business_documents(permit_id);
CREATE INDEX IF NOT EXISTS idx_family_members_resident_id ON family_members(resident_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- Insert default system settings
INSERT INTO system_settings (key, value, description, category) VALUES
('barangay_name', '"Barangay San Miguel"', 'Official barangay name', 'general'),
('barangay_address', '"San Miguel, Metro Manila, Philippines"', 'Complete barangay address', 'general'),
('contact_number', '"+63 2 8123 4567"', 'Main contact number', 'contact'),
('email_address', '"info@barangaysanmiguel.gov.ph"', 'Official email address', 'contact'),
('website', '"https://barangaysanmiguel.gov.ph"', 'Official website', 'contact'),
('facebook_page', '"https://facebook.com/barangaysanmiguel"', 'Facebook page URL', 'contact'),
('operating_hours', '"8:00 AM - 5:00 PM"', 'Office operating hours', 'general'),
('timezone', '"Asia/Manila"', 'System timezone', 'localization'),
('language', '"English"', 'Default language', 'localization'),
('currency', '"PHP"', 'Default currency', 'localization'),
('date_format', '"MM/DD/YYYY"', 'Date display format', 'localization'),
('time_format', '"12-hour"', 'Time display format', 'localization'),
('max_file_size', '10', 'Maximum file upload size in MB', 'system'),
('allowed_file_types', '"PDF, JPG, PNG, DOCX"', 'Allowed file types for uploads', 'system'),
('session_timeout', '30', 'Session timeout in minutes', 'security'),
('password_policy', '"strong"', 'Password policy level', 'security'),
('two_factor_auth', 'false', 'Enable two-factor authentication', 'security'),
('email_notifications', 'true', 'Enable email notifications', 'notifications'),
('sms_notifications', 'false', 'Enable SMS notifications', 'notifications'),
('push_notifications', 'true', 'Enable push notifications', 'notifications'),
('maintenance_mode', 'false', 'System maintenance mode', 'system'),
('debug_mode', 'false', 'Enable debug mode', 'system'),
('backup_frequency', '"daily"', 'Backup frequency', 'system'),
('primary_color', '"#2563eb"', 'Primary theme color', 'appearance'),
('secondary_color', '"#059669"', 'Secondary theme color', 'appearance'),
('accent_color', '"#dc2626"', 'Accent theme color', 'appearance'),
('google_maps_api_key', '""', 'Google Maps API key', 'integrations'),
('payment_gateway', '{"provider": "PayPal", "apiKey": "", "secretKey": "", "gcash": {"enabled": true, "merchantId": "", "apiKey": ""}, "maya": {"enabled": true, "publicKey": "", "secretKey": ""}, "dragonpay": {"enabled": false, "merchantId": "", "password": ""}, "cashOnPickup": {"enabled": true}}', 'Payment gateway configuration', 'integrations')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();

-- Insert default admin user
INSERT INTO users (email, name, role, status, permissions, created_at, updated_at) VALUES
('superadmin@barangay.gov', 'Super Administrator', 'super-admin', 'active', '["all"]'::jsonb, now(), now()),
('official@barangay.gov', 'Barangay Official', 'barangay-official', 'active', '["residents", "documents", "reports", "announcements"]'::jsonb, now(), now()),
('medical@barangay.gov', 'Dr. Maria Santos', 'medical-portal', 'active', '["health", "medical-records", "appointments"]'::jsonb, now(), now()),
('accounting@barangay.gov', 'Ana Cruz', 'accounting-portal', 'active', '["accounting", "financial-reports", "payments"]'::jsonb, now(), now()),
('disaster@barangay.gov', 'Pedro Martinez', 'disaster-portal', 'active', '["disaster-management", "emergency-alerts", "evacuation"]'::jsonb, now(), now())
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  permissions = EXCLUDED.permissions,
  updated_at = now();

-- Insert sample residents
INSERT INTO residents (name, email, phone_number, address, verification_status, birth_date, gender, civil_status, emergency_contact, date_registered, created_at, updated_at) VALUES
('Juan Dela Cruz', 'resident@email.com', '+63 912 345 6789', '123 Main Street, San Miguel, Metro Manila', 'verified', '1989-05-15', 'male', 'married', 'Maria Dela Cruz - +63 912 345 6790 (spouse) - 123 Main Street, San Miguel, Metro Manila', '2024-01-15', now(), now()),
('Test Resident', 'test@resident.com', '+63 912 345 6788', '456 Test Street, San Miguel, Metro Manila', 'non-verified', '1990-01-01', 'male', 'single', 'Test Contact - +63 912 345 6787 (parent) - 456 Test Street, San Miguel, Metro Manila', '2024-03-01', now(), now()),
('Maria Santos', 'maria@resident.com', '+63 912 345 6787', '789 Santos Avenue, San Miguel, Metro Manila', 'semi-verified', '1985-12-25', 'female', 'married', 'Pedro Santos - +63 912 345 6786 (spouse) - 789 Santos Avenue, San Miguel, Metro Manila', '2024-02-15', now(), now())
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  phone_number = EXCLUDED.phone_number,
  address = EXCLUDED.address,
  verification_status = EXCLUDED.verification_status,
  updated_at = now();

-- Insert sample documents
INSERT INTO documents (resident_id, document_type, status, fee, payment_status, purpose, tracking_number, created_at, updated_at) VALUES
((SELECT id FROM residents WHERE email = 'resident@email.com'), 'Barangay Clearance', 'ready', 50.00, 'paid', 'Employment', 'DOC-2024-001', now(), now()),
((SELECT id FROM residents WHERE email = 'test@resident.com'), 'Certificate of Residency', 'processing', 30.00, 'unpaid', 'School enrollment', 'DOC-2024-002', now(), now()),
((SELECT id FROM residents WHERE email = 'maria@resident.com'), 'Certificate of Indigency', 'pending', 25.00, 'unpaid', 'Medical assistance', 'DOC-2024-003', now(), now());

-- Insert sample incidents
INSERT INTO incidents (reporter_name, reporter_email, incident_type, subject, description, status, priority, location, date_submitted, created_at, updated_at) VALUES
('Juan Dela Cruz', 'resident@email.com', 'Noise Complaint', 'Loud music from neighbor', 'Neighbor playing loud music until late hours affecting sleep', 'investigating', 'medium', '123 Main Street', '2024-03-10', now(), now()),
('Maria Santos', 'maria@resident.com', 'Road Issue', 'Pothole on main road', 'Large pothole causing damage to vehicles', 'pending', 'high', 'Main Street corner', '2024-03-12', now(), now());

-- Insert sample announcements
INSERT INTO announcements (title, content, type, priority, status, author, created_at, updated_at) VALUES
('Community Health Drive', 'Free medical checkup and vaccination for all residents. Bring your barangay ID and health records.', 'health', 'high', 'published', 'Barangay Health Center', now(), now()),
('Road Maintenance Schedule', 'Main Street will undergo maintenance from March 25-27. Please use alternative routes.', 'notice', 'medium', 'published', 'Public Works', now(), now()),
('Barangay Assembly Meeting', 'Monthly barangay assembly meeting on March 30, 2024 at 7:00 PM. All residents are invited.', 'event', 'medium', 'published', 'Barangay Council', now(), now());

-- Insert sample patients
INSERT INTO patients (resident_id, name, age, gender, contact_number, address, emergency_contact, created_at, updated_at) VALUES
((SELECT id FROM residents WHERE email = 'resident@email.com'), 'Juan Dela Cruz', 35, 'male', '+63 912 345 6789', '123 Main Street, San Miguel, Metro Manila', 'Maria Dela Cruz - +63 912 345 6790', now(), now()),
((SELECT id FROM residents WHERE email = 'maria@resident.com'), 'Maria Santos', 39, 'female', '+63 912 345 6787', '789 Santos Avenue, San Miguel, Metro Manila', 'Pedro Santos - +63 912 345 6786', now(), now());

-- Insert sample inventory items
INSERT INTO inventory_items (name, category, current_stock, minimum_stock, unit, cost_per_unit, supplier, created_at, updated_at) VALUES
('Paracetamol 500mg', 'medicine', 120, 50, 'tablets', 2.50, 'PharmaCorp', now(), now()),
('Bandages', 'supply', 80, 25, 'rolls', 15.00, 'MedSupply Inc', now(), now()),
('Digital Thermometer', 'equipment', 5, 3, 'pieces', 250.00, 'MedTech Solutions', now(), now()),
('Blood Pressure Monitor', 'equipment', 3, 2, 'pieces', 1500.00, 'HealthEquip Co', now(), now()),
('Insulin', 'medicine', 25, 10, 'vials', 120.00, 'DiabetesCare Ltd', now(), now());

-- Insert sample projects
INSERT INTO projects (title, description, category, status, start_date, end_date, budget, location, beneficiaries, completion_percentage, created_at, updated_at) VALUES
('Digital Barangay Management System', 'Implementation of comprehensive digital platform for all barangay services', 'technology', 'completed', '2024-01-01', '2024-03-15', 500000, 'Barangay Hall', 1245, 100, now(), now()),
('Community Health Center Upgrade', 'Complete renovation and modernization of the barangay health center', 'health', 'completed', '2023-06-01', '2023-12-15', 750000, 'Barangay Health Center', 1245, 100, now(), now()),
('Road Infrastructure Improvement', 'Major road rehabilitation project covering all main streets', 'infrastructure', 'completed', '2023-03-01', '2023-08-30', 1200000, 'Main Streets', 1245, 100, now(), now()),
('Youth Skills Development Program', 'Comprehensive training program for youth including computer literacy', 'education', 'ongoing', '2024-02-01', NULL, 300000, 'Community Center', 150, 75, now(), now());

-- Insert sample transactions
INSERT INTO transactions (type, description, amount, category, payment_method, reference_number, created_at, updated_at) VALUES
('revenue', 'Barangay Clearance Fee', 50.00, 'Document Fees', 'cash', 'REV-2024-001', now(), now()),
('revenue', 'Business Permit Fee', 500.00, 'Permit Fees', 'gcash', 'REV-2024-002', now(), now()),
('expense', 'Office Supplies', 2500.00, 'Office Expenses', 'cash', 'EXP-2024-001', now(), now()),
('expense', 'Medical Equipment', 15000.00, 'Health Center', 'bank_transfer', 'EXP-2024-002', now(), now());

-- Generate QR codes for verified residents
UPDATE residents 
SET qr_code = 'BRG_' || id || '_' || REPLACE(date_registered::text, '-', '')
WHERE verification_status = 'verified' AND qr_code IS NULL;

-- Disable RLS on all tables (as requested)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE residents DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE business_permits DISABLE ROW LEVEL SECURITY;
ALTER TABLE business_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE family_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.schemaname) || '.' || quote_ident(r.tablename);
    END LOOP;
END $$;