/*
  # Complete Registration System Setup

  1. New Tables
    - `incidents` - For incident reporting system
    - `audit_logs` - For system audit trail
  
  2. Security Policies
    - Allow anonymous registration on residents table
    - Proper RLS policies for all tables
    
  3. Fixes
    - Registration form database compatibility
    - Missing table errors
    - RLS policy violations
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
  updated_at timestamptz DEFAULT now()
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

-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
  -- Drop residents policies
  DROP POLICY IF EXISTS "Allow anonymous registration" ON residents;
  DROP POLICY IF EXISTS "Allow authenticated registration" ON residents;
  
  -- Drop incidents policies
  DROP POLICY IF EXISTS "Anyone can create incidents" ON incidents;
  DROP POLICY IF EXISTS "Authenticated users can read incidents" ON incidents;
  DROP POLICY IF EXISTS "Officials can update incidents" ON incidents;
  
  -- Drop audit_logs policies
  DROP POLICY IF EXISTS "Admins can read audit logs" ON audit_logs;
  DROP POLICY IF EXISTS "System can create audit logs" ON audit_logs;
END $$;

-- Create new RLS policies for residents
CREATE POLICY "Allow anonymous registration" ON residents
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated registration" ON residents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create RLS policies for incidents
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

-- Create RLS policies for audit_logs
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

-- Add constraints for incidents table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'incidents' AND constraint_name = 'incidents_status_check'
  ) THEN
    ALTER TABLE incidents ADD CONSTRAINT incidents_status_check 
    CHECK (status = ANY (ARRAY['pending'::text, 'investigating'::text, 'resolved'::text, 'dismissed'::text]));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'incidents' AND constraint_name = 'incidents_priority_check'
  ) THEN
    ALTER TABLE incidents ADD CONSTRAINT incidents_priority_check 
    CHECK (priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]));
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_priority ON incidents(priority);
CREATE INDEX IF NOT EXISTS idx_incidents_date_submitted ON incidents(date_submitted);
CREATE INDEX IF NOT EXISTS idx_incidents_reporter_email ON incidents(reporter_email);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);