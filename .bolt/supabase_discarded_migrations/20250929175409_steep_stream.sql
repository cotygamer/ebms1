/*
  # Create messages table for community messaging

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `sender_name` (text, required)
      - `sender_email` (text, required)
      - `sender_phone` (text, optional)
      - `subject` (text, required)
      - `message` (text, required)
      - `category` (text, default 'general')
      - `priority` (text, default 'medium')
      - `status` (text, default 'unread')
      - `source` (text, default 'website')
      - `replied_at` (timestamp, optional)
      - `replied_by` (text, optional)
      - `reply` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `messages` table
    - Add policy for authenticated users to read messages
    - Add policy for officials to manage messages
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  sender_phone text,
  subject text NOT NULL,
  message text NOT NULL,
  category text DEFAULT 'general' CHECK (category IN ('general', 'complaint', 'suggestion', 'inquiry', 'emergency')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  source text DEFAULT 'website' CHECK (source IN ('website', 'portal', 'phone', 'walk-in')),
  replied_at timestamptz,
  replied_by text,
  reply text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create messages (for contact form)
CREATE POLICY "Anyone can create messages"
  ON messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow officials to read and manage all messages
CREATE POLICY "Officials can manage messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (
    (email() = ANY (ARRAY['admin@barangay.gov.ph'::text, 'official@barangay.gov.ph'::text])) OR 
    (EXISTS ( 
      SELECT 1
      FROM auth.users
      WHERE ((users.id = uid()) AND ((users.email)::text IN ( 
        SELECT users_1.email
        FROM users users_1
        WHERE ((users_1.role = ANY (ARRAY['super-admin'::text, 'barangay-official'::text])) AND (users_1.email = email()))
        LIMIT 1
      )))
    ))
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_category ON messages(category);
CREATE INDEX IF NOT EXISTS idx_messages_priority ON messages(priority);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender_email ON messages(sender_email);