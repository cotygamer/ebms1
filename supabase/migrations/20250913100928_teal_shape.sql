/*
  # Create incidents table

  1. New Tables
    - `incidents`
      - `id` (uuid, primary key)
      - `reporter_name` (text, required)
      - `reporter_email` (text, required)
      - `reporter_phone` (text, optional)
      - `incident_type` (text, required - complaint, emergency, report, other)
      - `title` (text, required)
      - `description` (text, required)
      - `location` (text, required)
      - `status` (text, default 'pending' - pending, investigating, resolved, closed)
      - `priority` (text, default 'medium' - low, medium, high, urgent)
      - `assigned_to` (text, optional)
      - `date_submitted` (date, default current date)
      - `date_resolved` (date, optional)
      - `resolution_notes` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `incidents` table
    - Add policy for authenticated users to read all incidents
    - Add policy for anyone to create incidents (for public reporting)
    - Add policy for admins and officials to manage incidents

  3. Indexes
    - Index on reporter_email for faster lookups
    - Index on status for filtering
    - Index on incident_type for categorization
    - Index on date_submitted for chronological ordering
*/

CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_name text NOT NULL,
  reporter_email text NOT NULL,
  reporter_phone text,
  incident_type text NOT NULL DEFAULT 'report',
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  priority text NOT NULL DEFAULT 'medium',
  assigned_to text,
  date_submitted date NOT NULL DEFAULT CURRENT_DATE,
  date_resolved date,
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints
ALTER TABLE incidents ADD CONSTRAINT incidents_incident_type_check 
  CHECK (incident_type = ANY (ARRAY['complaint'::text, 'emergency'::text, 'report'::text, 'other'::text]));

ALTER TABLE incidents ADD CONSTRAINT incidents_status_check 
  CHECK (status = ANY (ARRAY['pending'::text, 'investigating'::text, 'resolved'::text, 'closed'::text]));

ALTER TABLE incidents ADD CONSTRAINT incidents_priority_check 
  CHECK (priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'urgent'::text]));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_incidents_reporter_email ON incidents (reporter_email);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents (status);
CREATE INDEX IF NOT EXISTS idx_incidents_incident_type ON incidents (incident_type);
CREATE INDEX IF NOT EXISTS idx_incidents_date_submitted ON incidents (date_submitted);
CREATE INDEX IF NOT EXISTS idx_incidents_priority ON incidents (priority);

-- Enable RLS
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can create incidents"
  ON incidents
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read incidents"
  ON incidents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and officials can manage incidents"
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

CREATE POLICY "Reporters can read own incidents"
  ON incidents
  FOR SELECT
  TO anon, authenticated
  USING (
    reporter_email = email() OR
    reporter_email IN (
      SELECT email FROM residents WHERE user_id::text = uid()::text
    )
  );