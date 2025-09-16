/*
  # Enable Authentication Integration

  1. Security Updates
    - Enable RLS on users table
    - Add policies for authenticated users
    - Enable RLS on residents table
    - Add policies for residents

  2. Authentication Setup
    - Ensure users can authenticate and access their data
    - Residents can access their own profiles
    - Admins can manage all data

  3. Indexes
    - Add performance indexes for common queries
*/

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.email() = email);

-- Super admins can read all users
CREATE POLICY "Super admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.email() 
      AND role = 'super-admin'
    )
  );

-- Super admins and barangay officials can manage users
CREATE POLICY "Admins can manage users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.email() 
      AND role IN ('super-admin', 'barangay-official')
    )
  );

-- Enable RLS on residents table
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;

-- Residents can read their own data
CREATE POLICY "Residents can read own data"
  ON residents
  FOR SELECT
  TO authenticated
  USING (email = auth.email());

-- Residents can update their own data
CREATE POLICY "Residents can update own data"
  ON residents
  FOR UPDATE
  TO authenticated
  USING (email = auth.email());

-- Admins can read all residents
CREATE POLICY "Admins can read all residents"
  ON residents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.email() 
      AND role IN ('super-admin', 'barangay-official')
    )
  );

-- Admins can manage all residents
CREATE POLICY "Admins can manage residents"
  ON residents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.email() 
      AND role IN ('super-admin', 'barangay-official')
    )
  );

-- Anyone can insert residents (for registration)
CREATE POLICY "Anyone can register as resident"
  ON residents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Enable RLS on documents table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Residents can read their own documents
CREATE POLICY "Residents can read own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM residents 
      WHERE residents.id = documents.resident_id 
      AND residents.email = auth.email()
    )
  );

-- Residents can create their own documents
CREATE POLICY "Residents can create own documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM residents 
      WHERE residents.id = documents.resident_id 
      AND residents.email = auth.email()
    )
  );

-- Admins can manage all documents
CREATE POLICY "Admins can manage documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.email() 
      AND role IN ('super-admin', 'barangay-official')
    )
  );

-- Enable RLS on incidents table
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Users can read incidents they reported
CREATE POLICY "Users can read own incidents"
  ON incidents
  FOR SELECT
  TO authenticated
  USING (reporter_email = auth.email());

-- Users can create incidents
CREATE POLICY "Users can create incidents"
  ON incidents
  FOR INSERT
  TO authenticated
  WITH CHECK (reporter_email = auth.email());

-- Admins can manage all incidents
CREATE POLICY "Admins can manage incidents"
  ON incidents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.email() 
      AND role IN ('super-admin', 'barangay-official')
    )
  );

-- Enable RLS on announcements table
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Everyone can read published announcements
CREATE POLICY "Everyone can read published announcements"
  ON announcements
  FOR SELECT
  TO authenticated
  USING (status = 'published');

-- Admins can manage announcements
CREATE POLICY "Admins can manage announcements"
  ON announcements
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.email() 
      AND role IN ('super-admin', 'barangay-official')
    )
  );

-- Enable RLS on appointments table
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Users can read their own appointments
CREATE POLICY "Users can read own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    resident_email = auth.email() OR
    EXISTS (
      SELECT 1 FROM residents 
      WHERE residents.id = appointments.resident_id 
      AND residents.email = auth.email()
    )
  );

-- Users can create their own appointments
CREATE POLICY "Users can create own appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    resident_email = auth.email() OR
    EXISTS (
      SELECT 1 FROM residents 
      WHERE residents.id = appointments.resident_id 
      AND residents.email = auth.email()
    )
  );

-- Medical staff and admins can manage all appointments
CREATE POLICY "Medical staff can manage appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.email() 
      AND role IN ('super-admin', 'barangay-official', 'medical-portal')
    )
  );

-- Enable RLS on other tables with similar patterns
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Basic policies for other tables (can be expanded as needed)
CREATE POLICY "Admins can manage patients"
  ON patients FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.email() 
      AND role IN ('super-admin', 'barangay-official', 'medical-portal')
    )
  );

CREATE POLICY "Medical staff can manage medical records"
  ON medical_records FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.email() 
      AND role IN ('super-admin', 'barangay-official', 'medical-portal')
    )
  );

CREATE POLICY "Medical staff can manage inventory"
  ON inventory_items FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.email() 
      AND role IN ('super-admin', 'barangay-official', 'medical-portal')
    )
  );

CREATE POLICY "Admins can manage projects"
  ON projects FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.email() 
      AND role IN ('super-admin', 'barangay-official')
    )
  );

CREATE POLICY "Everyone can read published projects"
  ON projects FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can manage own business permits"
  ON business_permits FOR SELECT TO authenticated
  USING (owner_email = auth.email());

CREATE POLICY "Users can create business permits"
  ON business_permits FOR INSERT TO authenticated
  WITH CHECK (owner_email = auth.email());

CREATE POLICY "Admins can manage business permits"
  ON business_permits FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.email() 
      AND role IN ('super-admin', 'barangay-official')
    )
  );

CREATE POLICY "Accounting staff can manage transactions"
  ON transactions FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.email() 
      AND role IN ('super-admin', 'barangay-official', 'accounting-portal')
    )
  );

CREATE POLICY "Admins can read audit logs"
  ON audit_logs FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.email() 
      AND role IN ('super-admin', 'barangay-official')
    )
  );

CREATE POLICY "Admins can manage system settings"
  ON system_settings FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.email() 
      AND role = 'super-admin'
    )
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email_role ON users(email, role);
CREATE INDEX IF NOT EXISTS idx_residents_email_verification ON residents(email, verification_status);
CREATE INDEX IF NOT EXISTS idx_documents_resident_status ON documents(resident_id, status);
CREATE INDEX IF NOT EXISTS idx_incidents_reporter_status ON incidents(reporter_email, status);
CREATE INDEX IF NOT EXISTS idx_appointments_resident_date ON appointments(resident_email, appointment_date);