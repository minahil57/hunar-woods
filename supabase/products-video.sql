-- Add optional product video URL (YouTube, Vimeo, or direct storage link)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS video_url TEXT;

COMMENT ON COLUMN public.products.video_url IS
  'Optional product video — YouTube/Vimeo URL or direct file link (e.g. Supabase Storage)';
