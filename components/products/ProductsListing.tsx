import { ProductsAreaSkeleton } from "@/components/products/ProductsAreaSkeleton";
import { ProductsContent } from "@/components/products/ProductsContent";
import { ProductsHero } from "@/components/products/ProductsHero";
import { ProductsSidebar } from "@/components/products/ProductsSidebar";
import { getProducts } from "@/lib/products/queries";
import type { ProductCollection, ProductSort } from "@/lib/products/types";
import type { Category } from "@/lib/types";
import { Suspense } from "react";

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

export async function ProductsListing({
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
  const products = await getProducts({
    categorySlug: activeCategory,
    roomSlug: activeRoomSlug,
    sort: activeSort,
    collection: activeCollection,
    search: searchQuery,
  });

  const suspenseKey = `${activeCategory ?? "all"}-${activeRoomSlug ?? "all"}-${activeCollection}-${activeSort}-${searchQuery ?? ""}`;

  return (
    <>
      <ProductsHero
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        productCount={products.length}
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
                products={products}
                roomSlug={activeRoomSlug}
                sort={activeSort}
                collection={activeCollection}
                searchQuery={searchQuery}
                categories={categories}
                categorySlug={activeCategory}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
