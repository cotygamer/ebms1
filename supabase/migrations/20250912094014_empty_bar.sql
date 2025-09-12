/*
  # Security Portal Database Schema

  1. New Tables
    - `incident_reports`
      - `id` (uuid, primary key)
      - `incident_type` (text)
      - `description` (text)
      - `location` (text)
      - `date_time` (timestamp)
      - `reporter_name` (text)
      - `reporter_contact` (text)
      - `status` (text)
      - `priority` (text)
      - `assigned_officer` (text)
      - `evidence` (jsonb)
      - `resolution` (text)
      - `created_at` (timestamp)

    - `blotter_entries`
      - `id` (uuid, primary key)
      - `case_number` (text, unique)
      - `complainant` (jsonb)
      - `respondent` (jsonb)
      - `incident_details` (text)
      - `incident_date` (date)
      - `location` (text)
      - `status` (text)
      - `officer_on_duty` (text)
      - `witnesses` (jsonb)
      - `evidence` (jsonb)
      - `resolution` (text)
      - `created_at` (timestamp)

    - `security_personnel`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `badge_number` (text, unique)
      - `rank` (text)
      - `assignment` (text)
      - `shift_schedule` (jsonb)
      - `contact_info` (jsonb)
      - `status` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for security personnel and officials
*/

CREATE TABLE IF NOT EXISTS incident_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_type text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  incident_date_time timestamptz NOT NULL,
  reporter_name text NOT NULL,
  reporter_contact text NOT NULL,
  reporter_address text,
  status text NOT NULL DEFAULT 'reported',
  priority text NOT NULL DEFAULT 'medium',
  assigned_officer text,
  evidence jsonb DEFAULT '[]',
  resolution text,
  follow_up_required boolean DEFAULT false,
  follow_up_date date,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blotter_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number text UNIQUE NOT NULL,
  complainant jsonb NOT NULL,
  respondent jsonb NOT NULL,
  incident_details text NOT NULL,
  incident_date date NOT NULL,
  incident_time time,
  location text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  officer_on_duty text NOT NULL,
  witnesses jsonb DEFAULT '[]',
  evidence jsonb DEFAULT '[]',
  resolution text,
  case_type text NOT NULL,
  severity text NOT NULL DEFAULT 'minor',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS security_personnel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  badge_number text UNIQUE NOT NULL,
  rank text NOT NULL,
  assignment text NOT NULL,
  shift_schedule jsonb DEFAULT '{}',
  contact_info jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'active',
  hire_date date NOT NULL,
  emergency_contact jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blotter_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_personnel ENABLE ROW LEVEL SECURITY;

-- Incident Reports Policies
CREATE POLICY "Security personnel can manage incident reports"
  ON incident_reports
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id::text = uid()::text
    AND users.role IN ('super-admin', 'barangay-official', 'security-personnel')
  ));

CREATE POLICY "Residents can create incident reports"
  ON incident_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Residents can read own reports"
  ON incident_reports
  FOR SELECT
  TO authenticated
  USING (reporter_contact = (SELECT phone_number FROM users WHERE users.id::text = uid()::text));

-- Blotter Entries Policies
CREATE POLICY "Security personnel can manage blotter entries"
  ON blotter_entries
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id::text = uid()::text
    AND users.role IN ('super-admin', 'barangay-official', 'security-personnel')
  ));

-- Security Personnel Policies
CREATE POLICY "Security personnel can read own data"
  ON security_personnel
  FOR SELECT
  TO authenticated
  USING (user_id::text = uid()::text);

CREATE POLICY "Officials can manage security personnel"
  ON security_personnel
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id::text = uid()::text
    AND users.role IN ('super-admin', 'barangay-official')
  ));

-- Add constraints
ALTER TABLE incident_reports ADD CONSTRAINT incident_reports_status_check 
  CHECK (status IN ('reported', 'investigating', 'resolved', 'closed'));

ALTER TABLE incident_reports ADD CONSTRAINT incident_reports_priority_check 
  CHECK (priority IN ('low', 'medium', 'high', 'critical'));

ALTER TABLE blotter_entries ADD CONSTRAINT blotter_entries_status_check 
  CHECK (status IN ('active', 'resolved', 'dismissed', 'referred'));

ALTER TABLE blotter_entries ADD CONSTRAINT blotter_entries_case_type_check 
  CHECK (case_type IN ('civil', 'criminal', 'administrative', 'domestic', 'noise', 'property', 'other'));

ALTER TABLE blotter_entries ADD CONSTRAINT blotter_entries_severity_check 
  CHECK (severity IN ('minor', 'moderate', 'major', 'critical'));

ALTER TABLE security_personnel ADD CONSTRAINT security_personnel_status_check 
  CHECK (status IN ('active', 'inactive', 'suspended', 'terminated'));

ALTER TABLE security_personnel ADD CONSTRAINT security_personnel_rank_check 
  CHECK (rank IN ('security-guard', 'senior-guard', 'supervisor', 'chief-security'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_incident_reports_status ON incident_reports(status);
CREATE INDEX IF NOT EXISTS idx_incident_reports_priority ON incident_reports(priority);
CREATE INDEX IF NOT EXISTS idx_incident_reports_date ON incident_reports(incident_date_time);
CREATE INDEX IF NOT EXISTS idx_blotter_entries_case_number ON blotter_entries(case_number);
CREATE INDEX IF NOT EXISTS idx_blotter_entries_status ON blotter_entries(status);
CREATE INDEX IF NOT EXISTS idx_blotter_entries_date ON blotter_entries(incident_date);
CREATE INDEX IF NOT EXISTS idx_security_personnel_badge ON security_personnel(badge_number);