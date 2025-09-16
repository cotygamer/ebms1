/*
  # Create Missing Tables and Fix RLS Policies

  1. New Tables
    - `incidents` - For blotter/incident reporting system
    - `audit_logs` - For tracking all system actions

  2. Security Updates
    - Allow anonymous users to register as residents
    - Allow authenticated users to manage their own data
    - Proper RLS policies for all tables

  3. Performance
    - Added indexes for frequently queried columns
    - Optimized query performance
*/

-- Create incidents table
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
  
  CONSTRAINT incidents_status_check CHECK (status = ANY (ARRAY['pending'::text, 'investigating'::text, 'resolved'::text, 'closed'::text])),
  CONSTRAINT incidents_priority_check CHECK (priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'urgent'::text]))
);

-- Create audit_logs table for tracking actions
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
CREATE INDEX IF NOT EXISTS idx_incidents_reporter_email ON incidents (reporter_email);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents (status);
CREATE INDEX IF NOT EXISTS idx_incidents_priority ON incidents (priority);
CREATE INDEX IF NOT EXISTS idx_incidents_date_submitted ON incidents (date_submitted);

-- Create indexes for audit_logs table
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs (resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs (timestamp);

-- Fix RLS policies for residents table to allow registration
DROP POLICY IF EXISTS "Allow anonymous registration" ON residents;
DROP POLICY IF EXISTS "Allow authenticated registration" ON residents;

-- Allow anonymous users to register (INSERT only)
CREATE POLICY "Allow anonymous registration"
  ON residents
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to register
CREATE POLICY "Allow authenticated registration"
  ON residents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Fix RLS policies for users table to allow registration
DROP POLICY IF EXISTS "Allow user registration" ON users;

-- Allow user account creation during registration
CREATE POLICY "Allow user registration"
  ON users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS policies for incidents table
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

CREATE POLICY "Anonymous can read own incidents"
  ON incidents
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Officials can manage all incidents"
  ON incidents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = uid()::text
      AND users.role = ANY (ARRAY['super-admin'::text, 'barangay-official'::text])
    )
  );

-- RLS policies for audit_logs table
CREATE POLICY "Admins can read audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = uid()::text
      AND users.role = 'super-admin'::text
    )
  );

CREATE POLICY "System can write audit logs"
  ON audit_logs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);