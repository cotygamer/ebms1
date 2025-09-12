/*
  # Business Portal Database Schema

  1. New Tables
    - `business_permits`
      - `id` (uuid, primary key)
      - `business_name` (text)
      - `owner_name` (text)
      - `business_type` (text)
      - `address` (text)
      - `contact_info` (jsonb)
      - `permit_type` (text)
      - `application_status` (text)
      - `documents` (jsonb)
      - `fees` (jsonb)
      - `payment_status` (text)
      - `approval_date` (date)
      - `expiry_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `business_documents`
      - `id` (uuid, primary key)
      - `permit_id` (uuid, foreign key)
      - `document_type` (text)
      - `file_url` (text)
      - `file_name` (text)
      - `file_size` (integer)
      - `upload_date` (timestamp)
      - `verification_status` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for business owners and officials
*/

CREATE TABLE IF NOT EXISTS business_permits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  owner_name text NOT NULL,
  owner_email text NOT NULL,
  business_type text NOT NULL,
  address text NOT NULL,
  contact_info jsonb DEFAULT '{}',
  permit_type text NOT NULL DEFAULT 'new',
  application_status text NOT NULL DEFAULT 'pending',
  documents jsonb DEFAULT '[]',
  fees jsonb DEFAULT '{}',
  payment_status text NOT NULL DEFAULT 'unpaid',
  approval_date date,
  expiry_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS business_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  permit_id uuid NOT NULL REFERENCES business_permits(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size integer DEFAULT 0,
  upload_date timestamptz DEFAULT now(),
  verification_status text DEFAULT 'pending',
  verified_by text,
  verified_at timestamptz,
  notes text
);

-- Enable RLS
ALTER TABLE business_permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_documents ENABLE ROW LEVEL SECURITY;

-- Business Permits Policies
CREATE POLICY "Business owners can read own permits"
  ON business_permits
  FOR SELECT
  TO authenticated
  USING (owner_email = auth.email());

CREATE POLICY "Business owners can create permits"
  ON business_permits
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_email = auth.email());

CREATE POLICY "Business owners can update own permits"
  ON business_permits
  FOR UPDATE
  TO authenticated
  USING (owner_email = auth.email());

CREATE POLICY "Officials can manage all permits"
  ON business_permits
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id::text = uid()::text
    AND users.role IN ('super-admin', 'barangay-official')
  ));

-- Business Documents Policies
CREATE POLICY "Business owners can manage own documents"
  ON business_documents
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM business_permits
    WHERE business_permits.id = business_documents.permit_id
    AND business_permits.owner_email = auth.email()
  ));

CREATE POLICY "Officials can manage all documents"
  ON business_documents
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id::text = uid()::text
    AND users.role IN ('super-admin', 'barangay-official')
  ));

-- Add constraints
ALTER TABLE business_permits ADD CONSTRAINT business_permits_application_status_check 
  CHECK (application_status IN ('pending', 'under-review', 'approved', 'rejected', 'expired'));

ALTER TABLE business_permits ADD CONSTRAINT business_permits_payment_status_check 
  CHECK (payment_status IN ('unpaid', 'paid', 'refunded'));

ALTER TABLE business_permits ADD CONSTRAINT business_permits_permit_type_check 
  CHECK (permit_type IN ('new', 'renewal', 'amendment'));

ALTER TABLE business_documents ADD CONSTRAINT business_documents_verification_status_check 
  CHECK (verification_status IN ('pending', 'verified', 'rejected'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_business_permits_owner_email ON business_permits(owner_email);
CREATE INDEX IF NOT EXISTS idx_business_permits_status ON business_permits(application_status);
CREATE INDEX IF NOT EXISTS idx_business_permits_payment ON business_permits(payment_status);
CREATE INDEX IF NOT EXISTS idx_business_documents_permit_id ON business_documents(permit_id);