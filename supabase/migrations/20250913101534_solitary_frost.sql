/*
  # Fix Registration RLS Policy

  1. Security Updates
    - Add policy to allow anonymous users to insert into residents table
    - Ensure registration works without authentication
    - Maintain data security while allowing public registration

  2. Changes
    - Create policy for anonymous registration
    - Allow public access to create resident records
*/

-- Allow anonymous users to register as residents
CREATE POLICY "Allow anonymous registration" ON residents
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also ensure authenticated users can register
CREATE POLICY "Allow authenticated registration" ON residents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);