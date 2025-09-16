/*
  # Fix Row-Level Security Policies for Residents Table

  1. Security Updates
    - Add policy for anonymous users to insert new resident records during registration
    - Add policy for authenticated users to read their own resident data
    - Ensure proper RLS configuration for registration and login flows

  2. Changes Made
    - Enable RLS on residents table (if not already enabled)
    - Create INSERT policy for public registration
    - Create SELECT policy for users to read their own data
    - Update existing policies to work with auth.email() function
*/

-- Ensure RLS is enabled on residents table
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;

-- Drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Anyone can register as resident" ON residents;
DROP POLICY IF EXISTS "Residents can read own data" ON residents;

-- Create policy for anonymous users to register (INSERT)
CREATE POLICY "Allow public registration"
  ON residents
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy for authenticated users to read their own data (SELECT)
CREATE POLICY "Users can read own resident data"
  ON residents
  FOR SELECT
  TO authenticated
  USING (email = auth.email());

-- Create policy for authenticated users to update their own data (UPDATE)
CREATE POLICY "Users can update own resident data"
  ON residents
  FOR UPDATE
  TO authenticated
  USING (email = auth.email())
  WITH CHECK (email = auth.email());

-- Keep existing admin policies
-- (These should already exist from previous migrations)