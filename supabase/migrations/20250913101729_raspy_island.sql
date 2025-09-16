/*
  # Fix Complete Registration System

  1. Tables Created/Fixed
    - `incidents` table with proper structure
    - `audit_logs` table for system logging
    
  2. RLS Policies Fixed
    - Allow anonymous registration on residents table
    - Proper incident reporting policies
    - Audit logging policies
    
  3. Security
    - Enable RLS on all tables
    - Proper access controls for each user type
*/

-- Create incidents table if it doesn't exist
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_name text NOT NULL,
  reporter_email text NOT NULL,
  reporter_phone text,
  incident_type text NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  priority text DEFAULT 'medium' NOT NULL,
  location text,
  date_occurred date,
  time_occurred time,
  witness_name text,
  witness_contact text,
  assigned_to text,
  resolution text,
  date_submitted date DEFAULT CURRENT_DATE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT incidents_status_check CHECK (status = ANY (ARRAY['pending'::text, 'investigating'::text, 'resolved'::text, 'dismissed'::text])),
  CONSTRAINT incidents_priority_check CHECK (priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]))
);

-- Create audit_logs table if it doesn't exist
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

-- Enable RLS on incidents table
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Enable RLS on audit_logs table
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes for incidents table
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_priority ON incidents(priority);
CREATE INDEX IF NOT EXISTS idx_incidents_date_submitted ON incidents(date_submitted);
CREATE INDEX IF NOT EXISTS idx_incidents_reporter_email ON incidents(reporter_email);

-- Create indexes for audit_logs table
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Drop existing conflicting policies if they exist
DO $$
BEGIN
  -- Drop existing anonymous registration policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'residents' 
    AND policyname = 'Allow anonymous registration'
  ) THEN
    DROP POLICY "Allow anonymous registration" ON residents;
  END IF;
  
  -- Drop existing authenticated registration policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'residents' 
    AND policyname = 'Allow authenticated registration'
  ) THEN
    DROP POLICY "Allow authenticated registration" ON residents;
  END IF;
END $$;

-- Create new RLS policies for residents table
CREATE POLICY "Allow anonymous resident registration" ON residents
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create RLS policies for incidents table
CREATE POLICY "Anyone can create incidents" ON incidents
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read incidents" ON incidents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Officials can update incidents" ON incidents
  FOR UPDATE
  TO authenticated
  USING (
    (uid())::text IN (
      SELECT (users.id)::text
      FROM users
      WHERE users.role = ANY (ARRAY['super-admin'::text, 'barangay-official'::text])
    )
  )
  WITH CHECK (
    (uid())::text IN (
      SELECT (users.id)::text
      FROM users
      WHERE users.role = ANY (ARRAY['super-admin'::text, 'barangay-official'::text])
    )
  );

-- Create RLS policies for audit_logs table
CREATE POLICY "Admins can read audit logs" ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    (uid())::text IN (
      SELECT (users.id)::text
      FROM users
      WHERE users.role = ANY (ARRAY['super-admin'::text, 'barangay-official'::text])
    )
  );

CREATE POLICY "System can create audit logs" ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);