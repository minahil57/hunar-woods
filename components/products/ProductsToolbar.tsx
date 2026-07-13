"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductsCollectionTabs } from "@/components/products/ProductsCollectionTabs";
import { getRoomBySlug } from "@/lib/data/rooms";
import { buildProductsUrl } from "@/lib/products/url";
import type { ProductCollection, ProductSort } from "@/lib/products/types";
import { collectionLabel } from "@/lib/products/types";

const sortOptions: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "name", label: "A–Z" },
];

interface ProductsToolbarProps {
  count: number;
  activeSort: ProductSort;
  activeCollection: ProductCollection;
  activeRoomSlug?: string;
  activeCategoryName?: string;
  searchQuery?: string;
}

export function ProductsToolbar({
  count,
  activeSort,
  activeCollection,
  activeRoomSlug,
  activeCategoryName,
  searchQuery,
}: ProductsToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeRoom = getRoomBySlug(activeRoomSlug ?? searchParams.get("room") ?? undefined);

  function handleSortChange(sort: ProductSort) {
    const base = pathname.startsWith("/categories/") ? pathname : "/products";
    router.push(
      buildProductsUrl({
        basePath: base,
        room: activeRoomSlug ?? searchParams.get("room") ?? undefined,
        collection: activeCollection,
        sort,
        q: searchQuery ?? searchParams.get("q") ?? undefined,
      }),
      { scroll: false }
    );
  }

  const heading = searchQuery
    ? `Results for "${searchQuery}"`
    : activeCategoryName
    ? activeCategoryName
    : activeRoom
      ? activeRoom.name
      : collectionLabel(activeCollection);

  const subheading = searchQuery
    ? `${count} ${count === 1 ? "match" : "matches"} found`
    : activeRoom
    ? `${count} ${count === 1 ? "piece" : "pieces"} for ${activeRoom.name.toLowerCase()}`
    : activeCollection === "all"
      ? `${count} ${count === 1 ? "piece" : "pieces"} available`
      : activeCollection === "best-sellers"
        ? `${count} bestselling ${count === 1 ? "piece" : "pieces"}`
        : `${count} new ${count === 1 ? "arrival" : "arrivals"}`;

  return (
    <div className="flex flex-col gap-5 mb-8 pb-6 border-b border-border/80">
      <ProductsCollectionTabs activeCollection={activeCollection} />

      {searchQuery && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest/10 text-forest text-xs font-medium">
            Search: {searchQuery}
            <Link
              href={buildProductsUrl({
                room: activeRoomSlug ?? searchParams.get("room") ?? undefined,
                collection: activeCollection,
                sort: activeSort,
              })}
              className="text-forest/60 hover:text-forest ml-1"
              aria-label="Clear search"
            >
              ×
            </Link>
          </span>
        </div>
      )}

      {activeRoom && !activeCategoryName && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest/10 text-forest text-xs font-medium">
            🏠 {activeRoom.name}
            <Link
              href={buildProductsUrl({
                collection: activeCollection,
                sort: activeSort,
              })}
              className="text-forest/60 hover:text-forest ml-1"
              aria-label="Clear room filter"
            >
              ×
            </Link>
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-semibold text-forest">
            {heading}
          </h2>
          <p className="text-sm text-muted mt-0.5">{subheading}</p>
        </div>

        <div className="flex items-center gap-1.5 bg-white rounded-xl border border-border p-1 shrink-0">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSortChange(option.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeSort === option.value
                  ? "bg-forest text-white shadow-sm"
                  : "text-muted hover:text-forest hover:bg-cream"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
