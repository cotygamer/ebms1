/*
  # Disable RLS for All Tables

  This migration disables Row Level Security (RLS) for all existing tables in the database.
  This is done to simplify development and testing by removing access restrictions.

  ## Tables Updated:
  1. users - Disable RLS
  2. residents - Disable RLS  
  3. documents - Disable RLS
  4. medical_records - Disable RLS
  5. appointments - Disable RLS
  6. announcements - Disable RLS
  7. family_members - Disable RLS
  8. inventory_items - Disable RLS
  9. projects - Disable RLS
  10. business_documents - Disable RLS
  11. business_permits - Disable RLS
  12. project_achievements - Disable RLS
  13. transactions - Disable RLS
  14. system_settings - Disable RLS
  15. audit_logs - Disable RLS
  16. incidents - Disable RLS
  17. patients - Disable RLS

  ## Security Note:
  RLS is being disabled for development purposes. In production, proper RLS policies should be implemented.
*/

-- Disable RLS for users table
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;

-- Disable RLS for residents table
ALTER TABLE IF EXISTS residents DISABLE ROW LEVEL SECURITY;

-- Disable RLS for documents table
ALTER TABLE IF EXISTS documents DISABLE ROW LEVEL SECURITY;

-- Disable RLS for medical_records table
ALTER TABLE IF EXISTS medical_records DISABLE ROW LEVEL SECURITY;

-- Disable RLS for appointments table
ALTER TABLE IF EXISTS appointments DISABLE ROW LEVEL SECURITY;

-- Disable RLS for announcements table
ALTER TABLE IF EXISTS announcements DISABLE ROW LEVEL SECURITY;

-- Disable RLS for family_members table
ALTER TABLE IF EXISTS family_members DISABLE ROW LEVEL SECURITY;

-- Disable RLS for inventory_items table
ALTER TABLE IF EXISTS inventory_items DISABLE ROW LEVEL SECURITY;

-- Disable RLS for projects table
ALTER TABLE IF EXISTS projects DISABLE ROW LEVEL SECURITY;

-- Disable RLS for business_documents table
ALTER TABLE IF EXISTS business_documents DISABLE ROW LEVEL SECURITY;

-- Disable RLS for business_permits table
ALTER TABLE IF EXISTS business_permits DISABLE ROW LEVEL SECURITY;

-- Disable RLS for project_achievements table
ALTER TABLE IF EXISTS project_achievements DISABLE ROW LEVEL SECURITY;

-- Disable RLS for transactions table
ALTER TABLE IF EXISTS transactions DISABLE ROW LEVEL SECURITY;

-- Disable RLS for system_settings table
ALTER TABLE IF EXISTS system_settings DISABLE ROW LEVEL SECURITY;

-- Disable RLS for audit_logs table
ALTER TABLE IF EXISTS audit_logs DISABLE ROW LEVEL SECURITY;

-- Disable RLS for incidents table
ALTER TABLE IF EXISTS incidents DISABLE ROW LEVEL SECURITY;

-- Disable RLS for patients table
ALTER TABLE IF EXISTS patients DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies to clean up
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies from all tables
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;