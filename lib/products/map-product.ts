import type { DbProductWithImages } from "@/lib/supabase/database.types";
import type { Product, ProductBadge } from "@/lib/types";

export function mapProductFromRow(row: DbProductWithImages): Product {
  const images = [...(row.product_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const primary =
    images.find((image) => image.is_primary) ?? images[0] ?? null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category_name,
    material: row.material ?? "Solid Wood",
    color: row.color ?? undefined,
    size: row.size ?? undefined,
    roomType: row.room_type ?? undefined,
    price: row.price != null ? Number(row.price) : null,
    originalPrice: row.original_price
      ? Number(row.original_price)
      : undefined,
    badge: (row.badge as ProductBadge | null) ?? undefined,
    image: primary?.url ?? "/images/logo.png",
    images: images.map((image) => image.url),
    inStock: row.in_stock,
    description: row.description ?? undefined,
    shortDescription: row.short_description ?? undefined,
    videoUrl: row.video_url ?? undefined,
  };
}
