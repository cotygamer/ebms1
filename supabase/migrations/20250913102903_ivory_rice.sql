/*
  # Fix RLS Policy for Registration

  1. Disable RLS temporarily for testing
  2. Re-enable RLS with proper policies
  3. Create policy that allows registration without authentication
  4. Ensure all required fields are handled properly

  This migration fixes the "new row violates row-level security policy" error
  by creating a proper registration policy that allows anonymous users to register.
*/

-- Step 1: Temporarily disable RLS to clear any conflicts
ALTER TABLE residents DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop any existing conflicting policies
DROP POLICY IF EXISTS "Allow anonymous registration" ON residents;
DROP POLICY IF EXISTS "Allow authenticated registration" ON residents;
DROP POLICY IF EXISTS "Enable registration for all users" ON residents;
DROP POLICY IF EXISTS "Allow authenticated insert" ON residents;

-- Step 3: Re-enable RLS
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;

-- Step 4: Create a comprehensive registration policy that works for anonymous users
CREATE POLICY "Enable registration for anonymous and authenticated users"
ON residents
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Step 5: Ensure existing policies for reading data are preserved
DO $$
BEGIN
  -- Only create if it doesn't exist
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
        WHERE users.id::text = auth.uid()::text
        AND users.role = ANY(ARRAY['super-admin', 'barangay-official'])
      )
    );
  END IF;
END $$;

DO $$
BEGIN
  -- Only create if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'residents' 
    AND policyname = 'Residents can read own data'
  ) THEN
    CREATE POLICY "Residents can read own data"
    ON residents
    FOR SELECT
    TO authenticated
    USING (user_id::text = auth.uid()::text);
  END IF;
END $$;

DO $$
BEGIN
  -- Only create if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'residents' 
    AND policyname = 'Users can update own resident data'
  ) THEN
    CREATE POLICY "Users can update own resident data"
    ON residents
    FOR UPDATE
    TO authenticated
    USING (user_id::text = auth.uid()::text)
    WITH CHECK (user_id::text = auth.uid()::text);
  END IF;
END $$;