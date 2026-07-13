import type { ProductCollection, ProductSort } from "@/lib/products/types";

export function buildProductsUrl(options: {
  basePath?: string;
  room?: string;
  collection?: ProductCollection;
  sort?: ProductSort;
  q?: string;
}): string {
  const base = options.basePath ?? "/products";
  const params = new URLSearchParams();

  if (options.q?.trim()) params.set("q", options.q.trim());
  if (options.room) params.set("room", options.room);
  if (options.collection && options.collection !== "all") {
    params.set("collection", options.collection);
  }
  if (options.sort && options.sort !== "newest") {
    params.set("sort", options.sort);
  }

  const query = params.toString();
  return query ? `${base}?${query}` : base;
}
