-- Allow products without a listed price (contact for quote)
-- Run in Supabase SQL Editor if products.price is still NOT NULL

ALTER TABLE public.products
  ALTER COLUMN price DROP NOT NULL;

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_price_check;

ALTER TABLE public.products
  ADD CONSTRAINT products_price_check CHECK (price IS NULL OR price >= 0);
