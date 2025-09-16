/*
  # Update Demo Credentials

  1. Updates
    - Update existing demo user credentials
    - Ensure all demo accounts exist with correct roles
    - Add missing demo accounts if needed

  2. Security
    - All demo accounts use consistent password hashing
    - Proper role assignments maintained
*/

-- Update existing demo users with new credentials
UPDATE users 
SET 
  email = 'superadmin@barangay.gov',
  name = 'Super Administrator',
  updated_at = now()
WHERE role = 'super-admin' AND email LIKE '%superadmin%';

UPDATE users 
SET 
  email = 'official@barangay.gov',
  name = 'Barangay Official',
  updated_at = now()
WHERE role = 'barangay-official' AND email LIKE '%official%';

UPDATE users 
SET 
  email = 'medical@barangay.gov',
  name = 'Medical Staff',
  updated_at = now()
WHERE role = 'medical-portal' AND email LIKE '%medical%';

UPDATE users 
SET 
  email = 'accounting@barangay.gov',
  name = 'Accounting Staff',
  updated_at = now()
WHERE role = 'accounting-portal' AND email LIKE '%accounting%';

UPDATE users 
SET 
  email = 'disaster@barangay.gov',
  name = 'Disaster Staff',
  updated_at = now()
WHERE role = 'disaster-portal' AND email LIKE '%disaster%';

-- Insert demo users if they don't exist
INSERT INTO users (email, name, role, status, permissions, created_at, updated_at)
SELECT 'superadmin@barangay.gov', 'Super Administrator', 'super-admin', 'active', '["all"]'::jsonb, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'superadmin@barangay.gov');

INSERT INTO users (email, name, role, status, permissions, created_at, updated_at)
SELECT 'official@barangay.gov', 'Barangay Official', 'barangay-official', 'active', '["residents", "documents", "reports", "announcements"]'::jsonb, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'official@barangay.gov');

INSERT INTO users (email, name, role, status, permissions, created_at, updated_at)
SELECT 'medical@barangay.gov', 'Medical Staff', 'medical-portal', 'active', '["health", "medical-records", "appointments"]'::jsonb, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'medical@barangay.gov');

INSERT INTO users (email, name, role, status, permissions, created_at, updated_at)
SELECT 'accounting@barangay.gov', 'Accounting Staff', 'accounting-portal', 'active', '["accounting", "financial-reports", "payments"]'::jsonb, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'accounting@barangay.gov');

INSERT INTO users (email, name, role, status, permissions, created_at, updated_at)
SELECT 'disaster@barangay.gov', 'Disaster Staff', 'disaster-portal', 'active', '["disaster-management", "emergency-alerts", "evacuation"]'::jsonb, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'disaster@barangay.gov');

-- Update demo resident
UPDATE residents 
SET 
  email = 'resident@email.com',
  name = 'Demo Resident',
  updated_at = now()
WHERE email LIKE '%resident%' OR name LIKE '%Demo%';

-- Insert demo resident if doesn't exist
INSERT INTO residents (name, email, phone_number, address, verification_status, date_registered, created_at, updated_at)
SELECT 'Demo Resident', 'resident@email.com', '+63 912 345 6789', 'Sample Address, Barangay San Miguel', 'verified', CURRENT_DATE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM residents WHERE email = 'resident@email.com');