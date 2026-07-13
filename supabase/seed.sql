-- Hunar Woods — seed data
-- Run AFTER schema.sql in Supabase SQL Editor
-- Run the ENTIRE file (Ctrl+A → Run)

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
INSERT INTO public.categories (name, slug, image_url, sort_order) VALUES
  ('Work Desks', 'work-desks', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=400&fit=crop', 1),
  ('Chairs', 'chairs', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=400&fit=crop', 2),
  ('Center Tables', 'center-tables', 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600&h=400&fit=crop', 3),
  ('Bed Sets', 'bed-sets', 'https://images.unsplash.com/photo-1505693416388-ac5ce068feab?w=600&h=400&fit=crop', 4),
  ('TV Consoles', 'tv-consoles', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop', 5),
  ('Lobby Consoles', 'lobby-consoles', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop', 6),
  ('Shelves', 'shelves', 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&h=400&fit=crop', 7),
  ('Utensils', 'utensils', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop', 8)
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Products — Best Sellers
-- ---------------------------------------------------------------------------
INSERT INTO public.products (
  name, slug, description, short_description, category_id, category_name,
  material, color, size, room_type, price, original_price, stock_quantity,
  badge, is_best_seller, is_new_arrival, is_featured
) VALUES
  (
    'Ohio Work Desk', 'ohio-work-desk',
    'Premium solid wood work desk handcrafted for modern home offices.',
    'Solid wood work desk with clean lines.',
    (SELECT id FROM public.categories WHERE slug = 'work-desks'),
    'Work Desks', 'Solid Wood', 'Natural Oak', '150 x 70 x 75 cm', 'Office',
    45000, NULL, 12, 'new', true, false, true
  ),
  (
    'Retro Lounge Chair', 'retro-lounge-chair',
    'Handcrafted lounge chair with retro-inspired silhouette and premium upholstery.',
    'Comfortable handcrafted lounge chair.',
    (SELECT id FROM public.categories WHERE slug = 'chairs'),
    'Chairs', 'Handcrafted', 'Walnut', '80 x 85 x 90 cm', 'Living Room',
    32000, 40000, 8, 'sale', true, false, false
  ),
  (
    'Heritage Coffee Table', 'heritage-coffee-table',
    'Elegant solid wood coffee table with timeless heritage design.',
    'Solid wood coffee table for living rooms.',
    (SELECT id FROM public.categories WHERE slug = 'center-tables'),
    'Center Tables', 'Solid Wood', 'Teak', '120 x 60 x 45 cm', 'Living Room',
    28000, NULL, 15, NULL, true, false, false
  ),
  (
    'Classic TV Console', 'classic-tv-console',
    'Handcrafted TV console with ample storage and premium finish.',
    'TV console with solid wood construction.',
    (SELECT id FROM public.categories WHERE slug = 'tv-consoles'),
    'TV Consoles', 'Handcrafted', 'Dark Walnut', '180 x 45 x 55 cm', 'Living Room',
    55000, NULL, 6, 'new', true, false, false
  )
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Products — New Arrivals
-- ---------------------------------------------------------------------------
INSERT INTO public.products (
  name, slug, description, short_description, category_id, category_name,
  material, color, size, room_type, price, original_price, stock_quantity,
  badge, is_best_seller, is_new_arrival, is_featured
) VALUES
  (
    'Artisan Writing Desk', 'artisan-writing-desk',
    'Writing desk with artisan detailing and smooth solid wood finish.',
    'Handcrafted writing desk for home office.',
    (SELECT id FROM public.categories WHERE slug = 'work-desks'),
    'Work Desks', 'Solid Wood', 'Natural Oak', '140 x 65 x 76 cm', 'Office',
    52000, NULL, 10, 'new', false, true, true
  ),
  (
    'Oak Dining Chair', 'oak-dining-chair',
    'Elegant oak dining chair with ergonomic comfort and durable build.',
    'Handcrafted oak dining chair.',
    (SELECT id FROM public.categories WHERE slug = 'chairs'),
    'Chairs', 'Handcrafted', 'Oak', '45 x 50 x 95 cm', 'Kitchen & Dining',
    18500, NULL, 20, 'new', false, true, false
  ),
  (
    'Floating Wall Shelf', 'floating-wall-shelf',
    'Minimal floating wall shelf crafted from premium solid wood.',
    'Wall-mounted floating shelf.',
    (SELECT id FROM public.categories WHERE slug = 'shelves'),
    'Shelves', 'Solid Wood', 'Natural', '90 x 25 x 5 cm', 'Living Room',
    12000, NULL, 25, 'new', false, true, false
  ),
  (
    'Grand Bed Set', 'grand-bed-set',
    'Luxury wooden bed set with headboard, side tables, and premium finish.',
    'Complete handcrafted bed set.',
    (SELECT id FROM public.categories WHERE slug = 'bed-sets'),
    'Bed Sets', 'Handcrafted', 'Walnut', 'King Size', 'Bedroom',
    125000, NULL, 4, 'new', false, true, false
  ),
  (
    'Heritage Lobby Console', 'heritage-lobby-console',
    'Elegant solid wood lobby console perfect for entryways and hallways.',
    'Handcrafted entryway console table.',
    (SELECT id FROM public.categories WHERE slug = 'lobby-consoles'),
    'Lobby Consoles', 'Solid Wood', 'Natural Oak', '120 x 35 x 85 cm', 'Entryway',
    38000, NULL, 8, 'new', false, true, false
  )
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Product images
-- ---------------------------------------------------------------------------
INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, v.alt_text, v.sort_order, v.is_primary
FROM public.products p
JOIN (VALUES
  ('ohio-work-desk', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=800&fit=crop', 'Ohio Work Desk front view', 0, true),
  ('ohio-work-desk', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=800&fit=crop', 'Ohio Work Desk in office setting', 1, false),
  ('retro-lounge-chair', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=800&fit=crop', 'Retro Lounge Chair', 0, true),
  ('heritage-coffee-table', 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=800&fit=crop', 'Heritage Coffee Table', 0, true),
  ('classic-tv-console', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=800&fit=crop', 'Classic TV Console', 0, true),
  ('artisan-writing-desk', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=800&fit=crop', 'Artisan Writing Desk', 0, true),
  ('oak-dining-chair', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop', 'Oak Dining Chair', 0, true),
  ('floating-wall-shelf', 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=800&fit=crop', 'Floating Wall Shelf', 0, true),
  ('grand-bed-set', 'https://images.unsplash.com/photo-1505693416388-ac5ce068feab?w=800&h=800&fit=crop', 'Grand Bed Set', 0, true),
  ('grand-bed-set', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=800&fit=crop', 'Grand Bed Set bedroom view', 1, false),
  ('heritage-lobby-console', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=800&fit=crop', 'Heritage Lobby Console', 0, true)
) AS v(slug, url, alt_text, sort_order, is_primary)
  ON p.slug = v.slug
WHERE NOT EXISTS (
  SELECT 1 FROM public.product_images pi
  WHERE pi.product_id = p.id AND pi.url = v.url
);
