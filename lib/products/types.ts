export type ProductSort = "newest" | "price-asc" | "price-desc" | "name";

export type ProductCollection = "all" | "best-sellers" | "new-arrivals";

export function collectionLabel(collection: ProductCollection): string {
  switch (collection) {
    case "best-sellers":
      return "Best Sellers";
    case "new-arrivals":
      return "New Arrivals";
    default:
      return "All Products";
  }
}

export interface ProductFilters {
  categorySlug?: string;
  roomSlug?: string;
  sort?: ProductSort;
  collection?: ProductCollection;
  search?: string;
  limit?: number;
}
