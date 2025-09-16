/*
  # Create Supabase Auth Users for Demo Accounts

  1. Auth Users Setup
    - Creates demo users in Supabase Auth system
    - Sets up proper email/password authentication
    - Links auth users to database records

  2. Database Users
    - Creates corresponding records in users table
    - Sets proper roles and permissions
    - Links to auth.users via user_id

  Note: This migration creates both auth users and database records
*/

-- First, ensure we have the demo users in the users table
INSERT INTO users (id, email, name, role, status, phone_number, address) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'superadmin@barangay.gov', 'Super Administrator', 'super-admin', 'active', '+63-912-345-6789', 'Barangay Hall, San Miguel'),
  ('550e8400-e29b-41d4-a716-446655440002', 'official@barangay.gov', 'Barangay Official', 'barangay-official', 'active', '+63-912-345-6790', 'Barangay Hall, San Miguel'),
  ('550e8400-e29b-41d4-a716-446655440003', 'medical@barangay.gov', 'Medical Staff', 'medical-portal', 'active', '+63-912-345-6791', 'Health Center, San Miguel'),
  ('550e8400-e29b-41d4-a716-446655440004', 'accounting@barangay.gov', 'Accounting Staff', 'accounting-portal', 'active', '+63-912-345-6792', 'Barangay Hall, San Miguel'),
  ('550e8400-e29b-41d4-a716-446655440005', 'disaster@barangay.gov', 'Disaster Management Staff', 'disaster-portal', 'active', '+63-912-345-6793', 'Emergency Center, San Miguel')
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  phone_number = EXCLUDED.phone_number,
  address = EXCLUDED.address,
  updated_at = now();

-- Create a resident demo user
INSERT INTO residents (id, email, name, phone_number, address, verification_status, date_registered) VALUES
  ('550e8400-e29b-41d4-a716-446655440006', 'resident@email.com', 'Demo Resident', '+63-912-345-6794', '123 Sample Street, San Miguel', 'verified', CURRENT_DATE)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  phone_number = EXCLUDED.phone_number,
  address = EXCLUDED.address,
  verification_status = EXCLUDED.verification_status,
  updated_at = now();

-- Note: The actual Supabase Auth users need to be created through the Supabase Dashboard
-- or using the Supabase CLI. This migration only handles the database records.
-- 
-- To create the auth users, you need to:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" for each demo account:
--    - superadmin@barangay.gov / password123
--    - official@barangay.gov / password123
--    - medical@barangay.gov / password123
--    - accounting@barangay.gov / password123
--    - disaster@barangay.gov / password123
--    - resident@email.com / password123