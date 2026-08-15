/*
# Create hub_files table for cloud-stored Guide PDF and Demo Video

1. Purpose
   Phase 4 moves uploaded files (Spark Squad Guide PDF and Demo Video) from
   browser-only IndexedDB into Supabase Storage so any visitor from any device
   can view them. This table stores the metadata row that points to the file
   in the `hub-files` storage bucket.

2. New Tables
   - `hub_files`
     - `id` (uuid, primary key)
     - `kind` (text, not null) — either 'guide' or 'demo'; unique per kind
     - `file_name` (text, not null) — original uploaded file name
     - `storage_path` (text, not null) — path inside the `hub-files` bucket
     - `mime_type` (text, not null) — e.g. application/pdf, video/mp4
     - `size_bytes` (bigint, not null) — file size
     - `updated_by` (uuid, nullable) — auth user who last uploaded
     - `updated_at` (timestamptz, default now())

3. Security
   - Enable RLS on `hub_files`.
   - SELECT is public (TO anon, authenticated) so every visitor can read which
     guide/demo is currently published and fetch the file from the public bucket.
   - INSERT / UPDATE / DELETE are restricted to `authenticated` users whose
     email matches the admin address (abdobody19102006@gmail.com). This is
     enforced via a SECURITY DEFINER helper `is_hub_admin()` that reads
     `auth.jwt() ->> 'email'`, so the check is server-side and cannot be
     bypassed from the client.
   - The `hub-files` storage bucket is created as public-read so anon visitors
     can stream the PDF/video, while writes are admin-only via storage policies.
*/

CREATE TABLE IF NOT EXISTS hub_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('guide', 'demo')),
  file_name text NOT NULL,
  storage_path text NOT NULL,
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL,
  updated_by uuid,
  updated_at timestamptz DEFAULT now(),
  UNIQUE (kind)
);

ALTER TABLE hub_files ENABLE ROW LEVEL SECURITY;

-- Helper: returns true when the current authenticated user is the Hub admin.
-- Reads the email from the JWT (raw_app_meta_data is not used for email; the
-- email lives at the top level of the auth JWT payload).
CREATE OR REPLACE FUNCTION public.is_hub_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(
    (auth.jwt() ->> 'email') = 'abdobody19102006@gmail.com',
    false
  );
$$;

-- Public read: any visitor can see which guide/demo is published.
DROP POLICY IF EXISTS "public_read_hub_files" ON hub_files;
CREATE POLICY "public_read_hub_files"
  ON hub_files FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin-only writes.
DROP POLICY IF EXISTS "admin_insert_hub_files" ON hub_files;
CREATE POLICY "admin_insert_hub_files"
  ON hub_files FOR INSERT
  TO authenticated
  WITH CHECK (public.is_hub_admin());

DROP POLICY IF EXISTS "admin_update_hub_files" ON hub_files;
CREATE POLICY "admin_update_hub_files"
  ON hub_files FOR UPDATE
  TO authenticated
  USING (public.is_hub_admin())
  WITH CHECK (public.is_hub_admin());

DROP POLICY IF EXISTS "admin_delete_hub_files" ON hub_files;
CREATE POLICY "admin_delete_hub_files"
  ON hub_files FOR DELETE
  TO authenticated
  USING (public.is_hub_admin());

-- Storage bucket for the actual files. Public read so visitors can stream;
-- writes are controlled by storage policies below.
INSERT INTO storage.buckets (id, name, public)
VALUES ('hub-files', 'hub-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: admin can upload/update/delete objects, anyone can read.
DROP POLICY IF EXISTS "admin_upload_hub_files" ON storage.objects;
CREATE POLICY "admin_upload_hub_files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'hub-files'
    AND public.is_hub_admin()
  );

DROP POLICY IF EXISTS "admin_update_hub_files_objects" ON storage.objects;
CREATE POLICY "admin_update_hub_files_objects"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'hub-files'
    AND public.is_hub_admin()
  )
  WITH CHECK (
    bucket_id = 'hub-files'
    AND public.is_hub_admin()
  );

DROP POLICY IF EXISTS "admin_delete_hub_files_objects" ON storage.objects;
CREATE POLICY "admin_delete_hub_files_objects"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'hub-files'
    AND public.is_hub_admin()
  );

DROP POLICY IF EXISTS "public_read_hub_files_objects" ON storage.objects;
CREATE POLICY "public_read_hub_files_objects"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'hub-files');
