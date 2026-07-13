import { bestSellers } from "@/lib/data/products";
import type { Deal, DealProduct } from "@/lib/types";

function findProduct(slug: string) {
  return bestSellers.find((p) => p.slug === slug);
}

function dealProduct(
  slug: string,
  dealPrice: number,
  quantity = 1
): DealProduct | null {
  const product = findProduct(slug);
  if (!product) return null;

  return {
    product,
    dealPrice,
    originalPrice: product.originalPrice ?? product.price ?? 0,
    quantity,
  };
}

function buildDeal(
  deal: Omit<
    Deal,
    "products" | "totalDealPrice" | "totalOriginalPrice" | "savings" | "savingsPercent"
  >,
  items: Array<{ slug: string; dealPrice: number; quantity?: number }>
): Deal {
  const products = items
    .map((item) => dealProduct(item.slug, item.dealPrice, item.quantity))
    .filter((item): item is DealProduct => item !== null);

  const totalDealPrice =
    deal.bundlePrice ??
    products.reduce((sum, item) => sum + item.dealPrice * item.quantity, 0);
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
    ...deal,
    products,
    totalDealPrice,
    totalOriginalPrice,
    savings,
    savingsPercent,
  };
}

/** Static fallback when Supabase is not configured */
export const fallbackDeals: Deal[] = [
  buildDeal(
    {
      id: "deal-1",
      title: "Flash Sale — Up to 40% Off",
      slug: "flash-sale-40-off",
      description:
        "Limited-time discounts on selected premium furniture. Prices shown are deal prices — add items to cart before the sale ends.",
      shortDescription: "Up to 40% off selected items",
      image:
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&h=800&fit=crop",
      dealType: "flash_sale",
      badge: "40% OFF",
      startsAt: new Date(Date.now() - 86400000).toISOString(),
      endsAt: new Date(Date.now() + 14 * 86400000).toISOString(),
    },
    [
      { slug: "retro-lounge-chair", dealPrice: 24000 },
      { slug: "heritage-coffee-table", dealPrice: 19600 },
      { slug: "classic-tv-console", dealPrice: 38500 },
    ]
  ),
  buildDeal(
    {
      id: "deal-2",
      title: "Living Room Bundle",
      slug: "living-room-bundle",
      description:
        "Complete your living room with a matching coffee table and lounge chair. Buy the bundle and save compared to individual prices.",
      shortDescription: "Coffee table + lounge chair — save 25%",
      image:
        "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=1200&h=800&fit=crop",
      dealType: "bundle",
      badge: "Bundle Deal",
      bundlePrice: 52000,
      startsAt: new Date(Date.now() - 86400000).toISOString(),
      endsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    },
    [
      { slug: "heritage-coffee-table", dealPrice: 22000 },
      { slug: "retro-lounge-chair", dealPrice: 30000 },
    ]
  ),
  buildDeal(
    {
      id: "deal-3",
      title: "Office Essentials Pack",
      slug: "office-essentials-pack",
      description:
        "Set up your home office with our bestselling desk at special bundle pricing.",
      shortDescription: "Premium desk at a special price",
      image:
        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&h=800&fit=crop",
      dealType: "bundle",
      badge: "Save 15%",
      bundlePrice: 40500,
      startsAt: new Date(Date.now() - 86400000).toISOString(),
      endsAt: new Date(Date.now() + 21 * 86400000).toISOString(),
    },
    [{ slug: "ohio-work-desk", dealPrice: 40500 }]
  ),
];

export function getFallbackDealBySlug(slug: string): Deal | null {
  return fallbackDeals.find((deal) => deal.slug === slug) ?? null;
}
