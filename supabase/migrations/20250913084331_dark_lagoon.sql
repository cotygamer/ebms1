@@ .. @@
 CREATE INDEX idx_residents_qr_code ON public.residents (qr_code);
 
+-- Table: INCIDENTS (Blotter/Complaint)
+CREATE TABLE IF NOT EXISTS public.incidents (
+    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
+    reporter_resident_id uuid REFERENCES public.residents(id) ON DELETE SET NULL,
+    incident_type text NOT NULL,
+    subject text NOT NULL,
+    description text NOT NULL,
+    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
+    priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
+    location text,
+    date_occurred timestamp with time zone,
+    attachments jsonb DEFAULT '[]'::jsonb,
+    witness_info jsonb,
+    assigned_to_user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
+    resolution text,
+    date_submitted timestamp with time zone DEFAULT now(),
+    date_resolved timestamp with time zone,
+    created_at timestamp with time zone DEFAULT now(),
+    updated_at timestamp with time zone DEFAULT now()
+);
+
+CREATE INDEX idx_incidents_status ON public.incidents (status);
+CREATE INDEX idx_incidents_priority ON public.incidents (priority);
+
 -- Table: PROJECTS
 CREATE TABLE IF NOT EXISTS public.projects (
@@ .. @@
 ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
 ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
 ALTER TABLE project_achievements ENABLE ROW LEVEL SECURITY;
+ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
 ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
@@ .. @@
   ON residents
   FOR SELECT
   TO authenticated
   USING ((user_id)::text = (uid())::text);
+
+-- Incidents policies
+CREATE POLICY "Admins and officials can manage incidents"
+  ON incidents
+  FOR ALL
+  TO authenticated
+  USING (EXISTS (
+    SELECT 1 FROM users
+    WHERE users.id::text = uid()::text
+    AND users.role IN ('super-admin', 'barangay-official')
+  ));
+
+CREATE POLICY "Residents can read own incidents"
+  ON incidents
+  FOR SELECT
+  TO authenticated
+  USING (reporter_resident_id = (
+    SELECT id FROM residents WHERE user_id::text = uid()::text
+  ));
+
+CREATE POLICY "Everyone can create incidents"
+  ON incidents
+  FOR INSERT
+  TO authenticated
+  WITH CHECK (true);