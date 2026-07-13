-- Hunar Woods — deals tables
-- Run AFTER schema.sql in Supabase SQL Editor
-- Or append to schema.sql for fresh installs

-- ---------------------------------------------------------------------------
-- Deals (flash sales, bundles, seasonal promos)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  image_url TEXT,
  deal_type TEXT NOT NULL DEFAULT 'flash_sale'
    CHECK (deal_type IN ('flash_sale', 'bundle', 'seasonal')),
  badge TEXT,
  bundle_price NUMERIC(12, 2) CHECK (bundle_price IS NULL OR bundle_price >= 0),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deals_slug ON public.deals(slug);
CREATE INDEX IF NOT EXISTS idx_deals_active ON public.deals(is_active, is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_deals_dates ON public.deals(starts_at, ends_at);

CREATE TABLE IF NOT EXISTS public.deal_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  deal_price NUMERIC(12, 2) CHECK (deal_price IS NULL OR deal_price >= 0),
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (deal_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_deal_products_deal ON public.deal_products(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_products_product ON public.deal_products(product_id);

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published deals are viewable" ON public.deals;
CREATE POLICY "Published deals are viewable"
  ON public.deals FOR SELECT
  USING (is_published = true AND is_active = true);

DROP POLICY IF EXISTS "Deal products are viewable" ON public.deal_products;
CREATE POLICY "Deal products are viewable"
  ON public.deal_products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.deals d
      WHERE d.id = deal_id
        AND d.is_published = true
        AND d.is_active = true
    )
  );
