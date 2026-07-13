-- Product video storage bucket (used by hunar-woods-admin uploads)
-- Run in Supabase SQL Editor if video uploads fail

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-videos',
  'product-videos',
  true,
  52428800,
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read product videos bucket" ON storage.objects;
CREATE POLICY "Public read product videos bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-videos');
