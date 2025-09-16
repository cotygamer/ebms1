/*
  # Add Peace & Order Portal Role

  1. Updates
    - Add 'peace-order-portal' to users role check constraint
    - This allows creation of peace & order staff accounts

  2. Security
    - Maintains existing RLS policies
    - Peace & order staff will have same permissions as other portal staff
*/

-- Add peace-order-portal to the role check constraint
DO $$
BEGIN
  -- Drop the existing constraint
  ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
  
  -- Add the new constraint with peace-order-portal included
  ALTER TABLE users ADD CONSTRAINT users_role_check 
    CHECK (role = ANY (ARRAY['super-admin'::text, 'barangay-official'::text, 'resident'::text, 'medical-portal'::text, 'accounting-portal'::text, 'disaster-portal'::text, 'peace-order-portal'::text]));
END $$;