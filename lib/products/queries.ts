import {
  bestSellers as fallbackBestSellers,
  newArrivals as fallbackNewArrivals,
} from "@/lib/data/products";
import { categories as fallbackCategories } from "@/lib/data/categories";
import { getRoomBySlug } from "@/lib/data/rooms";
import { getCategoryBySlug } from "@/lib/categories/queries";
import { mapProductFromRow } from "@/lib/products/map-product";
import { createServerClient } from "@/lib/supabase/server";
import type { DbProductWithImages } from "@/lib/supabase/database.types";
import type { ProductFilters, ProductCollection, ProductSort } from "@/lib/products/types";
import type { Product } from "@/lib/types";

const PRODUCT_SELECT = `
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
  video_url,
  product_images (
    id,
    url,
    alt_text,
    sort_order,
    is_primary
  )
`;

function mapProduct(row: DbProductWithImages): Product {
  return mapProductFromRow(row);
}

function sanitizeSearchTerm(term: string): string {
  return term.trim().replace(/[%_,]/g, "").slice(0, 100);
}

function matchesSearch(product: Product, term: string): boolean {
  const q = term.toLowerCase();
  const fields = [
    product.name,
    product.category,
    product.material,
    product.description,
    product.shortDescription,
    product.color,
    product.size,
    product.roomType,
  ];

  return fields.some((field) => field?.toLowerCase().includes(q));
}

async function fetchProducts(
  filter: ProductFilters & { featured?: boolean }
): Promise<Product[]> {
  const supabase = createServerClient();
  const sort = filter.sort ?? "newest";
  const collection = filter.collection ?? "all";

  if (!supabase) {
    return getFallbackProducts(filter);
  }

  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_published", true);

  if (collection === "best-sellers") query = query.eq("is_best_seller", true);
  if (collection === "new-arrivals") query = query.eq("is_new_arrival", true);
  if (filter.featured) query = query.eq("is_featured", true);

  if (filter.categorySlug) {
    const category = await getCategoryBySlug(filter.categorySlug);
    if (category?.id) {
      query = query.eq("category_id", category.id);
    }
  }

  if (filter.roomSlug) {
    const room = getRoomBySlug(filter.roomSlug);
    if (room) {
      query = query.eq("room_type", room.roomType);
    }
  }

  const searchTerm = filter.search ? sanitizeSearchTerm(filter.search) : "";
  if (searchTerm) {
    const pattern = `"%${searchTerm.replace(/"/g, "")}%"`;
    query = query.or(
      [
        `name.ilike.${pattern}`,
        `short_description.ilike.${pattern}`,
        `description.ilike.${pattern}`,
        `category_name.ilike.${pattern}`,
        `material.ilike.${pattern}`,
        `color.ilike.${pattern}`,
        `room_type.ilike.${pattern}`,
      ].join(",")
    );
  }

  switch (sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "name":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  if (filter.limit) query = query.limit(filter.limit);

  const { data, error } = await query;

  if (error) {
    console.error("[products] Supabase fetch failed:", error.message);
    return getFallbackProducts(filter);
  }

  if (!data?.length) {
    return [];
  }

  return (data as unknown as DbProductWithImages[]).map(mapProduct);
}

function getFallbackProducts(
  filter: ProductFilters & { featured?: boolean }
): Product[] {
  let products = [...fallbackBestSellers, ...fallbackNewArrivals];
  const unique = new Map(products.map((p) => [p.slug, p]));
  products = [...unique.values()];
  const collection = filter.collection ?? "all";

  if (collection === "best-sellers") {
    products = fallbackBestSellers.slice();
  } else if (collection === "new-arrivals") {
    products = fallbackNewArrivals.slice();
  }

  if (filter.categorySlug) {
    const category = fallbackCategories.find((c) => c.slug === filter.categorySlug);
    if (category) {
      products = products.filter((p) => p.category === category.name);
    }
  }

  if (filter.roomSlug) {
    const room = getRoomBySlug(filter.roomSlug);
    if (room) {
      products = products.filter((p) => p.roomType === room.roomType);
    }
  }

  if (filter.search) {
    const searchTerm = sanitizeSearchTerm(filter.search);
    if (searchTerm) {
      products = products.filter((product) => matchesSearch(product, searchTerm));
    }
  }

  if (filter.featured) {
    products = products.filter(
      (p) => p.slug === "ohio-work-desk" || p.slug === "artisan-writing-desk"
    );
  }

  products = sortProducts(products, filter.sort ?? "newest");

  if (filter.limit) {
    products = products.slice(0, filter.limit);
  }

  return products;
}

function sortablePrice(price: number | null, direction: "asc" | "desc"): number {
  if (price == null) {
    return direction === "asc" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  }

  return price;
}

function sortProducts(products: Product[], sort: ProductSort): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort(
        (a, b) => sortablePrice(a.price, "asc") - sortablePrice(b.price, "asc")
      );
    case "price-desc":
      return sorted.sort(
        (a, b) => sortablePrice(b.price, "desc") - sortablePrice(a.price, "desc")
      );
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  return fetchProducts(filters);
}

export async function getBestSellers(limit = 4): Promise<Product[]> {
  return fetchProducts({ collection: "best-sellers", limit });
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  return fetchProducts({ collection: "new-arrivals", limit });
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return fetchProducts({ featured: true, limit });
}

export async function getFeaturedProduct(): Promise<Product | null> {
  const featured = await fetchProducts({ featured: true, limit: 1 });
  if (featured.length > 0) return featured[0];

  const bestSeller = await fetchProducts({ collection: "best-sellers", limit: 1 });
  return bestSeller[0] ?? null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createServerClient();

  if (!supabase) {
    const all = [...fallbackBestSellers, ...fallbackNewArrivals];
    return all.find((product) => product.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) {
    console.error("[products] Supabase fetch by slug failed:", error?.message);
    const all = [...fallbackBestSellers, ...fallbackNewArrivals];
    return all.find((product) => product.slug === slug) ?? null;
  }

  return mapProduct(data as unknown as DbProductWithImages);
}

export async function getAllProducts(limit = 100): Promise<Product[]> {
  return fetchProducts({ limit, sort: "newest" });
}

export function parseProductSort(value?: string): ProductSort {
  if (value === "price-asc" || value === "price-desc" || value === "name") {
    return value;
  }
  return "newest";
}

export function parseProductCollection(value?: string): ProductCollection {
  if (value === "best-sellers" || value === "new-arrivals") {
    return value;
  }
  return "all";
}
