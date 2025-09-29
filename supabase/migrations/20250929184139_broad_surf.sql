/*
  # Enhance messages table for comprehensive messaging system

  1. Table Structure
    - Add required columns for sender information
    - Add subject, category, priority, status fields
    - Add reply functionality columns
    - Add source tracking

  2. Security
    - Update RLS policies for proper access control
    - Allow public to insert messages (contact form)
    - Allow authenticated users to read their own messages
    - Allow officials to read and reply to all messages

  3. Indexes
    - Add indexes for performance optimization
*/

-- Add missing columns to existing messages table
DO $$
BEGIN
  -- Add sender_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'sender_name'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN sender_name text NOT NULL DEFAULT 'Anonymous';
  END IF;

  -- Add sender_email column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'sender_email'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN sender_email text NOT NULL DEFAULT 'unknown@example.com';
  END IF;

  -- Add sender_phone column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'sender_phone'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN sender_phone text;
  END IF;

  -- Add subject column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'subject'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN subject text NOT NULL DEFAULT 'No Subject';
  END IF;

  -- Rename content to message if content exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'content'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'message'
  ) THEN
    ALTER TABLE public.messages RENAME COLUMN content TO message;
  END IF;

  -- Add message column if it doesn't exist and content doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'message'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'content'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN message text NOT NULL DEFAULT '';
  END IF;

  -- Add category column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'category'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN category text NOT NULL DEFAULT 'general';
  END IF;

  -- Add priority column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'priority'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN priority text NOT NULL DEFAULT 'medium';
  END IF;

  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN status text NOT NULL DEFAULT 'unread';
  END IF;

  -- Add source column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'source'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN source text NOT NULL DEFAULT 'website';
  END IF;

  -- Add replied_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'replied_at'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN replied_at timestamp with time zone;
  END IF;

  -- Add replied_by column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'replied_by'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN replied_by text;
  END IF;

  -- Add reply column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'reply'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN reply text;
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN updated_at timestamp with time zone DEFAULT now();
  END IF;
END $$;

-- Add constraints for data validation
DO $$
BEGIN
  -- Add category constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'messages' AND constraint_name = 'messages_category_check'
  ) THEN
    ALTER TABLE public.messages ADD CONSTRAINT messages_category_check 
    CHECK (category IN ('general', 'complaint', 'suggestion', 'inquiry', 'emergency'));
  END IF;

  -- Add priority constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'messages' AND constraint_name = 'messages_priority_check'
  ) THEN
    ALTER TABLE public.messages ADD CONSTRAINT messages_priority_check 
    CHECK (priority IN ('low', 'medium', 'high'));
  END IF;

  -- Add status constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'messages' AND constraint_name = 'messages_status_check'
  ) THEN
    ALTER TABLE public.messages ADD CONSTRAINT messages_status_check 
    CHECK (status IN ('unread', 'read', 'replied', 'archived'));
  END IF;
END $$;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Allow insert for all" ON public.messages;
DROP POLICY IF EXISTS "Allow select for all" ON public.messages;

-- Create comprehensive RLS policies
CREATE POLICY "Anyone can send messages"
  ON public.messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read own messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (sender_email = auth.email());

CREATE POLICY "Officials can read all messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (
    auth.email() IN (
      SELECT email FROM users 
      WHERE role IN ('super-admin', 'barangay-official')
    )
  );

CREATE POLICY "Officials can update messages"
  ON public.messages
  FOR UPDATE
  TO authenticated
  USING (
    auth.email() IN (
      SELECT email FROM users 
      WHERE role IN ('super-admin', 'barangay-official')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_email ON public.messages(sender_email);
CREATE INDEX IF NOT EXISTS idx_messages_status ON public.messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_category ON public.messages(category);
CREATE INDEX IF NOT EXISTS idx_messages_priority ON public.messages(priority);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- Insert a test message to verify the table works
INSERT INTO public.messages (
  sender_name,
  sender_email,
  sender_phone,
  subject,
  message,
  category,
  priority,
  status,
  source,
  created_at,
  updated_at
) VALUES (
  'System Test',
  'test@example.com',
  '+63 912 345 6789',
  'Test Message - System Verification',
  'This is a test message to verify the messaging system is working correctly. You can safely delete this message.',
  'general',
  'low',
  'unread',
  'system',
  now(),
  now()
) ON CONFLICT DO NOTHING;