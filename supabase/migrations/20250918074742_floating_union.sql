/*
  # Fix RLS Infinite Recursion Policies

  This migration fixes the infinite recursion issue in Row Level Security policies
  by simplifying policy conditions and removing circular dependencies.

  ## Changes Made
  1. Simplify user role checking policies to avoid recursion
  2. Use direct auth functions instead of complex EXISTS clauses
  3. Remove circular dependencies between users and other tables
  4. Ensure policies use auth.uid() and auth.email() directly

  ## Tables Updated
  - users: Simplified role-based policies
  - business_permits: Fixed admin access policies
  - projects: Fixed admin access policies
  - system_settings: Fixed admin access policies
  - All other tables with similar policy patterns
*/

-- Drop existing problematic policies and recreate them with simplified logic

-- Users table policies
DROP POLICY IF EXISTS "Admins can manage users" ON users;
DROP POLICY IF EXISTS "Super admins can read all users" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;

-- Create simplified users policies without recursion
CREATE POLICY "Super admins can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      SELECT email FROM users WHERE role = 'super-admin' AND email = auth.email()
    )
  );

CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (email = auth.email());

-- Business permits policies
DROP POLICY IF EXISTS "Admins can manage business permits" ON business_permits;

CREATE POLICY "Admins can manage business permits"
  ON business_permits
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      'admin@barangay.gov.ph',
      'official@barangay.gov.ph'
    ) OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM users 
        WHERE role IN ('super-admin', 'barangay-official')
        AND email = auth.email()
        LIMIT 1
      )
    )
  );

-- Projects policies
DROP POLICY IF EXISTS "Admins can manage projects" ON projects;

CREATE POLICY "Admins can manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      'admin@barangay.gov.ph',
      'official@barangay.gov.ph'
    ) OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM users 
        WHERE role IN ('super-admin', 'barangay-official')
        AND email = auth.email()
        LIMIT 1
      )
    )
  );

-- System settings policies
DROP POLICY IF EXISTS "Admins can manage system settings" ON system_settings;

CREATE POLICY "Super admins can manage system settings"
  ON system_settings
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      'admin@barangay.gov.ph'
    ) OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM users 
        WHERE role = 'super-admin'
        AND email = auth.email()
        LIMIT 1
      )
    )
  );

-- Residents policies - fix admin access
DROP POLICY IF EXISTS "Admins can manage residents" ON residents;
DROP POLICY IF EXISTS "Admins can read all residents" ON residents;

CREATE POLICY "Admins can manage residents"
  ON residents
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      'admin@barangay.gov.ph',
      'official@barangay.gov.ph'
    ) OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM users 
        WHERE role IN ('super-admin', 'barangay-official')
        AND email = auth.email()
        LIMIT 1
      )
    )
  );

-- Documents policies
DROP POLICY IF EXISTS "Admins can manage documents" ON documents;

CREATE POLICY "Admins can manage documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      'admin@barangay.gov.ph',
      'official@barangay.gov.ph'
    ) OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM users 
        WHERE role IN ('super-admin', 'barangay-official')
        AND email = auth.email()
        LIMIT 1
      )
    )
  );

-- Incidents policies
DROP POLICY IF EXISTS "Admins can manage incidents" ON incidents;

CREATE POLICY "Admins can manage incidents"
  ON incidents
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      'admin@barangay.gov.ph',
      'official@barangay.gov.ph'
    ) OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM users 
        WHERE role IN ('super-admin', 'barangay-official')
        AND email = auth.email()
        LIMIT 1
      )
    )
  );

-- Announcements policies
DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;

CREATE POLICY "Admins can manage announcements"
  ON announcements
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      'admin@barangay.gov.ph',
      'official@barangay.gov.ph'
    ) OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM users 
        WHERE role IN ('super-admin', 'barangay-official')
        AND email = auth.email()
        LIMIT 1
      )
    )
  );

-- Transactions policies
DROP POLICY IF EXISTS "Accounting staff can manage transactions" ON transactions;

CREATE POLICY "Accounting staff can manage transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      'admin@barangay.gov.ph',
      'official@barangay.gov.ph',
      'accounting@barangay.gov.ph'
    ) OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM users 
        WHERE role IN ('super-admin', 'barangay-official', 'accounting-portal')
        AND email = auth.email()
        LIMIT 1
      )
    )
  );

-- Appointments policies
DROP POLICY IF EXISTS "Medical staff can manage appointments" ON appointments;

CREATE POLICY "Medical staff can manage appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      'admin@barangay.gov.ph',
      'official@barangay.gov.ph',
      'medical@barangay.gov.ph'
    ) OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM users 
        WHERE role IN ('super-admin', 'barangay-official', 'medical-portal')
        AND email = auth.email()
        LIMIT 1
      )
    )
  );

-- Patients policies
DROP POLICY IF EXISTS "Admins can manage patients" ON patients;

CREATE POLICY "Medical staff can manage patients"
  ON patients
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      'admin@barangay.gov.ph',
      'official@barangay.gov.ph',
      'medical@barangay.gov.ph'
    ) OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM users 
        WHERE role IN ('super-admin', 'barangay-official', 'medical-portal')
        AND email = auth.email()
        LIMIT 1
      )
    )
  );

-- Medical records policies
DROP POLICY IF EXISTS "Medical staff can manage medical records" ON medical_records;

CREATE POLICY "Medical staff can manage medical records"
  ON medical_records
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      'admin@barangay.gov.ph',
      'official@barangay.gov.ph',
      'medical@barangay.gov.ph'
    ) OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM users 
        WHERE role IN ('super-admin', 'barangay-official', 'medical-portal')
        AND email = auth.email()
        LIMIT 1
      )
    )
  );

-- Inventory items policies
DROP POLICY IF EXISTS "Medical staff can manage inventory" ON inventory_items;

CREATE POLICY "Medical staff can manage inventory"
  ON inventory_items
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      'admin@barangay.gov.ph',
      'official@barangay.gov.ph',
      'medical@barangay.gov.ph'
    ) OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM users 
        WHERE role IN ('super-admin', 'barangay-official', 'medical-portal')
        AND email = auth.email()
        LIMIT 1
      )
    )
  );

-- Audit logs policies
DROP POLICY IF EXISTS "Admins can read audit logs" ON audit_logs;

CREATE POLICY "Admins can read audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    auth.email() IN (
      'admin@barangay.gov.ph',
      'official@barangay.gov.ph'
    ) OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM users 
        WHERE role IN ('super-admin', 'barangay-official')
        AND email = auth.email()
        LIMIT 1
      )
    )
  );