/*
  # Fix Missing Incidents Table and RLS Policies

  1. New Tables
    - `incidents`
      - `id` (uuid, primary key)
      - `reporter_name` (text)
      - `reporter_email` (text)
      - `reporter_phone` (text, optional)
      - `incident_type` (text)
      - `subject` (text)
      - `description` (text)
      - `status` (text, default 'pending')
      - `priority` (text, default 'medium')
      - `location` (text, optional)
      - `date_occurred` (date, optional)
      - `time_occurred` (time, optional)
      - `witness_name` (text, optional)
      - `witness_contact` (text, optional)
      - `assigned_to` (text, optional)
      - `resolution` (text, optional)
      - `date_submitted` (date, default current date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `audit_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, optional)
      - `action_type` (text)
      - `resource_type` (text)
      - `resource_id` (text)
      - `old_value` (jsonb, optional)
      - `new_value` (jsonb, optional)
      - `timestamp` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Allow anonymous users to create residents (for registration)
    - Allow anonymous users to create incidents (for reporting)
    - Proper access policies for authenticated users

  3. Performance
    - Add indexes for frequently queried columns
    - Optimize for real-time subscriptions
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
  updated_at timestamptz DEFAULT now()
);

-- Add constraints for incidents
ALTER TABLE incidents ADD CONSTRAINT incidents_status_check 
  CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed'));

ALTER TABLE incidents ADD CONSTRAINT incidents_priority_check 
  CHECK (priority IN ('low', 'medium', 'high'));

-- Create indexes for incidents
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_priority ON incidents(priority);
CREATE INDEX IF NOT EXISTS idx_incidents_date_submitted ON incidents(date_submitted);
CREATE INDEX IF NOT EXISTS idx_incidents_reporter_email ON incidents(reporter_email);

-- Enable RLS on incidents
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

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

-- Create index for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- Enable RLS on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for residents table (fix registration issue)
-- Allow anonymous users to create residents (for registration)
CREATE POLICY "Allow anonymous registration"
  ON residents
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read their own data
CREATE POLICY "Users can read own resident data"
  ON residents
  FOR SELECT
  TO authenticated
  USING (user_id::text = auth.uid()::text OR auth.uid()::text IN (
    SELECT id::text FROM users WHERE role IN ('super-admin', 'barangay-official')
  ));

-- Allow authenticated users to update their own data
CREATE POLICY "Users can update own resident data"
  ON residents
  FOR UPDATE
  TO authenticated
  USING (user_id::text = auth.uid()::text)
  WITH CHECK (user_id::text = auth.uid()::text);

-- RLS Policies for incidents table
-- Allow anyone (including anonymous) to create incidents
CREATE POLICY "Anyone can create incidents"
  ON incidents
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read incidents
CREATE POLICY "Authenticated users can read incidents"
  ON incidents
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow officials to update incidents
CREATE POLICY "Officials can update incidents"
  ON incidents
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text IN (
    SELECT id::text FROM users WHERE role IN ('super-admin', 'barangay-official')
  ))
  WITH CHECK (auth.uid()::text IN (
    SELECT id::text FROM users WHERE role IN ('super-admin', 'barangay-official')
  ));

-- RLS Policies for audit_logs table
-- Only admins can read audit logs
CREATE POLICY "Admins can read audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text IN (
    SELECT id::text FROM users WHERE role IN ('super-admin', 'barangay-official')
  ));

-- Allow system to create audit logs
CREATE POLICY "System can create audit logs"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);