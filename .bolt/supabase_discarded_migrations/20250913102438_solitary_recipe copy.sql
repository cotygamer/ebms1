/*
  # Fix Residents Registration RLS Policy

  1. Security Changes
    - Drop existing conflicting policies on residents table
    - Create new policy allowing anonymous registration
    - Ensure authenticated users can also register
    - Maintain existing read policies for users

  2. Policy Details
    - Anonymous users can insert new resident records
    - Authenticated users can insert new resident records
    - Users can read their own resident data
    - Admins and officials can manage all residents
*/

-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Allow anonymous registration" ON residents;
DROP POLICY IF EXISTS "Allow authenticated registration" ON residents;

-- Create a comprehensive policy for registration that allows both anon and authenticated users
CREATE POLICY "Enable registration for all users"
  ON residents
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure users can read their own data (if not already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'residents' 
    AND policyname = 'Users can read own resident data'
  ) THEN
    CREATE POLICY "Users can read own resident data"
      ON residents
      FOR SELECT
      TO authenticated
      USING (user_id::text = uid()::text);
  END IF;
END $$;

-- Ensure admins can manage all residents (if not already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'residents' 
    AND policyname = 'Admins and officials can manage residents'
  ) THEN
    CREATE POLICY "Admins and officials can manage residents"
      ON residents
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id::text = uid()::text
          AND users.role IN ('super-admin', 'barangay-official')
        )
      );
  END IF;
END $$;