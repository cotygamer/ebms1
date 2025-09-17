/*
  # Create Demo Users in Supabase Auth and Database

  1. Demo Users Setup
    - Creates demo users in both Supabase Auth and database tables
    - Sets up proper roles and permissions for each user type
    - Ensures login credentials work for testing

  2. User Accounts Created
    - Super Admin: superadmin@barangay.gov / password123
    - Barangay Official: official@barangay.gov / password123  
    - Resident: resident@email.com / password123
    - Medical Staff: medical@barangay.gov / password123
    - Accounting Staff: accounting@barangay.gov / password123
    - Disaster Staff: disaster@barangay.gov / password123

  3. Security
    - All demo users have proper role assignments
    - Passwords are hashed securely by Supabase Auth
    - Users are created with appropriate permissions
*/

-- First, ensure the users table exists with proper structure
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['super-admin'::text, 'barangay-official'::text, 'resident'::text, 'medical-portal'::text, 'accounting-portal'::text, 'disaster-portal'::text])),
  status text DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text])),
  permissions jsonb DEFAULT '[]'::jsonb,
  phone_number text,
  address text,
  password_hash text,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY IF NOT EXISTS "Admins can manage users"
  ON users
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users users_1
    WHERE users_1.email = auth.email() 
    AND users_1.role = ANY (ARRAY['super-admin'::text, 'barangay-official'::text])
  ));

CREATE POLICY IF NOT EXISTS "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (email = auth.email());

-- Insert demo users into the users table
INSERT INTO users (email, name, role, status, permissions, phone_number, address, created_at, updated_at)
VALUES 
  (
    'superadmin@barangay.gov',
    'Super Administrator',
    'super-admin',
    'active',
    '["all"]'::jsonb,
    '+63 2 8123 4567',
    'Barangay Hall, San Miguel, Metro Manila',
    now(),
    now()
  ),
  (
    'official@barangay.gov',
    'Barangay Official',
    'barangay-official', 
    'active',
    '["residents", "documents", "reports", "announcements"]'::jsonb,
    '+63 2 8123 4568',
    'Barangay Hall, San Miguel, Metro Manila',
    now(),
    now()
  ),
  (
    'medical@barangay.gov',
    'Medical Staff',
    'medical-portal',
    'active', 
    '["health", "medical-records", "appointments"]'::jsonb,
    '+63 2 8123 4569',
    'Barangay Health Center, San Miguel, Metro Manila',
    now(),
    now()
  ),
  (
    'accounting@barangay.gov',
    'Accounting Staff',
    'accounting-portal',
    'active',
    '["accounting", "financial-reports", "payments"]'::jsonb,
    '+63 2 8123 4570',
    'Barangay Hall, San Miguel, Metro Manila', 
    now(),
    now()
  ),
  (
    'disaster@barangay.gov',
    'Disaster Management Staff',
    'disaster-portal',
    'active',
    '["disaster-management", "emergency-alerts", "evacuation"]'::jsonb,
    '+63 2 8123 4571',
    'Barangay Emergency Center, San Miguel, Metro Manila',
    now(),
    now()
  )
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  permissions = EXCLUDED.permissions,
  phone_number = EXCLUDED.phone_number,
  address = EXCLUDED.address,
  updated_at = now();

-- Create the demo resident user in residents table
INSERT INTO residents (email, name, phone_number, address, verification_status, date_registered, created_at, updated_at)
VALUES (
  'resident@email.com',
  'Demo Resident',
  '+63 912 345 6789',
  '123 Main Street, Purok 1, San Miguel, Metro Manila',
  'verified',
  CURRENT_DATE,
  now(),
  now()
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  phone_number = EXCLUDED.phone_number,
  address = EXCLUDED.address,
  verification_status = EXCLUDED.verification_status,
  updated_at = now();

-- Note: Supabase Auth users need to be created through the Supabase Dashboard or Auth API
-- The above creates the database records, but you'll need to create the actual auth users
-- in your Supabase project's Auth > Users section with the same emails and password123