/*
  # Fix Registration and Incidents Table Issues

  1. Create Missing Tables
    - `incidents` table for blotter system
    - `audit_logs` table for action logging

  2. Fix RLS Policies
    - Allow anonymous users to register as residents
    - Proper policies for all user roles

  3. Security Updates
    - Enable RLS on all tables
    - Add comprehensive policies for data access
*/

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_type text NOT NULL CHECK (incident_type IN ('noise', 'dispute', 'theft', 'violence', 'vandalism', 'other')),
  description text NOT NULL,
  location text NOT NULL,
  incident_date date NOT NULL DEFAULT CURRENT_DATE,
  incident_time time,
  reporter_name text NOT NULL,
  reporter_email text NOT NULL,
  reporter_phone text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'closed')),
  assigned_to text,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  notes text,
  resolution text,
  resolved_date date,
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

-- Enable RLS on incidents table
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Enable RLS on audit_logs table
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes for incidents
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_type ON incidents(incident_type);
CREATE INDEX IF NOT EXISTS idx_incidents_date ON incidents(incident_date);
CREATE INDEX IF NOT EXISTS idx_incidents_reporter_email ON incidents(reporter_email);

-- Create indexes for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Fix residents table RLS policies
DROP POLICY IF EXISTS "Allow anonymous registration" ON residents;
DROP POLICY IF EXISTS "Users can register as residents" ON residents;

-- Allow anonymous users to register (INSERT only)
CREATE POLICY "Allow anonymous registration"
  ON residents
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to register
CREATE POLICY "Users can register as residents"
  ON residents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Incidents table policies
CREATE POLICY "Anyone can report incidents"
  ON incidents
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read own incidents"
  ON incidents
  FOR SELECT
  TO authenticated
  USING (reporter_email = email());

CREATE POLICY "Officials can manage all incidents"
  ON incidents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = uid()::text
      AND users.role IN ('super-admin', 'barangay-official')
    )
  );

-- Audit logs policies
CREATE POLICY "Admins can read audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = uid()::text
      AND users.role = 'super-admin'
    )
  );

CREATE POLICY "System can write audit logs"
  ON audit_logs
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Fix users table policies for registration
DROP POLICY IF EXISTS "Allow user registration" ON users;

CREATE POLICY "Allow user registration"
  ON users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);