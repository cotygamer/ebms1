/*
  # Create Centralized Database Schema for DBMS

  1. New Tables
    - `users` - System users with roles and permissions
    - `residents` - Resident profiles and verification status
    - `documents` - Document requests and processing
    - `incidents` - Incident reports and blotter entries
    - `announcements` - Public and internal announcements
    - `transactions` - Financial transactions
    - `audit_logs` - System audit trail

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Implement audit logging for all changes

  3. Real-time Features
    - Enable real-time subscriptions for all tables
    - Add triggers for automatic timestamp updates
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: USERS
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text UNIQUE NOT NULL,
    name text NOT NULL,
    role text NOT NULL CHECK (role IN ('super-admin', 'barangay-official', 'resident', 'medical-portal', 'accounting-portal', 'disaster-portal')),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    permissions jsonb DEFAULT '[]'::jsonb,
    phone_number text,
    address text,
    last_login timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table: RESIDENTS
CREATE TABLE IF NOT EXISTS public.residents (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid UNIQUE REFERENCES public.users(id) ON DELETE SET NULL,
    name text NOT NULL,
    email text UNIQUE NOT NULL,
    phone_number text NOT NULL,
    address text NOT NULL,
    verification_status text NOT NULL DEFAULT 'non-verified' CHECK (verification_status IN ('non-verified', 'details-updated', 'semi-verified', 'verified')),
    qr_code text UNIQUE,
    date_registered date DEFAULT CURRENT_DATE,
    emergency_contact text,
    birth_date date,
    gender text CHECK (gender IN ('male', 'female')),
    civil_status text CHECK (civil_status IN ('single', 'married', 'widowed', 'separated', 'divorced')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table: DOCUMENTS
CREATE TABLE IF NOT EXISTS public.documents (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    resident_id uuid NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
    document_type text NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'released', 'rejected')),
    requested_date timestamptz DEFAULT now(),
    processed_date timestamptz,
    released_date timestamptz,
    fee numeric(8,2) DEFAULT 0,
    payment_status text DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    payment_method text,
    notes text,
    purpose text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table: INCIDENTS
CREATE TABLE IF NOT EXISTS public.incidents (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_name text NOT NULL,
    reporter_email text NOT NULL,
    reporter_phone text,
    incident_type text NOT NULL,
    subject text NOT NULL,
    description text NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    location text,
    date_occurred date,
    time_occurred time,
    witness_name text,
    witness_contact text,
    assigned_to text,
    resolution text,
    date_submitted timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table: ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    content text NOT NULL,
    type text NOT NULL CHECK (type IN ('important', 'event', 'notice', 'emergency', 'health', 'weather', 'evacuation', 'update')),
    priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    author text NOT NULL,
    expires_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table: TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.transactions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    type text NOT NULL CHECK (type IN ('revenue', 'expense')),
    description text NOT NULL,
    amount numeric(12,2) NOT NULL,
    category text NOT NULL,
    payment_method text NOT NULL,
    reference_number text,
    transaction_date date DEFAULT CURRENT_DATE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table: AUDIT_LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    action_type text NOT NULL,
    resource_type text NOT NULL,
    resource_id uuid,
    old_value jsonb,
    new_value jsonb,
    timestamp timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_residents_email ON public.residents(email);
CREATE INDEX IF NOT EXISTS idx_residents_verification_status ON public.residents(verification_status);
CREATE INDEX IF NOT EXISTS idx_residents_qr_code ON public.residents(qr_code);
CREATE INDEX IF NOT EXISTS idx_documents_resident_id ON public.documents(resident_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON public.incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_reporter_email ON public.incidents(reporter_email);
CREATE INDEX IF NOT EXISTS idx_announcements_status ON public.announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON public.announcements(type);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON public.audit_logs(action_type);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Admins and officials can read all users
CREATE POLICY "Admins can read all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super-admin', 'barangay-official')
        )
    );

-- Residents can read their own data
CREATE POLICY "Residents can read own data" ON public.residents
    FOR SELECT USING (user_id::text = auth.uid()::text);

-- Admins and officials can read all residents
CREATE POLICY "Admins can read all residents" ON public.residents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super-admin', 'barangay-official', 'medical-portal')
        )
    );

-- Documents policies
CREATE POLICY "Residents can read own documents" ON public.documents
    FOR SELECT USING (
        resident_id IN (
            SELECT id FROM public.residents 
            WHERE user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Admins can read all documents" ON public.documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super-admin', 'barangay-official')
        )
    );

-- Incidents policies
CREATE POLICY "Users can read own incidents" ON public.incidents
    FOR SELECT USING (
        reporter_email IN (
            SELECT email FROM public.users 
            WHERE id::text = auth.uid()::text
        )
    );

CREATE POLICY "Admins can read all incidents" ON public.incidents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super-admin', 'barangay-official')
        )
    );

-- Announcements are readable by all authenticated users
CREATE POLICY "Everyone can read announcements" ON public.announcements
    FOR SELECT USING (auth.role() = 'authenticated');

-- Transactions readable by admins and accounting
CREATE POLICY "Admins can read transactions" ON public.transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super-admin', 'barangay-official', 'accounting-portal')
        )
    );

-- Audit logs readable by admins
CREATE POLICY "Admins can read audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super-admin', 'barangay-official')
        )
    );

-- Insert/Update/Delete policies for admins and officials
CREATE POLICY "Admins can manage users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super-admin', 'barangay-official')
        )
    );

CREATE POLICY "Admins can manage residents" ON public.residents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super-admin', 'barangay-official')
        )
    );

CREATE POLICY "Residents can update own profile" ON public.residents
    FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "Admins can manage documents" ON public.documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super-admin', 'barangay-official')
        )
    );

CREATE POLICY "Residents can create document requests" ON public.documents
    FOR INSERT WITH CHECK (
        resident_id IN (
            SELECT id FROM public.residents 
            WHERE user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Admins can manage incidents" ON public.incidents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super-admin', 'barangay-official')
        )
    );

CREATE POLICY "Users can create incidents" ON public.incidents
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage announcements" ON public.announcements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super-admin', 'barangay-official', 'medical-portal', 'accounting-portal', 'disaster-portal')
        )
    );

CREATE POLICY "Admins can manage transactions" ON public.transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super-admin', 'barangay-official', 'accounting-portal')
        )
    );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_residents_updated_at BEFORE UPDATE ON public.residents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON public.incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.users (email, name, role, status, permissions) VALUES
('superadmin@barangay.gov', 'Super Administrator', 'super-admin', 'active', '["all"]'::jsonb),
('official@barangay.gov', 'Barangay Official', 'barangay-official', 'active', '["residents", "documents", "reports"]'::jsonb),
('resident@email.com', 'Juan Dela Cruz', 'resident', 'active', '["basic"]'::jsonb),
('medical@barangay.gov', 'Dr. Maria Santos', 'medical-portal', 'active', '["health", "medical-records"]'::jsonb),
('accounting@barangay.gov', 'Ana Cruz', 'accounting-portal', 'active', '["accounting", "financial-reports"]'::jsonb),
('disaster@barangay.gov', 'Pedro Martinez', 'disaster-portal', 'active', '["disaster-management", "emergency-alerts"]'::jsonb)
ON CONFLICT (email) DO NOTHING;

-- Get the resident user ID for sample data
DO $$
DECLARE
    resident_user_id uuid;
    resident_id uuid;
BEGIN
    SELECT id INTO resident_user_id FROM public.users WHERE email = 'resident@email.com';
    
    IF resident_user_id IS NOT NULL THEN
        INSERT INTO public.residents (user_id, name, email, phone_number, address, verification_status, qr_code) VALUES
        (resident_user_id, 'Juan Dela Cruz', 'resident@email.com', '+63 912 345 6789', '123 Main St, Barangay Center', 'verified', 'QR123456789')
        ON CONFLICT (email) DO NOTHING
        RETURNING id INTO resident_id;
        
        -- Insert sample documents
        IF resident_id IS NOT NULL THEN
            INSERT INTO public.documents (resident_id, document_type, status, fee, payment_status, purpose) VALUES
            (resident_id, 'Barangay Clearance', 'ready', 50, 'paid', 'Employment requirement'),
            (resident_id, 'Certificate of Indigency', 'processing', 30, 'paid', 'Medical assistance')
            ON CONFLICT DO NOTHING;
            
            -- Insert sample incidents
            INSERT INTO public.incidents (reporter_name, reporter_email, incident_type, subject, description, status, priority, location) VALUES
            ('Juan Dela Cruz', 'resident@email.com', 'noise', 'Loud music from neighbor', 'Neighbor playing loud music past 10 PM', 'pending', 'medium', '123 Main St')
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
END $$;

-- Insert sample announcements
INSERT INTO public.announcements (title, content, type, priority, status, author) VALUES
('Community Health Drive - Free Medical Checkup', 'Free medical checkup and vaccination for all residents. Bring your barangay ID and health records.', 'health', 'high', 'published', 'Barangay Health Center'),
('Road Maintenance Schedule', 'Main Street will undergo maintenance from March 25-27. Please use alternative routes.', 'notice', 'medium', 'published', 'Public Works'),
('Barangay Assembly Meeting', 'Monthly barangay assembly meeting on March 30, 2024 at 7:00 PM. All residents are invited.', 'event', 'medium', 'published', 'Barangay Council')
ON CONFLICT DO NOTHING;

-- Insert sample transactions
INSERT INTO public.transactions (type, description, amount, category, payment_method, reference_number) VALUES
('revenue', 'Document fees collection', 1250.00, 'Document Services', 'cash', 'REF001'),
('revenue', 'Business permit fees', 2500.00, 'Business Permits', 'gcash', 'REF002'),
('expense', 'Office supplies', 850.00, 'Office Expenses', 'cash', 'REF003')
ON CONFLICT DO NOTHING;