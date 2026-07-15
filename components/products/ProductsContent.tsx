import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductsToolbar } from "@/components/products/ProductsToolbar";
import { getRoomBySlug } from "@/lib/data/rooms";
import type { ProductCollection, ProductSort } from "@/lib/products/types";
import type { Category, Product } from "@/lib/types";

interface ProductsContentProps {
  products: Product[];
  categorySlug?: string;
  roomSlug?: string;
  sort: ProductSort;
  collection: ProductCollection;
  searchQuery?: string;
  categories: Category[];
}

export function ProductsContent({
  products,
  categorySlug,
  roomSlug,
  sort,
  collection,
  searchQuery,
  categories,
}: ProductsContentProps) {
  const activeCategoryName = categories.find(
    (c) => c.slug === categorySlug
  )?.name;
  const activeRoom = getRoomBySlug(roomSlug);

  if (products.length === 0) {
    return (
      <div className="lg:col-span-9">
        <ProductsToolbar
          count={0}
          activeSort={sort}
          activeCollection={collection}
          activeRoomSlug={roomSlug}
          activeCategoryName={activeCategoryName}
          searchQuery={searchQuery}
        />
        <div className="text-center py-16 px-4 rounded-2xl bg-white border border-border">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-cream mb-5">
            <span className="text-xl">🪑</span>
          </div>
          <h2 className="font-serif text-xl font-semibold text-forest mb-2">
            {searchQuery
              ? `No results for "${searchQuery}"`
              : activeRoom
                ? `No products for ${activeRoom.name} yet`
                : "No products in this category yet"}
          </h2>
          <p className="text-muted text-sm max-w-sm mx-auto mb-6">
            {searchQuery
              ? "Try a different keyword or browse our full collection."
              : "Check back soon or explore our full collection of handmade furniture."}
          </p>
          <Link
            href="/products"
            className="inline-flex px-6 py-2.5 rounded-lg bg-forest text-white text-sm font-medium hover:bg-forest-light transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-9">
      <ProductsToolbar
        count={products.length}
        activeSort={sort}
        activeCollection={collection}
        activeRoomSlug={roomSlug}
        activeCategoryName={activeCategoryName}
        searchQuery={searchQuery}
      />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-[fadeUp_0.4s_ease-out_both]"
            style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
