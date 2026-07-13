-- Hunar Woods — sample deals
-- Run AFTER schema.sql and seed.sql in Supabase SQL Editor

INSERT INTO public.deals (
  title, slug, description, short_description, image_url,
  deal_type, badge, bundle_price, starts_at, ends_at, sort_order
) VALUES
  (
    'Flash Sale — Up to 40% Off',
    'flash-sale-40-off',
    'Limited-time discounts on selected premium furniture. Prices shown are deal prices — add items to cart before the sale ends.',
    'Up to 40% off selected items',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&h=800&fit=crop',
    'flash_sale',
    '40% OFF',
    NULL,
    now() - interval '1 day',
    now() + interval '14 days',
    1
  ),
  (
    'Living Room Bundle',
    'living-room-bundle',
    'Complete your living room with a matching coffee table and lounge chair. Buy the bundle and save PKR 8,000 compared to individual prices.',
    'Coffee table + lounge chair — save 25%',
    'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=1200&h=800&fit=crop',
    'bundle',
    'Bundle Deal',
    52000,
    now() - interval '1 day',
    now() + interval '30 days',
    2
  ),
  (
    'Office Essentials Pack',
    'office-essentials-pack',
    'Set up your home office with our bestselling desk and writing desk at special bundle pricing.',
    'Two desks, one great price',
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&h=800&fit=crop',
    'bundle',
    'Save 15%',
    85000,
    now() - interval '1 day',
    now() + interval '21 days',
    3
  )
ON CONFLICT (slug) DO NOTHING;

-- Flash sale products
INSERT INTO public.deal_products (deal_id, product_id, deal_price, sort_order)
SELECT d.id, p.id, v.deal_price, v.sort_order
FROM public.deals d
JOIN (VALUES
  ('flash-sale-40-off', 'retro-lounge-chair', 24000::numeric, 1),
  ('flash-sale-40-off', 'heritage-coffee-table', 19600::numeric, 2),
  ('flash-sale-40-off', 'classic-tv-console', 38500::numeric, 3)
) AS v(deal_slug, product_slug, deal_price, sort_order)
  ON d.slug = v.deal_slug
JOIN public.products p ON p.slug = v.product_slug
ON CONFLICT (deal_id, product_id) DO NOTHING;

-- Living room bundle
INSERT INTO public.deal_products (deal_id, product_id, deal_price, sort_order)
SELECT d.id, p.id, v.deal_price, v.sort_order
FROM public.deals d
JOIN (VALUES
  ('living-room-bundle', 'heritage-coffee-table', 22000::numeric, 1),
  ('living-room-bundle', 'retro-lounge-chair', 30000::numeric, 2)
) AS v(deal_slug, product_slug, deal_price, sort_order)
  ON d.slug = v.deal_slug
JOIN public.products p ON p.slug = v.product_slug
ON CONFLICT (deal_id, product_id) DO NOTHING;

-- Office essentials bundle
INSERT INTO public.deal_products (deal_id, product_id, deal_price, sort_order)
SELECT d.id, p.id, v.deal_price, v.sort_order
FROM public.deals d
JOIN (VALUES
  ('office-essentials-pack', 'ohio-work-desk', 40500::numeric, 1),
  ('office-essentials-pack', 'artisan-writing-desk', 44500::numeric, 2)
) AS v(deal_slug, product_slug, deal_price, sort_order)
  ON d.slug = v.deal_slug
JOIN public.products p ON p.slug = v.product_slug
ON CONFLICT (deal_id, product_id) DO NOTHING;
