export type ProductBadge = "new" | "sale" | "featured";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  material: string;
  price: number | null;
  originalPrice?: number;
  badge?: ProductBadge;
  image: string;
  images?: string[];
  inStock?: boolean;
  description?: string;
  shortDescription?: string;
  color?: string;
  size?: string;
  roomType?: string;
  videoUrl?: string;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  image: string;
}

export interface Room {
  name: string;
  slug: string;
  description: string;
  image: string;
  /** Matches `products.room_type` in Supabase */
  roomType: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export type DealType = "flash_sale" | "bundle" | "seasonal";

export interface DealProduct {
  product: Product;
  dealPrice: number;
  originalPrice: number;
  quantity: number;
}

export interface Deal {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  image: string;
  dealType: DealType;
  badge?: string;
  bundlePrice?: number;
  startsAt?: string;
  endsAt?: string;
  products: DealProduct[];
  /** Sum of individual deal prices (before bundle discount) */
  totalDealPrice: number;
  /** Sum of original product prices */
  totalOriginalPrice: number;
  savings: number;
  savingsPercent: number;
}

export interface ValueProp {
  icon: "wood" | "handcrafted" | "delivery" | "returns" | "rating";
  title: string;
  description: string;
}
