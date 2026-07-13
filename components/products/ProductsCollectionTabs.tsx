"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProductCollection } from "@/lib/products/types";

const collectionTabs: { value: ProductCollection; label: string }[] = [
  { value: "all", label: "All Products" },
  { value: "best-sellers", label: "Best Sellers" },
  { value: "new-arrivals", label: "New Arrivals" },
];

interface ProductsCollectionTabsProps {
  activeCollection: ProductCollection;
}

export function ProductsCollectionTabs({
  activeCollection,
}: ProductsCollectionTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleCollectionChange(collection: ProductCollection) {
    const params = new URLSearchParams(searchParams.toString());

    if (collection === "all") {
      params.delete("collection");
    } else {
      params.set("collection", collection);
    }

    const query = params.toString();
    const base = pathname.startsWith("/categories/") ? pathname : "/products";
    router.push(query ? `${base}?${query}` : base, { scroll: false });
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
      {collectionTabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => handleCollectionChange(tab.value)}
          className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
            activeCollection === tab.value
              ? "bg-forest text-white border-forest shadow-sm"
              : "bg-white text-muted border-border hover:text-forest hover:border-forest/30"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
