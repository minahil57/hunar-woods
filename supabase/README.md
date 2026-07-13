# Supabase setup for Hunar Woods

## 1. Create a Supabase project

Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project.

## 2. Run the database schema

Open **SQL Editor** in your Supabase dashboard and run these files in order:

1. `supabase/schema.sql` — creates tables, RLS policies, and storage bucket
2. `supabase/seed.sql` — inserts sample categories, products, and images
3. `supabase/deals-seed.sql` — inserts sample deals (run after seed.sql)

## 3. Configure environment variables

Copy `.env.local.example` to `.env.local` and add your project credentials from  
**Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Restart the dev server after adding env vars.

## Database structure

### `categories`
| Column | Type | Description |
|--------|------|-------------|
| name, slug | text | Category name and URL slug |
| image_url | text | Category image |
| parent_slug | text | Optional parent for nested categories |

### `products`
| Column | Type | Description |
|--------|------|-------------|
| name, slug | text | Product name and URL slug |
| description | text | Full product description |
| category_name | text | Display category (Work Desks, Chairs, etc.) |
| material, color, size, room_type | text | Filter fields |
| price, original_price | numeric | PKR pricing (`price` may be null for quote-on-request items) |
| stock_quantity | int | Stock count (`in_stock` auto-computed) |
| badge | text | `new`, `sale`, or `featured` |
| is_best_seller, is_new_arrival, is_featured | bool | Homepage sections |
| is_published | bool | Visible on storefront |
| video_url | text | Optional product video (YouTube, Vimeo, or direct file URL) |

### `product_images`
| Column | Type | Description |
|--------|------|-------------|
| product_id | uuid | Links to product |
| url | text | Image URL (Supabase Storage or external) |
| alt_text | text | Accessibility text |
| sort_order | int | Gallery order |
| is_primary | bool | Main card/thumbnail image |

### `orders`
| Column | Type | Description |
|--------|------|-------------|
| order_number | text | Unique order reference (e.g. HW-20260615-AB12) |
| status | text | `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled` |
| customer_name, customer_email, customer_phone | text | Customer contact |
| shipping_address, shipping_city | text | Delivery address |
| payment_method | text | `cod`, `bank_transfer`, or `card` |
| subtotal, shipping_cost, discount, total | numeric | Order totals in PKR |

### `order_items`
| Column | Type | Description |
|--------|------|-------------|
| order_id | uuid | Links to order |
| product_id | uuid | Optional link to product |
| product_name, product_slug | text | Snapshot at time of order |
| unit_price, quantity, line_total | numeric/int | Line item pricing |

**Note:** If you already ran `schema.sql` before orders were added, run only the orders section at the bottom of `supabase/schema.sql` in the SQL Editor.

### `deals`
| Column | Type | Description |
|--------|------|-------------|
| title, slug | text | Deal name and URL slug |
| description, short_description | text | Full and card copy |
| image_url | text | Hero/card image |
| deal_type | text | `flash_sale`, `bundle`, or `seasonal` |
| badge | text | Label e.g. "40% OFF" |
| bundle_price | numeric | Total bundle price (optional) |
| starts_at, ends_at | timestamptz | Active window |
| is_active, is_published | bool | Visibility flags |

### `deal_products`
| Column | Type | Description |
|--------|------|-------------|
| deal_id | uuid | Links to deal |
| product_id | uuid | Links to product |
| deal_price | numeric | Price during this deal |
| quantity | int | Items included (bundles) |

**Note:** If you already ran `schema.sql` before deals were added, run `supabase/deals.sql` in the SQL Editor, then `supabase/deals-seed.sql`.

**Note:** For product videos, run `supabase/products-video.sql` if your database was created before the `video_url` column was added.

**Note:** For video uploads in the admin panel, run `supabase/storage-videos.sql` if your storage bucket only allows images.

## Uploading images

The admin panel (`hunar-woods-admin`) uploads images to the **`product-images`** bucket via drag-and-drop or file browse. Files are stored under:

- `categories/` → saved to `categories.image_url`
- `products/` → saved to `product_images.url`
- `products/videos/` → saved to `products.video_url` in the **`product-videos`** bucket
- `deals/` → saved to `deals.image_url`

Ensure the bucket exists (created by `schema.sql`). The admin app uses the **service role** key server-side for uploads.

Manual upload (optional):

1. Go to **Storage → product-images** in Supabase
2. Upload images (JPEG, PNG, WebP, GIF — max 5MB)
3. Copy the public URL if inserting via SQL

Public URL format:
```
https://<project-ref>.supabase.co/storage/v1/object/public/product-images/<filename>
```

## Fallback behavior

If Supabase env vars are missing, the site uses static product data from `lib/data/products.ts` so development still works.

## Order confirmation emails

Orders trigger a confirmation email to the customer's checkout email.

### Option A — Gmail (sends from your Gmail address)

Add to `.env.local`:

```
GMAIL_USER=kumailhaidersangi@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
ORDER_FROM_NAME=Hunar Woods
```

**Setup steps:**
1. Turn on [2-Step Verification](https://myaccount.google.com/security) for the Gmail account
2. Create an [App Password](https://myaccount.google.com/apppasswords) (Google Account → Security → App passwords)
3. Copy the 16-character password into `GMAIL_APP_PASSWORD` (spaces optional)
4. Restart the dev server

Customers will receive emails **from** `kumailhaidersangi@gmail.com` with subject *"Your order HW-... is confirmed — Hunar Woods"*.

### Option B — Resend (fallback)

If Gmail env vars are not set, the app falls back to Resend when `RESEND_API_KEY` is configured.

## Admin panel

A separate Next.js admin app lives in `hunar-woods-admin/`. See its README for setup. It uses the **service role** key to manage orders, products, categories, and deals. Runs on port **3001**.
