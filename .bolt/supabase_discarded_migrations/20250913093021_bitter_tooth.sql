/*
  # Create incidents table for blotter system

  1. New Tables
    - `incidents`
      - `id` (uuid, primary key)
      - `incident_type` (text, required)
      - `description` (text, required)
      - `location` (text, required)
      - `reporter_name` (text, required)
      - `reporter_email` (text, required)
      - `reporter_phone` (text, optional)
      - `status` (text, default 'reported')
      - `priority` (text, default 'medium')
      - `assigned_to` (text, optional)
      - `date_submitted` (timestamp, default now)
      - `date_resolved` (timestamp, optional)
      - `resolution_notes` (text, optional)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `incidents` table
    - Add policies for different user roles
    - Residents can create and read own incidents
    - Officials can manage all incidents

  3. Indexes
    - Index on status for filtering
    - Index on incident_type for categorization
    - Index on reporter_email for user lookup
    - Index on date_submitted for chronological ordering
*/

CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_type text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  reporter_name text NOT NULL,
  reporter_email text NOT NULL,
  reporter_phone text,
  status text DEFAULT 'reported' NOT NULL,
  priority text DEFAULT 'medium' NOT NULL,
  assigned_to text,
  date_submitted timestamptz DEFAULT now(),
  date_resolved timestamptz,
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints
ALTER TABLE incidents ADD CONSTRAINT incidents_status_check 
  CHECK (status IN ('reported', 'investigating', 'resolved', 'closed', 'dismissed'));

ALTER TABLE incidents ADD CONSTRAINT incidents_priority_check 
  CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

ALTER TABLE incidents ADD CONSTRAINT incidents_incident_type_check 
  CHECK (incident_type IN ('theft', 'assault', 'vandalism', 'noise_complaint', 'domestic_dispute', 'traffic_accident', 'public_disturbance', 'other'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_type ON incidents(incident_type);
CREATE INDEX IF NOT EXISTS idx_incidents_reporter_email ON incidents(reporter_email);
CREATE INDEX IF NOT EXISTS idx_incidents_date_submitted ON incidents(date_submitted);
CREATE INDEX IF NOT EXISTS idx_incidents_assigned_to ON incidents(assigned_to);

-- Enable Row Level Security
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Residents can create incidents"
  ON incidents
  FOR INSERT
  TO authenticated
  WITH CHECK (reporter_email = email());

CREATE POLICY "Residents can read own incidents"
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

CREATE POLICY "Medical and disaster staff can read incidents"
  ON incidents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = uid()::text
      AND users.role IN ('medical-portal', 'disaster-portal')
    )
  );