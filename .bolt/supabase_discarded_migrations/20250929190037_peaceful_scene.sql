/*
  # Enhanced Messages Table for Comprehensive Messaging System

  1. Table Structure
    - Enhances existing messages table with required columns
    - Preserves existing data and structure
    - Adds comprehensive messaging functionality

  2. New Columns Added
    - sender_email (email address of sender)
    - sender_phone (optional phone number)
    - subject (message subject/title)
    - message (renamed from content for clarity)
    - category (general, complaint, suggestion, inquiry, emergency)
    - priority (low, medium, high)
    - status (unread, read, replied, archived)
    - source (website, portal, phone, walk-in)
    - reply (official response)
    - replied_by (who replied)
    - replied_at (when replied)

  3. Security
    - Enable RLS on messages table
    - Allow public insert for contact forms
    - Allow authenticated users to read their own messages
    - Allow officials to read and update all messages

  4. Performance
    - Add indexes for common queries
    - Optimize for real-time subscriptions
*/

-- Step 1: Ensure messages table exists with basic structure
CREATE TABLE IF NOT EXISTS public.messages (
  id bigint generated always as identity primary key,
  content text,
  created_at timestamp with time zone default now()
);

-- Step 2: Add sender_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'sender_name'
  ) THEN
    ALTER TABLE public.messages
      ADD COLUMN sender_name text NOT NULL DEFAULT 'Anonymous';
  END IF;
END $$;

-- Step 3: Add all required columns for comprehensive messaging
DO $$
BEGIN
  -- Add sender_email column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'sender_email'
  ) THEN
    ALTER TABLE public.messages
      ADD COLUMN sender_email text NOT NULL DEFAULT 'unknown@example.com';
  END IF;

  -- Add sender_phone column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'sender_phone'
  ) THEN
    ALTER TABLE public.messages
      ADD COLUMN sender_phone text;
  END IF;

  -- Add subject column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'subject'
  ) THEN
    ALTER TABLE public.messages
      ADD COLUMN subject text NOT NULL DEFAULT 'No Subject';
  END IF;

  -- Add message column (rename from content)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'message'
  ) THEN
    ALTER TABLE public.messages
      ADD COLUMN message text NOT NULL DEFAULT '';
    
    -- Copy content to message if content exists
    UPDATE public.messages 
    SET message = COALESCE(content, '') 
    WHERE message = '';
  END IF;

  -- Add category column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'category'
  ) THEN
    ALTER TABLE public.messages
      ADD COLUMN category text NOT NULL DEFAULT 'general';
  END IF;

  -- Add priority column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'priority'
  ) THEN
    ALTER TABLE public.messages
      ADD COLUMN priority text NOT NULL DEFAULT 'medium';
  END IF;

  -- Add status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'status'
  ) THEN
    ALTER TABLE public.messages
      ADD COLUMN status text NOT NULL DEFAULT 'unread';
  END IF;

  -- Add source column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'source'
  ) THEN
    ALTER TABLE public.messages
      ADD COLUMN source text NOT NULL DEFAULT 'website';
  END IF;

  -- Add reply column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'reply'
  ) THEN
    ALTER TABLE public.messages
      ADD COLUMN reply text;
  END IF;

  -- Add replied_by column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'replied_by'
  ) THEN
    ALTER TABLE public.messages
      ADD COLUMN replied_by text;
  END IF;

  -- Add replied_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'replied_at'
  ) THEN
    ALTER TABLE public.messages
      ADD COLUMN replied_at timestamp with time zone;
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.messages
      ADD COLUMN updated_at timestamp with time zone DEFAULT now();
  END IF;
END $$;

-- Step 4: Add constraints for data validation
DO $$
BEGIN
  -- Add category constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema = 'public'
      AND table_name = 'messages'
      AND constraint_name = 'messages_category_check'
  ) THEN
    ALTER TABLE public.messages
      ADD CONSTRAINT messages_category_check
      CHECK (category IN ('general', 'complaint', 'suggestion', 'inquiry', 'emergency'));
  END IF;

  -- Add priority constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema = 'public'
      AND table_name = 'messages'
      AND constraint_name = 'messages_priority_check'
  ) THEN
    ALTER TABLE public.messages
      ADD CONSTRAINT messages_priority_check
      CHECK (priority IN ('low', 'medium', 'high'));
  END IF;

  -- Add status constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema = 'public'
      AND table_name = 'messages'
      AND constraint_name = 'messages_status_check'
  ) THEN
    ALTER TABLE public.messages
      ADD CONSTRAINT messages_status_check
      CHECK (status IN ('unread', 'read', 'replied', 'archived'));
  END IF;

  -- Add source constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema = 'public'
      AND table_name = 'messages'
      AND constraint_name = 'messages_source_check'
  ) THEN
    ALTER TABLE public.messages
      ADD CONSTRAINT messages_source_check
      CHECK (source IN ('website', 'portal', 'phone', 'walk-in'));
  END IF;
END $$;

-- Step 5: Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Step 6: Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Allow insert for all" ON public.messages;
DROP POLICY IF EXISTS "Allow select for all" ON public.messages;

-- Create comprehensive RLS policies
CREATE POLICY "Public can insert messages"
  ON public.messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read own messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (sender_email = email());

CREATE POLICY "Officials can read all messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (
    email() IN (
      SELECT email FROM users 
      WHERE role IN ('super-admin', 'barangay-official')
    )
  );

CREATE POLICY "Officials can update messages"
  ON public.messages
  FOR UPDATE
  TO authenticated
  USING (
    email() IN (
      SELECT email FROM users 
      WHERE role IN ('super-admin', 'barangay-official')
    )
  )
  WITH CHECK (
    email() IN (
      SELECT email FROM users 
      WHERE role IN ('super-admin', 'barangay-official')
    )
  );

-- Step 7: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_email ON public.messages(sender_email);
CREATE INDEX IF NOT EXISTS idx_messages_status ON public.messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_category ON public.messages(category);
CREATE INDEX IF NOT EXISTS idx_messages_priority ON public.messages(priority);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_status ON public.messages(sender_email, status);

-- Step 8: Insert a test message to verify the system works
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
  'Test User',
  'test@example.com',
  '+63 912 345 6789',
  'Test Message - System Verification',
  'This is a test message to verify that the messaging system is working correctly. Messages from the landing page and resident portal should appear here.',
  'general',
  'medium',
  'unread',
  'website',
  now(),
  now()
) ON CONFLICT DO NOTHING;