import { Suspense } from "react";
import { ProductsAreaSkeleton } from "@/components/products/ProductsAreaSkeleton";
import { ProductsContent } from "@/components/products/ProductsContent";
import { ProductsHero } from "@/components/products/ProductsHero";
import { ProductsSidebar } from "@/components/products/ProductsSidebar";
import type { ProductCollection, ProductSort } from "@/lib/products/types";
import type { Category } from "@/lib/types";

interface ProductsListingProps {
  categories: Category[];
  activeCategory?: string;
  activeSort: ProductSort;
  activeCollection?: ProductCollection;
  activeRoomSlug?: string;
  searchQuery?: string;
  title?: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function ProductsListing({
  categories,
  activeCategory,
  activeSort,
  activeCollection = "all",
  activeRoomSlug,
  searchQuery,
  title = "All Products",
  description = "Explore our handcrafted solid wood furniture — desks, chairs, tables, bed sets, and more. Filter by category to find the perfect piece for your space.",
  breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products" },
  ],
}: ProductsListingProps) {
  const suspenseKey = `${activeCategory ?? "all"}-${activeRoomSlug ?? "all"}-${activeCollection}-${activeSort}-${searchQuery ?? ""}`;

  return (
    <>
      <ProductsHero
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />

      <section className="py-10 lg:py-14 bg-cream min-h-[60vh]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            <ProductsSidebar
              categories={categories}
              activeCategory={activeCategory}
              activeRoomSlug={activeRoomSlug}
              activeCollection={activeCollection}
              activeSort={activeSort}
              searchQuery={searchQuery}
            />

            <Suspense key={suspenseKey} fallback={<ProductsAreaSkeleton />}>
              <ProductsContent
                categorySlug={activeCategory}
                roomSlug={activeRoomSlug}
                sort={activeSort}
                collection={activeCollection}
                searchQuery={searchQuery}
                categories={categories}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
