import { fallbackDeals, getFallbackDealBySlug } from "@/lib/data/deals";
import { mapProductFromRow } from "@/lib/products/map-product";
import { createServerClient } from "@/lib/supabase/server";
import type {
  DbDealProductWithProduct,
  DbDealWithProducts,
} from "@/lib/supabase/database.types";
import type { Deal, DealProduct, DealType } from "@/lib/types";

const DEAL_SELECT = `
  id,
  title,
  slug,
  description,
  short_description,
  image_url,
  deal_type,
  badge,
  bundle_price,
  starts_at,
  ends_at,
  sort_order,
  deal_products (
    id,
    deal_price,
    quantity,
    sort_order,
    products (
      id,
      name,
      slug,
      description,
      short_description,
      category_name,
      material,
      color,
      size,
      room_type,
      price,
      original_price,
      stock_quantity,
      in_stock,
      badge,
      is_best_seller,
      is_new_arrival,
      is_featured,
      product_images (
        id,
        url,
        alt_text,
        sort_order,
        is_primary
      )
    )
  )
`;

function isDealActive(startsAt: string | null, endsAt: string | null): boolean {
  const now = Date.now();
  if (startsAt && new Date(startsAt).getTime() > now) return false;
  if (endsAt && new Date(endsAt).getTime() < now) return false;
  return true;
}

function mapDealProducts(
  rows: DbDealProductWithProduct[] | null | undefined
): DealProduct[] {
  if (!rows?.length) return [];

  return [...rows]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => {
      const product = mapProductFromRow(row.products);
      const originalPrice = product.originalPrice ?? product.price ?? 0;
      const dealPrice =
        row.deal_price != null
          ? Number(row.deal_price)
          : product.price ?? 0;

      return {
        product,
        dealPrice,
        originalPrice,
        quantity: row.quantity,
      };
    });
}

function mapDeal(row: DbDealWithProducts): Deal {
  const products = mapDealProducts(row.deal_products);
  const totalDealPrice =
    row.bundle_price != null
      ? Number(row.bundle_price)
      : products.reduce(
          (sum, item) => sum + item.dealPrice * item.quantity,
          0
        );
  const totalOriginalPrice = products.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );
  const savings = Math.max(0, totalOriginalPrice - totalDealPrice);
  const savingsPercent =
    totalOriginalPrice > 0
      ? Math.round((savings / totalOriginalPrice) * 100)
      : 0;

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? undefined,
    shortDescription: row.short_description ?? undefined,
    image: row.image_url ?? "/images/logo.png",
    dealType: row.deal_type as DealType,
    badge: row.badge ?? undefined,
    bundlePrice: row.bundle_price != null ? Number(row.bundle_price) : undefined,
    startsAt: row.starts_at ?? undefined,
    endsAt: row.ends_at ?? undefined,
    products,
    totalDealPrice,
    totalOriginalPrice,
    savings,
    savingsPercent,
  };
}

export async function getDeals(): Promise<Deal[]> {
  const supabase = createServerClient();

  if (!supabase) {
    return fallbackDeals;
  }

  const { data, error } = await supabase
    .from("deals")
    .select(DEAL_SELECT)
    .eq("is_published", true)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return fallbackDeals;
  }

  return (data as unknown as DbDealWithProducts[])
    .filter((row) => isDealActive(row.starts_at, row.ends_at))
    .map(mapDeal)
    .filter((deal) => deal.products.length > 0);
}

export async function getDealBySlug(slug: string): Promise<Deal | null> {
  const supabase = createServerClient();

  if (!supabase) {
    return getFallbackDealBySlug(slug);
  }

  const { data, error } = await supabase
    .from("deals")
    .select(DEAL_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return getFallbackDealBySlug(slug);
  }

  const deal = mapDeal(data as unknown as DbDealWithProducts);

  if (!isDealActive(data.starts_at, data.ends_at) || deal.products.length === 0) {
    return null;
  }

  return deal;
}

export function dealTypeLabel(type: DealType): string {
  switch (type) {
    case "flash_sale":
      return "Flash Sale";
    case "bundle":
      return "Bundle";
    case "seasonal":
      return "Seasonal";
    default:
      return "Deal";
  }
}

export function formatDealEndsAt(endsAt?: string): string | null {
  if (!endsAt) return null;

  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h left`;

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${minutes}m left`;
}
